import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# The exact pattern we injected earlier
pattern = r'[ \t]*<!-- PREMIUM ACCOUNT LOGIN ICON FOR MOBILE -->\s*<a href="login\.html" class="header-account-btn" aria-label="Sign In or Register" style="margin-right: 15px; display: none;">\s*<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"\s*stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">\s*<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>\s*<circle cx="12" cy="7" r="4"></circle>\s*</svg>\s*</a>\s*'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We remove the block
    new_content = re.sub(pattern, '', content)
    
    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed from {file}")
    else:
        print(f"Not found in {file}")

