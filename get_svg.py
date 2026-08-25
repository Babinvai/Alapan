import urllib.request
import re
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://iconmonstr.com/crow-1-svg/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'<svg[^>]*>.*?<path d="([^"]+)".*?</svg>', html, re.DOTALL)
    if match:
        print("CROW PATH:", match.group(1))
except Exception as e:
    print(e)
