import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# The HTML to insert right before the hamburger button
account_btn_html = """
                    <!-- PREMIUM ACCOUNT LOGIN ICON FOR MOBILE -->
                    <a href="login.html" class="header-account-btn" aria-label="Sign In or Register" style="margin-right: 15px; display: none;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </a>
                    """

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if we already injected it to avoid duplicates
    if "PREMIUM ACCOUNT LOGIN ICON FOR MOBILE" in content:
        continue

    # Find the hamburger button and inject the account button before it
    # <button id="mobileMenuBtn" class="hamburger-btn" aria-label="Open Menu">
    
    pattern = r'(<button id="mobileMenuBtn" class="hamburger-btn" aria-label="Open Menu">)'
    if re.search(pattern, content):
        new_content = re.sub(pattern, account_btn_html + r'\1', content)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"Could not find hamburger menu in {file}")

