import mongoose, { Schema, Document } from 'mongoose';

// Interface for UserTest model, defines the structure for test records in the database.
interface IUserTest extends Document {
    name: string;                 // Name of the test
    value: number;                // Actual value obtained from the test
    highRef: number;              // Upper reference limit for the test
    lowRef: number;               // Lower reference limit for the test
    lowRefPercentage: number,     // Percentage of lower boundary reference usage
    highRefPercentage: number,    // Percentage of upper boundary reference usage
    unit: string;                 // Measurement unit for the test value
    date: Date;                   // Date when the test was conducted
}

// Schema definition for UserTest.
const UserTestSchema: Schema = new Schema({
    name: { type: String, required: true },  // Test name
    value: { type: Number, required: true }, // Test value
    lowRef: { type: Number, required: true }, // Lower reference limit based on test directory
    highRef: { type: Number, required: true }, // Upper reference limit based on test directory
    lowRefPercentage: { type: Number, required: true, default: 5 }, // Default low ref percentage set to 5%
    highRefPercentage: { type: Number, required: true, default: 90 }, // Default high ref percentage set to 90%
    unit: { type: String, required: true }, // Unit of measurement,
    date: { type: Date, default: Date.now } // Date of test with a default value of the current date/time.
});

// Mongoose model for UserTest, using the defined schema.
const UserTestModel = mongoose.model<IUserTest>('UserTest', UserTestSchema);

// Interface for User model, defines the structure for user records.
interface IUser extends Document {
    uid: string;            // Unique identifier for the user, passed by GoogleAuth
    tests: IUserTest[];     // Array of tests associated with the user
    createdAt: Date;        // Timestamp for when the user record was created
}

// Schema definition for User.
const UserSchema: Schema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true // Ensure each UID is unique across all user documents
    },
    tests: [UserTestSchema], // Embedding UserTest documents directly within a User document.
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date/time when a new user is created.
    }
});

// Mongoose model for User, using the defined schema.
const User = mongoose.model<IUser>('User', UserSchema);

// Exporting the models to be used elsewhere in the application.
export { User, UserTestModel };
