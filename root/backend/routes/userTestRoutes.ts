import express, { Request, Response } from 'express';
const { spawn } = require('child_process'); // Importing the spawn function from the child_process module
import {User, UserTestModel} from '../models/UserTests';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
const fs = require('fs');

const router = express.Router();
const path = require('path');
let canSpawn = true;

// creates folder to upload pdfs
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer to store files in the uploads directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Defining model to be used when ingesting input for scraping
interface userTest {
    test: string;
    value: number;
    low: number;
    high: number;
    units: string;
};

router.post('/scraping', upload.single('file'), async (req: Request, res: any) => {
// POST endpoint to handle data scraping from an uploaded file
// This route is responsible for initiating a server-side process that executes a Python script to scrape data from a specified PDF file.
// It uses a semaphore (canSpawn) to prevent multiple instances of the scraping process from running simultaneously, which ensures system stability and avoids potential data corruption or performance issues.
// The endpoint checks if scraping is available and if not, returns a status indicating that scraping is currently unavailable. If available, it locks the process, runs the script, and upon completion, unlocks the process for future use.
// The script's output is collected, and any errors encountered during execution are handled gracefully and reported back to the client.
    if (!canSpawn) {
        return res.status(429).send({ message: "Scraping is currently unavailable. Please try again later." });
    }

    const userId = req.body.userId; // Retrieve userId from the request body
    
    if (!userId) {
        return res.status(400).send({ message: "userId is required." });
    }

    if (!req.file) {
        return res.status(400).send({ message: "PDF file is required." });
    }

    canSpawn = false; // Update state to prevent re-entry
    const pdfPath = req.file.path;
    
    const runScraping = () => {
        return new Promise((resolve, reject) => {
            const spawn = require('child_process').spawn;
            // const path = require('path');
            // const pdfPath = path.resolve('src/scraping/quest1.pdf'); // update path for ocr
            const pythonProcess = spawn('python3.11', ['src/scraping/scraper.py', pdfPath, userId]);

            let dataString = ''; // Initialize a string to collect data from the script

            pythonProcess.stdout.on('data', (data: JSON) => {
                dataString += data.toString(); // Append data from stdout to dataString
            });

            pythonProcess.stderr.on('data', (data: JSON) => {
                console.error(`stderr: ${data}`);
                reject(data.toString()); // Reject the promise with the error string from stderr
            });

            pythonProcess.on('close', (code: number) => {
                console.log(`child process exited with code ${code}`);
                canSpawn = true; // Reset the semaphore once the process closes
                if (code === 0) {
                    resolve(dataString); // Resolve the promise if the script exits successfully
                } else {
                    reject(`child process exited with code ${code}`); // Otherwise, reject the promise with the exit code
                }
            });
        });
    };

    try {
        const response = await runScraping();
        console.log("Response is", response);
        res.send(response); // Send the scraped data as the response
    } catch (error) {
        canSpawn = true;
        res.status(500).send(`Error running Python script: ${error}`)
    } finally {
        // Delete the file after processing
        fs.unlink(pdfPath, (err: Error | null) => {
            if (err) {
                console.error(`Error deleting file ${pdfPath}:`, err);
            } else {
                console.log(`Successfully deleted file ${pdfPath}`);
            }
        });
    };

});


// POST endpoint to store scraped test results into the database
// This route expects a JSON payload containing a 'userId' to associate the tests with a specific user,
// and a 'tests' array consisting of test objects each with fields: test (name), value, low, high, units.
// Each test object is validated and stored as part of the user's document in MongoDB.
// The output is an array of the successfully stored test objects or an error message if the process fails.
router.post('/scraped-tests', async (req: Request, res: any) => {
    const userId = req.body.userId;  // Extract the user ID from the request body
    const tests = req.body.tests as userTest[];  // Extract and type-cast the array of tests from the request body

    const sentTests = [];  // Array to hold the tests that have been successfully added to the database
    const user = await User.findOne({ uid: userId });  // Attempt to find the user by the provided userId
    if (!user) {
        return res.status(404).send({ message: "User not found" });  // Return a 404 error if the user is not found
    }

    // Iterate over each test object from the 'tests' array
    for (const test of tests) {
        try {
            // Create a new test model instance with the test data
            const userTest = new UserTestModel({
                name: test.test,
                value: test.value,
                lowRef: test.low,
                highRef: test.high,
                lowRefPercentage: 5,
                highRefPercentage: 90,
                unit: test.units,
            });

            user.tests.push(userTest);  // Add the new test to the user's tests array
            await user.save();  // Save the updated user document to the database
            console.log("Current userTest is ", userTest);  // Log the added test for debugging
            sentTests.push(userTest);  // Add the new test to the sentTests array to be returned in the response

        } catch (error) {
            res.status(500).send(`Error adding user test: ${error}`);  // Handle any errors that occur during the test addition
            return;
        }
    };
    res.send(sentTests);  // Send the array of added tests as the response
});


// POST endpoint to add a new test result to a specific user's record
// This endpoint expects a JSON payload with 'userId' to identify the user and test details including:
// 'test' (name of the test), 'value' (numeric result), 'lowRef' (lower reference value), 'highRef' (higher reference value),
// 'lowRefPercentage', 'highRefPercentage', and 'unit' (measurement unit).
// The endpoint first validates the presence of the user by the given userId. If the user exists, it proceeds to add the new test
// to the user's test array in their document and saves the changes to the database.
// It returns the newly added test object or an appropriate error message if the operation fails.
router.post('/add-test', async (req: Request, res: any) => {
    const userId = req.body.userId; // Extract the user ID from the request body
    // Destructure and extract test details from the request body
    const { test, value, lowRef, highRef, lowRefPercentage, highRefPercentage, unit } = req.body;

    try {
        const user = await User.findOne({ uid: userId }); // Find the user in the database by userId
        if (!user) {
            // If no user is found, return a 404 Not Found error
            return res.status(404).send({ message: "User not found" });
        }

        // Create a new test model instance with the provided test data
        const userTest = new UserTestModel({
            name: test,
            value: value,
            lowRef: lowRef,
            highRef: highRef,
            lowRefPercentage: lowRefPercentage || 5, // Default to 5 if not provided
            highRefPercentage: highRefPercentage || 90, // Default to 90 if not provided
            unit: unit,
        });

        user.tests.push(userTest); // Add the new test to the user's list of tests
        await user.save(); // Save the updated user document with the new test

        res.send(userTest); // Respond with the added test object
    } catch (error) {
        // Handle any errors during the find or save operations
        res.status(500).send(`Error adding user test: ${error}`);
    }
});


// POST endpoint to retrieve a specific test for a user by test name and user ID.
// This endpoint expects a JSON payload containing 'userId' to identify the user and 'testName' to specify the test.
// It performs a database lookup to find the user by 'userId'. If the user exists, it then searches for the test within the user's tests array.
// If the test is found, it is returned as a response; otherwise, it sends an appropriate error message if the user or the test cannot be found.
router.post('/get-test/', async (req: Request, res: any) => {
    const testName = String(req.body.testName); // Extract the testName from the request body and ensure it is a string
    const userId = req.body.userId; // Extract the userId from the request body

    //console.log("we reached this point"); // Debugging statement to confirm the endpoint is reached

    try {
        const user = await User.findOne({ uid: userId }); // Look up the user in the database by the unique userId
        if (!user) {
            // If no user is found with the provided userId, return a 404 Not Found error with a message
            return res.status(404).send({ message: "User not found" });
        }

        // Search for the test by name within the user's list of tests
        const test = user.tests.find((test) => test.name === testName);
        if (!test) {
            // If the test with the specified name is not found, return a 404 Not Found error with a message
            return res.status(404).send({ message: "Test not found" });
        }

        // If the test is found, send it as a response
        res.send(test);
    } catch (error) {
        // If an error occurs during the operation, send a 500 Internal Server Error with the error message
        res.status(500).send(`Error retrieving test: ${error}`);
    }
});

// POST endpoint to retrieve all test results associated with a specific user identified by userId.
// This endpoint expects a JSON payload containing 'userId' to find the user in the database.
// After locating the user, the endpoint retrieves and returns all tests recorded under that user.
// The response includes the userId, the total number of tests, and the tests themselves as an array.
// If the user cannot be found or another error occurs, an appropriate error message is returned.
router.post('/get-tests', async (req: Request, res: any) => {
    const userId = req.body.userId;  // Extract the userId from the request body

    try {
        const user = await User.findOne({ uid: userId });  // Attempt to find the user by userId in the database
        if (!user) {
            // If no user is found with the given userId, return a 404 Not Found error with a user not found message
            return res.status(404).send({ message: "User not found" });
        }
        const tests = user.tests;  // Retrieve the tests array from the found user document
        console.log(`${userId} has ${tests.length} test/s`);  // Log the number of tests found for debugging purposes

        // Group the tests by name into dictionary
        const testsByName: { [name: string]: typeof tests } = {};
        tests.forEach(test => {
            if(!testsByName[test.name]) {
                testsByName[test.name] = [];
            }
            testsByName[test.name].push(test);
        });
        // Sort each array in the dictionary by ascending order
        for(const name in testsByName) {
            testsByName[name].sort((a, b) => a.date.getTime() - b.date.getTime());
        }
        // Create a 2D array with the values
        const array2D = Object.values(testsByName);

        const response = {
            "userId": userId,  // Include the userId in the response
            "length": tests.length,  // Include the count of tests
            "tests": array2D  // Include the array of test arrays
        };
        res.send(response);  // Send the constructed response object with the tests information
    } catch (error) {
        // If an error occurs during the database operation, send a 500 Internal Server Error with the error message
        res.status(500).send(`Error retrieving tests: ${error}`);
    }
});


// PUT endpoint to update reference values (lowRefPercentage, highRefPercentage, unit) for all tests
// associated with a specific user and test name. (Primarily the lowRef and highRef)
// The endpoint expects a JSON payload containing 'userId', 'testName', and optionally 'lowRefPercentage',
// 'highRefPercentage', and 'unit'. It updates these values for all tests matching the testName under the specified user.
// If successful, the endpoint returns the list of updated test records. If the user cannot be found or no tests match the criteria,
// it sends an appropriate error response.
router.put('/update-tests', async (req: Request, res: any) => {
    const userId = req.body.userId;  // Extract the user ID from the request body to identify which user's tests to update
    const testName = req.body.testName;  // Extract the test name to identify which tests to update
    const { lowRefPercentage, highRefPercentage, unit } = req.body;  // Extract optional new reference values and unit from the request

    const updatedTests = [];  // Initialize an array to collect the updated tests for response

    try {
        const user = await User.findOne({ uid: userId });  // Attempt to find the user by userId
        if (!user) {
            // Return a 404 error if no user is found for the given userId
            return res.status(404).send({ message: "User not found" });
        }

        // Iterate over each test of the found user
        for (const test of user.tests) {
            if (test.name === testName) {  // Check if the test's name matches the specified testName
                // Create a new instance of the test model with updated values
                const updatedUserTest = new UserTestModel({
                    name: test.name,
                    value: test.value,
                    lowRef: test.lowRef,
                    highRef: test.highRef,
                    lowRefPercentage: lowRefPercentage || test.lowRefPercentage,  // Use new value or default to existing
                    highRefPercentage: highRefPercentage || test.highRefPercentage,  // Use new value or default to existing
                    unit: unit || test.unit,  // Use new unit or default to existing
                });
                await updatedUserTest.save();  // Save the updated test model to the database
                updatedTests.push(updatedUserTest);  // Add the updated test to the response array
            }
        }

        res.send(updatedTests);  // Send the array of updated tests as the response
    } catch (error) {
        // Handle any errors that occur during the update process
        res.status(500).send(`Error updating tests: ${error}`);
    }
});


// PUT endpoint to update a specific test for a given user identified by userId.
// This endpoint expects a JSON payload containing 'userId', 'testName', 'date', and the new values for 
// 'value', 'lowRef', 'highRef', 'lowRefPercentage', 'highRefPercentage', and 'unit' that need to be updated.
// It searches for the user by userId and then attempts to find the specific test by testName and date.
// If the user or the test is not found, it sends an appropriate error message. If found, it updates the specified 
// test with new values and returns the updated test data.
router.put('/update-test', async (req: Request, res: any) => {
    const userId = req.body.userId;  // Extract the userId from the request to identify the user
    const testName = req.body.testName;  // Extract the testName to identify the specific test to update
    const date = req.body.date;  // Extract the date to precisely identify the test if there are multiple with the same name
    const { value, lowRef, highRef, lowRefPercentage, highRefPercentage, unit } = req.body;  // Extract new test values from the request

    try {
        const user = await User.findOne({ uid: userId });  // Find the user in the database by userId
        if (!user) {
            // Return a 404 Not Found error if the user does not exist
            return res.status(404).send({ message: "User not found" });
        }
        // Find the specific test by testName and date within the user's tests
        const test = user.tests.find((test) => test.id === testName && test.date === date);
        if (!test) {
            // Return a 404 Not Found error if the specific test does not exist
            return res.status(404).send({ message: "Test not found" });
        }

        // Update the test with new or existing values
        const updatedUserTest = new UserTestModel({
            name: testName || test.name,
            value: value || test.value,
            lowRef: lowRef || test.lowRef,
            highRef: highRef || test.highRef,
            lowRefPercentage: lowRefPercentage || test.lowRefPercentage,
            highRefPercentage: highRefPercentage || test.highRefPercentage,
            unit: unit || test.unit,
        });

        await updatedUserTest.save();  // Save the updated test to the database

        const response = {
            "userId": userId,
            "testName": testName,
            "updatedTest": updatedUserTest  // Provide the updated test data in the response
        };

        res.send(response);  // Send the updated test as the response
    } catch (error) {
        // Handle any errors during the update process
        res.status(500).send(`Error updating user test: ${error}`);
    }
});


export default router;
