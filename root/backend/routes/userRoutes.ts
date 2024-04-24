import express from "express";
import { User } from "../models/UserTests";

const router = express.Router();

// Create a user
// Endpoint for creating a new user with an empty set of tests
router.post('/', async (req, res) => {
    try {
        const userId = req.body.uid;
        console.log(userId); // Log the received userId
        const userToAdd = new User({ uid: userId, tests: []});
        await userToAdd.save(); // Save the new user document in MongoDB
        console.log('User added to MongoDB');
        res.send({ message: `${userId} created successfully` });
    } catch (error) {
        console.log(error); // Log any errors
        res.status(500).send({ message: "Error creating user" });
    }
});

// Read all users
// Endpoint to retrieve all user documents from the database
router.get('/', async (req, res) => {
    const data = await User.find(); // Fetch all users
    const rowCount = data.length;
    console.log(rowCount); // Log the number of users fetched
    res.send(data);
});

// Read a user by ID
// Endpoint to retrieve a specific user by their unique identifier
router.post('/get', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findOne({ uid: userId });
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: `User with ID ${userId} not found` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Update a user by ID
// Endpoint to update details of a specific user identified by their unique identifier
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    // Placeholder for update logic
    res.send({ message: `User with ID ${userId} updated successfully` });
});

// Delete a user by ID
// Endpoint to delete a specific user by their unique identifier
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    // Placeholder for deletion logic
    res.send({ message: `User with ID ${userId} deleted successfully` });
});

// Delete all users
// Endpoint to delete all user documents from the database
router.delete('/admin-all-users-deletion', async (req, res) => {
    try {
        await User.deleteMany();
        console.log('All users deleted');
        res.send({ message: "All users deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

export default router;
