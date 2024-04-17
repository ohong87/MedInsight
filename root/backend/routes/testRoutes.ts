import express from "express";
import TestModel from "../models/Test"; // Import the TestModel to interact with the Test collection in MongoDB
import getDataFromJSON from "../src/mongodb/JSONIntegration"; // Import function to fetch data from a JSON source

const router = express.Router(); // Create a new router object to handle routes

// Endpoint to initiate data download from a local Google Sheet
router.get('/download', (req, res) => {
    getDataFromJSON(); // Call the function to fetch data from Google Sheets
    res.send({ message: 'Downloading data from Google Sheet' }); // Send a response back to the client
});
  
// Endpoint to delete all records from the Test collection in MongoDB
router.get('/delete', async (req, res) => {
    await TestModel.deleteMany({}); // Use the deleteMany method to remove all documents
    res.send({ message: 'All data deleted from MongoDB' }); // Confirm deletion with a response
});
  
// Endpoint to retrieve all records from the Test collection
router.get('/all', async (req, res) => {
    const data = await TestModel.find(); // Fetch all documents from the Test collection
    const rowCount = data.length; // Count the number of documents retrieved
    console.log(rowCount); // Log the count to the console
    res.send(data); // Send the retrieved documents back to the client
});

// Export the configured router
export default router;
