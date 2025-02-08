import pdfplumber
import pandas as pd
import re

pdf_path = "exams.pdf"

# Define the column order you need
columns = ["Course Number", "Course Title", "Instructor", "Time", "Location", "Date", "Section", "Subject"]
data = []
current_subject = None  # Track subject headers

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()  # Extract text from page
        if text:
            lines = text.split("\n")
            for line in lines:
                # Identify subject headers
                if re.match(r"^[A-Za-z&\s]+$", line.strip()) and len(line.strip().split()) < 5:
                    current_subject = line.strip()

                # Match course details using regex
                match = re.match(
                    r"(\d{5,6})\s+(\S+)\s+(.+?)\s+([A-Za-z]+day, \w+ \d{1,2}, \d{4})\s+(\d{1,2}:\d{2}[ap]m-\d{1,2}:\d{2}[ap]m)\s+(Remote|In Person)\s+(.+?)\s+([^\d]+)\s*(\d*)$",
                    line
                )

                if match:
                    course_number, section, course_title, date, time, delivery_mode, location, instructor, extra_numbers = match.groups()
                    
                    # If there are extra numbers, append them to location
                    if extra_numbers:
                        location += " " + extra_numbers

                    data.append((course_number, course_title, instructor.strip(), time, location.strip(), date, section, current_subject))

# Convert to DataFrame with the correct column order
df = pd.DataFrame(data, columns=columns)

# Save to Excel
df.to_excel("output.xlsx", index=False)

print("Data extraction complete. Check 'output.xlsx'")
