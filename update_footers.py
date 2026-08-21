import re
import glob

# 1. Read lab-report.html and extract the footer
with open('lab-report.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Match the footer
footer_match = re.search(r'<footer[^>]*>.*?</footer>', content, re.DOTALL)
if not footer_match:
    print("Could not find footer in lab-report.html")
    exit(1)

new_footer = footer_match.group(0)

# 2. Iterate through all .html files and replace their footer
html_files = glob.glob('*.html')
for file in html_files:
    if file == 'lab-report.html':
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        file_content = f.read()
    
    # Check if file has a footer
    if re.search(r'<footer[^>]*>.*?</footer>', file_content, re.DOTALL):
        updated_content = re.sub(r'<footer[^>]*>.*?</footer>', new_footer, file_content, flags=re.DOTALL)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"Updated footer in {file}")
    else:
        print(f"No footer found in {file}")

print("Done.")
