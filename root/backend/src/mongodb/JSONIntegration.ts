import fs from 'fs';
import path from 'path';

import TestModel from '../../models/Test';

interface TestDetail {
  test?: string;
  low: number | null;
  high: number | null;
  myLow: number | null;
  myHigh: number | null;
  result: number | null;
  unit: string | null;
}

interface Category {
  [key: string]: TestDetail; // Note: Not an array here based on your JSON structure
}

async function getDataFromJSONFile() {
    // Get data from JSON file
    const filePath = path.join(__dirname, '../scraping/all_tests.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data: Category = JSON.parse(jsonData);

    console.log(data)

    // Iterate over each category
    for (const category in data) {
        console.log(`Category: ${category}`);
        const testDetail = data[category]; // Direct access since it's not an array
        console.log(`The test is: `, testDetail);

        // Now, you can directly access the properties of testDetail
        console.log(`Test: ${category}`);
        console.log(`LowRef: ${testDetail.low}`, `HighRef: ${testDetail.high}`, `MyLowRef: ${testDetail.myLow}`, `MyHighRef: ${testDetail.myHigh}`, `Observation: ${testDetail.result}`, `Units: ${testDetail.unit}`);

        // Add data to MongoDB
        const testToAdd = new TestModel({ name: category, highRef: testDetail.high, lowRef: testDetail.low, unit: testDetail.unit});
        try {
            await testToAdd.save();
            console.log('Test added to MongoDB');
        } catch (error) {
            console.log(error);
        }
    }
}

export default getDataFromJSONFile;
