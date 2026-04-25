from bs4 import BeautifulSoup
import json

path = "/Users/kentachida/Downloads/2026_04_25_22_39.Bahrain International Circuit.html"
with open(path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# Find the results table. Usually it has headers like Pos, Driver, etc.
tables = soup.find_all("table")
results = []

for table in tables:
    headers = [th.text.strip() for th in table.find_all("th")]
    if "Pos" in headers and "Driver" in headers:
        rows = table.find_all("tr")[1:] # Skip header
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 6:
                res = {
                    "pos": cols[0].text.strip(),
                    "driver": cols[1].text.strip(),
                    "team": cols[2].text.strip(),
                    "car": cols[3].text.strip(),
                    "category": cols[4].text.strip(),
                    "time": cols[5].text.strip(),
                    "gap": cols[6].text.strip() if len(cols) > 6 else "-",
                    "best": cols[7].text.strip() if len(cols) > 7 else "-"
                }
                results.append(res)
        break

print(json.dumps(results, indent=2, ensure_ascii=False))
