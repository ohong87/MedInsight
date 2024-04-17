import { UserTestModel } from "../../models/UserTests";

interface IUserTest extends Document {
    name: string;
    myLow: number | null;
    myHigh: number | null;
    highRef: number | null;
    lowRef: number | null;
    lowRefPercentage: number | 5;
    highRefPercentage: number | 90;
    unit: string;
}

interface Category {
  [key: string]: IUserTest; // Note: Not an array here based on your JSON structure
}

async function getDataFromJSONData(jsonData : any, userId: string) {
    // Get data from JSON data
    const data: Category = JSON.parse(jsonData);

    console.log(data)

    // Iterate over each category
    for (const category in data) {
        console.log(`Category: ${category}`);
        const testDetail = data[category]; // Direct access since it's not an array
        console.log(`The test is: `, testDetail);

        // Now, you can directly access the properties of testDetail
        console.log(`Test: ${category}`);
        // console.log(`LowRef: ${testDetail.low}`, `HighRef: ${testDetail.high}`, `MyLowRef: ${testDetail.myLow}`, `MyHighRef: ${testDetail.myHigh}`, `Observation: ${testDetail.result}`, `Units: ${testDetail.unit}`);

        // Add data to MongoDB
        const testToAdd = new UserTestModel({ name: category, highRef: testDetail.high, lowRef: testDetail.low, unit: testDetail.unit});
        try {
            await testToAdd.save();
            console.log('Test added to MongoDB');
        } catch (error) {
            console.log(error);
        }
    }
}

export default getDataFromJSONData;