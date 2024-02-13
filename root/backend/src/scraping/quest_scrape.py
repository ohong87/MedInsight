from PyPDF2 import PdfReader

# Open the PDF file
reader = PdfReader("/Users/oscarh/Projects/MedInsight/root/backend/pdfs/quest1.pdf") # temp path for Oscar's local computer
page = reader.pages[0]  # Change 0 to the page number you're interested in, zero-indexed

parts = []

def visitor_body(text, cm, tm, fontDict, fontSize):
    y = tm[5]
    if 33 <= y <= 544:
        parts.append(text)

page.extract_text(visitor_text=visitor_body)
text_body = "".join(parts)

print(text_body)
