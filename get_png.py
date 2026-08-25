import urllib.request
import re
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
url = "https://pixabay.com/images/search/flying%20crow%20transparent/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = re.findall(r'src="(https://cdn\.pixabay\.com/photo/[^"]+\.png)"', html)
    print("PNGS:", urls[:2])
except Exception as e:
    print(e)
