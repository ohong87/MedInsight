#!/Library/Frameworks/Python.framework/Versions/3.11/bin/python3

from PyPDF2 import PdfReader
import json
import requests
from PIL import Image
import re
import pytesseract
import fitz 
import sys


# {test : str, value : int, low : int, high : int, units : str}
data = {}

data["userId"] = sys.argv[2]
data["tests"] = []

r = requests.get(url = "http://localhost:8080/tests/all")
master_list = r.json()
all_tests = {}

# converts JSON to Python dict
for item in master_list:
    all_tests[item['name']] = {
        "highRef": item['highRef'],
        "lowRef": item['lowRef'],
        "unit": item['unit']
    }

# Open the PDF file
pdf_path = sys.argv[1]  # Get the path from arguments
reader = PdfReader(pdf_path)

pageCount = len(reader.pages) 
isQuest = False

# Visitor function to check if PDF is from Quest
def checkPdf(text, cm, tm, fontDict, fontSize):
    global isQuest
    x = tm[4]
    y = tm[5]

    if x == 0 and y == 25.884001 and "Quest, Quest Diagnostics, the associated logo and all associated Quest Diagnostics marks are the trademarks of Quest Diagnostics." == text:
        isQuest = True


# Check which PDF format
page = reader.pages[0]
page.extract_text(visitor_text=checkPdf)

# Extract text from QUEST pdf using in-line scraping
# Author - Oscar
def visitor_body_quest(text, cm, tm, fontDict, fontSize):
    tempLine = text.strip().split()
    testName = ""

    # checks if test is in the all_tests dictionary
    if len(tempLine) > 2 and (tempLine[0].upper() + " " + tempLine[1].upper() + " " + tempLine[2].upper()) in all_tests:
        testName = tempLine[0].upper() + " " + tempLine[1].upper() + " " + tempLine[2].upper()
    elif len(tempLine) > 1 and (tempLine[0].upper() + " " + tempLine[1].upper()) in all_tests:
        testName = tempLine[0].upper() + " " + tempLine[1].upper()
    elif tempLine and tempLine[0].strip(",").upper() in all_tests:
        testName = tempLine[0].strip(",").upper()
    else:
        # if not in dictionary, skip
        return
    
    # if test is a repeat or not found, skip
    if testName in data or testName == "":
        return

    # finds test result
    testValue = None
    for i in range(len(tempLine)):
        num = True

        # checks if current text is a float
        for j in tempLine[i]:
            if j != "." and not j.isnumeric():
                num = False
                break
    
        # if value is a float, update testValue and exit
        if num:
            testValue = float(tempLine[i])
            break
    
    # if no result detected, skip
    if not testValue:
        return
    
    newTest = {
        "test" : testName,
        "value" : testValue,
        "low" : all_tests[testName]['lowRef'],
        "high" : all_tests[testName]['highRef'],
        "units" : all_tests[testName]['unit']
    }
    data["tests"].append(newTest)

# Extract text from Fusion pdf using OCR
# Author - Minh
def OCR():
    # Corrections for OCR script
    corrections = {
        "EOSINOPHILS TOTA": "EOSINOPHILS TOTAL",
        "SGOT (AST)": "SGOT",
        "SGPT (ALT)": "SGPT",
        "BUN / CREA RATIO": "BUN/ CREA RATIO",
        "GLOBULIN (CALC)": "GLOBULIN",
        "VLDL(CALC)": "VLDL"
        # Add more corrections as needed
    }

    # Correct test names in the lines if necessary
    def correct_test_names(line, corrections):
        for incorrect, correct in corrections.items():
            if incorrect in line:
                line = line.replace(incorrect, correct)
        return line

    pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'
    pdf_document = fitz.open(pdf_path)

    # Initialize a dictionary to hold OCR results
    pdf_text = {}
    parsing = ""

    # Iterate over each page in the PDF
    for page_num in range(len(pdf_document)):
        # Convert the PDF page to an image
        page = pdf_document[page_num]

        # Convert the PDF page to a pixmap (an image)
        zoom = 2  # Increase this if the default resolution is not sufficient
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        # Perform OCR on the image
        text = pytesseract.image_to_string(img)
        
        # Store the text in a dictionary using the page number as the key
        pdf_text[page_num] = text
        parsing += text

    # Close the PDF after processing
    pdf_document.close()

    #lines = [line.strip() for line in output.split('\n') if line.strip() != '']
    lines = [line.strip() for line in parsing.split('\n') if line.strip() != '']

    # The pattern to match the observations and their results, reference ranges, and date/status
    pattern = re.compile(r"([A-Za-z0-9/\s_-]+?)\s*['\?\*]\s*([\d.,]+)\s*([\d.,-]+)\s*([A-Za-z%µ/\.]+)")

    for line in lines:
        # Check if any test is mentioned in the line
        line = correct_test_names(line, corrections)
        match = pattern.search(line)

        if any(test in line for test in all_tests):
            if match:
                # Extract the test name, value, reference range, and units
                test_name = match.group(1).upper()
                value = float(match.group(2).replace(',', '.'))

                # Construct the dictionary for the current test
                newTest = {
                    "test" : test_name,
                    "value" : value,
                    "low" : all_tests[test_name]['lowRef'],
                    "high" : all_tests[test_name]['highRef'],
                    "units" : all_tests[test_name]['unit']
                }
                data["tests"].append(newTest)


# Extract text from each page
if isQuest:
    for i in range(pageCount):
        page = reader.pages[i]
        page.extract_text(visitor_text=visitor_body_quest)
else:
    OCR()


data = json.dumps(data, indent=4)
# print(data)

# Send a post request to the backend
url = "http://localhost:8080/userTest/scraped-tests"
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers, data=data)

try:
    response.raise_for_status()
    print("200")
    # Further processing if response is successful
except requests.exceptions.HTTPError as err:
    print(err)
