import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Test model, defining the structure of a test document.
interface ITest extends Document {
    name: string;       // Name of the test
    highRef: number;    // Upper reference value for the test
    lowRef: number;     // Lower reference value for the test
    unit: string;       // Measurement unit for the test values
}

// Schema definition for the Test model.
const TestSchema: Schema = new Schema({
    name: { type: String, required: true },        // Name field, required
    highRef: { type: Number, required: true },     // Upper reference limit, passed to each userTest
    lowRef: { type: Number, required: true },      // Lower reference limit, passed to each userTest
    unit: { type: String, required: true }         // Unit of measure, required
});

// Mongoose model for Test, based on the defined schema.
const TestModel = mongoose.model<ITest>('Test', TestSchema);

// Export the TestModel for use in other parts of the application.
export default TestModel;

