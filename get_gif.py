import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
url = "https://api.giphy.com/v1/gifs/search?api_key=p5Pma7y6kGdbbE1JgR32z4B9N284j32n&q=crow+flying+transparent&limit=5"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    data = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    print([g["images"]["original"]["url"] for g in data.get("data", [])])
except Exception as e:
    print(e)
