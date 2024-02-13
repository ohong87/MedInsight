from PyPDF2 import PdfReader

all_tests = {} # {test : range}
data = {} # output to be returned as json

# Open the PDF file
reader = PdfReader("/Users/oscarh/Projects/MedInsight/root/backend/pdfs/quest2.pdf") # temp path for Oscar's local computer
page = reader.pages[3]  # Change 0 to the page number you're interested in, zero-indexed

parts = []

def visitor_body(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    parts.append(text)

page.extract_text(visitor_text=visitor_body)
text_body = "".join(parts)

print(text_body)

# TODO: extract relevant data and store in data dictionary and send json to db