from PyPDF2 import PdfReader

all_tests = { # {test : [low, high, units]}
    "WBC" : [4.5, 12.5, "10^3.UL"],
    "RBC" : [3.8, 5.2, "10^6.UL"],  
    "PLATELETS" : [130, 440, "10^3.UL"],
    "PLATELET" : [130, 440, "10^3.UL"],
    "MCV" : [78, 98, "fL"],
    "MCHC" : [32, 36, "g/dL"],
    "MCH" : [26, 34, "pg"],
    "HGB" : [11.9, 15.2, "g/dL"],
    "HCT" : [35.0, 45.0, "%"],
    "RDW" : [12.1, 17.9, "%"],
    "NEUTROPHILS" : [37, 80, "%"],
    "LYMPHOCYTES" : [20, 50, "%"],
    "MONOCYTES" : [0, 11, "%"],
    "EOSINOPHILS" : [0, 6, "%"],
    "BASOPHILS" : [0, 2, "%"],
    "NUCLEATED RBC" : [0, 0.2, "WBC"],
    "ABSOLUTE NEUTROPHILS" : [1400, 6500, "Cells/uL"],
    "ABSOLUTE LYMPHOCYTES" : [850, 3900, "Cells/uL"],
    "ABSOLUTE NEUTR" : [1400, 6500, "Cells/uL"],
    "ABSOLUTE LYMPHS" : [850, 3900, "Cells/uL"],
    "ABSOLUTE MONOCYTES" : [200, 950, "Cells/uL"],
    "ABSOLUTE EOSINOPHILS" : [15, 500, "Cells/uL"],
    "MONOCYTES" : [200, 950, "Cells/uL"],
    "EOSINOPHILS" : [0, 500, "Cells/uL"],
    "EOSINOPHILS TOTAL" : [0, 500, "Cells/uL"],
    "BASOPHILS" : [0, 200, "Cells/uL"],
    "BASOPHILS TOTAL" : [0, 200, "Cells/uL"],
    "ALBUMIN" : [3.5, 5.3, "g/dL"],
    "TOTAL BILIRUBIN" : [0.3, 1.3, "mg/dL"],
    "BILIRUBIN" : [0, 1.3, "mg/dL"],
    "CALCIUM" : [8.6, 10.3, "mg/dL"],
    "CHLORIDE" : [99, 100, "mEw/L"],
    "CREATININE" : [0.6, 1.5, "mg/dL"],
    "GFR NON-AFRICAN AMERICAN" : [60, 150, "mL/min"],
    "GFR NonAfr F" : [60, 150, "mL/min"],
    "GFR AFRICAN AMERICAN" : [60, 150, "mL/min"],
    "GFR Afr F" : [60, 150, "mL/min"],
    "GLUCOSE" : [65, 99, "mg/dL"],
    "ALKALINE PHOSPHATASE" : [35, 150, "U/L"],
    "ALK PHOSPHATASE" : [35, 150, "U/L"],
    "POTASSIUM" : [3.2, 5.5, "mEq/L"],
    "TOTAL PROTEIN" : [6.0, 8.3, "g/dL"],
    "SODIUM" : [134, 146, "mEq/L"],
    "SGOT" : [3, 38, "U/L"],
    "AST" : [3, 38, "U/L"],
    "unUN" : [8, 25, "mg/dL"],
    "CO2" : [19, 32, "mEq/L"],
    "CARBON DIOXIDE" : [19, 32, "mEq/L"],
    "SGPT" : [3, 48, "U/L"],
    "ALT" : [3, 48, "U/L"],
    "BUN" : [7, 25, "mg/dL"],
    "UREA NITROGEN" : [7, 25, "mg/dL"],
    "BUN TO CREATININE RATIO" : [3, 40, "mg/dL"],
    "BUN/CREATININE RATIO" : [3, 40, "mg/dL"],
    "BUN/ CREA RATIO" : [3, 40, "mg/dL"],
    "GLOBULIN" : [1.6, 4.2, "g/dL"],
    "A/G RATIO" : [1.0, 2.2, ""],
    "ALBUMIN/GLOBULIN RATIO" : [1.0, 2.2, ""],
    "ANION GAP" : [3, 16, "mEq/L"],
    "HIGH SENSI CRO" : [0, 3.1, "mg/L"],
    "HIGH SENSITIVITY CRO" : [0, 3.1, "mg/L"],
    "HEMOGLOBIN A1C" : [4.0, 5.7, "%"],
    "GLYCOHEMOGLOBIN" : [4.0, 5.7, "%"],
    "GLYCOHGB" : [4.0, 5.7, "%"],
    "TSH" : [0.55, 4.78, "uIU/mL"],
    "PROLACTIN" : [2.8, 28, "ng/mL"],
    "CHOLESTEROL" : [0, 200, "mg/dL"],
    "HDL-CHOLESTEROL" : [39, 200, "mg/dL"],
    "HDL-CHOLESTEROL" : [39, 200, "mg/dL"],
    "NON-HDL CHOLESTEROL" : [0, 160, "mg/dL"],
    "NON-HDL-C": [0, 160, "mg/dL"],
    "NON HDL CHOLESTEROL" : [0, 160, "mg/dL"],
    "NON HDL-C": [0, 160, "mg/dL"],
    "LDL-CHOLESTEROL" : [50, 129, "mg/dL"],
    "LDL" : [50, 129, "mg/dL"],
    "VLDL" : [0, 40, "mg/dL"],
    "CHOLESTEROL/HDL RATIO" : [0, 3.9, "mg/dL"],
    "CHOL/HDL RATIO" : [0, 3.9, "mg/dL"],
    "TRIGLYCERIDES" : [45, 155, "mg/dL"],
    "SPECIFIC GRAVITY" : [1.003, 1.035, ""],
    "PH" : [4.5, 8.0, ""],
    "UROBILINOGEN" : [0.2, 1.0, "ng/mL"],
    "URINE WBC" : [0, 5, "HPF"],
    "URINE RBC" : [0, 3, "HPF"],
    "VITAMIN B-12" : [211, 911, "pg/mL"],
    "VITAMIN B12" : [211, 911, "pg/mL"],
    "FOLIC ACID" : [5.38, 100, "ng/mL"],
    "VITAMIN D" : [25, 100, "ng/mL"],
    "EGFR" : [60, 150, "mL/min"],
    "HEMOGLOBIN" : [11.7, 15.5, "g/dL"],
    "HEMATOCRIT" : [35.0, 45.0, "%"],
    "FOLATE" : [5.38, 100, "ng/mL"],
    "PROGESTERONE" : [0.3, 22.2, "ng/mL"],
    "FSH" : [2.5, 116.3, "mIU/mL"],
    "LH" : [.5, 54.7, "mIU/mL"],
    "ESTRADIOL" : [12.5, 166.0, "pg/mL"],
}
data = {} # output to be returned as json

# Open the PDF file
reader = PdfReader("/Users/oscarh/Projects/MedInsight/root/backend/pdfs/quest1.pdf") # temp path for Oscar's local computer
pageCount = len(reader.pages) # get number of pages in pdf
parts = []

def visitor_body(text, cm, tm, fontDict, fontSize):
    y = tm[5] # get y coordinate of text -> not using rn
    tempLine = text.strip().split()

    if tempLine and tempLine[0].upper() in all_tests:
        print(tempLine)
        # data[tempLine[0].upper()] = [tempLine[1], tempLine[3], all_tests[tempLine[0].upper()][2]]


        parts.append(text)

for i in range(pageCount):
    page = reader.pages[i]
    page.extract_text(visitor_text=visitor_body)

text_body = "".join(parts)
# print(text_body)


# TODO: extract relevant data and store in data dictionary and send json to db