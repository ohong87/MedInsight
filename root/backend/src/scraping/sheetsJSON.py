import pandas as pd
import json
from datetime import datetime

def default_converter(o):
    if isinstance(o, datetime):
        return o.__str__()  # or o.isoformat() for ISO formatted string
    elif o == "NaN":
        return None

# Load the Excel sheet
df = pd.read_excel('./Blood_Work.xlsx', sheet_name='Data', skiprows=4)

# Initialize the structure
data_structure = {}

# Assuming the first column contains test names or categories, and subsequent columns contain details
for index, row in df.iterrows():
    category = row['Unnamed: 0']
    if pd.isna(category):  # Skip rows that don't have a category/test name
        continue

    if category == 'Others':
        break
    elif category == 'CBC (Complete Blood Count)' or category == 'Complete Metabolic':
        continue
    elif category not in data_structure:
        data_structure[category] = []
    
    # Assuming the structure of details starts from 'Unnamed: 1' and goes right
    # Adjust column names as per the actual structure of your sheet
    test_details = {
        "LowRef": row.get('Unnamed: 1'),
        "HighRef": row.get('Unnamed: 2'),
        "MyLowRef": row.get('Unnamed: 3'),
        "MyHighRef": row.get('Unnamed: 4'),
        "Observation": row.get('Unnamed: 5'),
        # Add more fields as required
    }
    data_structure[category].append(test_details)

# Convert to JSON
json_output = json.dumps(data_structure, indent=4, default=default_converter)

# Print or save the JSON output
# print(json_output)  # For large datasets, it's better to save it to a file

# Saving to a file
output_file_path = 'complete_blood_work.json'
with open(output_file_path, 'w') as file:
    file.write(json_output)

print(f"JSON data has been saved to {output_file_path}.")
