import urllib.request
import re

channels = [
    ("SkyNews", "https://www.youtube.com/@SkyNews/live"),
    ("DWNews", "https://www.youtube.com/@dwnews/live"),
    ("NASA", "https://www.youtube.com/@NASA/live")
]

for name, url in channels:
    try:
        req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'"videoId":"([^"]+)"', html)
        if match:
            print(f"{name}: {match.group(1)}")
        else:
            print(f"{name}: Not found")
    except Exception as e:
        print(f"{name}: Error {e}")
