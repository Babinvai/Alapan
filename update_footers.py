import re
import glob
import sys

def main():
    source_file = 'scan.html'
    
    try:
        with open(source_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Could not find source file: {source_file}")
        sys.exit(1)

    # Match the footer in scan.html
    footer_match = re.search(r'<footer class="main-footer">.*?</footer>', content, re.DOTALL)
    if not footer_match:
        print(f"Could not find <footer class=\"main-footer\"> in {source_file}")
        sys.exit(1)

    new_footer = footer_match.group(0)

    # Iterate through all .html files and replace their footer
    html_files = glob.glob('*.html')
    updated_count = 0
    
    for file in html_files:
        if file == source_file:
            continue
        
        with open(file, 'r', encoding='utf-8') as f:
            file_content = f.read()
        
        # Check if file has a footer
        if re.search(r'<footer[^>]*>.*?</footer>', file_content, re.DOTALL):
            updated_content = re.sub(r'<footer[^>]*>.*?</footer>', new_footer, file_content, flags=re.DOTALL)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"Updated footer in {file}")
            updated_count += 1
        else:
            print(f"No footer found in {file}")

    print(f"Done. Updated {updated_count} files.")

if __name__ == "__main__":
    main()
