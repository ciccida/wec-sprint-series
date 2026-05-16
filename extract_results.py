
import sys
import json
from bs4 import BeautifulSoup

def extract_results(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    tables = soup.find_all('table')
    
    # Table 7 (index 7) has the headers ['Pos', 'Driver', 'Team', 'Car', 'Time', 'Gap', 'Ideal Lap', 'Lap', 'F Laps', 'Aids']
    # Let's verify by searching for the table with "Pos" and "Driver" headers
    target_table = None
    for table in tables:
        rows = table.find_all('tr')
        if rows:
            headers = [th.get_text(strip=True) for th in rows[0].find_all(['th', 'td'])]
            if 'Pos' in headers and 'Driver' in headers and 'Time' in headers:
                target_table = table
                break
    
    if not target_table:
        print("Could not find the results table.")
        return

    results = []
    rows = target_table.find_all('tr')[1:] # Skip header
    for row in rows:
        cols = row.find_all(['td', 'th'])
        if len(cols) >= 6:
            pos = cols[0].get_text(strip=True)
            driver = cols[1].get_text(strip=True)
            team = cols[2].get_text(strip=True)
            car = cols[3].get_text(strip=True)
            time = cols[4].get_text(strip=True)
            gap = cols[5].get_text(strip=True)
            
            category = "Unknown"
            hypercar_keywords = ['963', 'Valkyrie', 'SC63', 'Cadillac', 'Hybrid', 'Peugeot', '499P', 'GR010', 'LMH']
            gt3_keywords = ['911', '720S', 'M4', 'Huracan', 'RCF', '296', 'Mustang', 'GT3']
            
            if any(k in car for k in hypercar_keywords):
                category = "Hypercar"
            elif any(k in car for k in gt3_keywords):
                category = "LMGT3"
                
            results.append({
                'pos': pos,
                'driver': driver,
                'team': team,
                'car': car,
                'category': category,
                'time': time,
                'gap': gap
            })
    
    print(json.dumps(results, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_results(sys.argv[1])
    else:
        print("Usage: python extract_results.py <path_to_html>")
