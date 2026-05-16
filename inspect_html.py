
import sys
from bs4 import BeautifulSoup

def inspect_tables(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    tables = soup.find_all('table')
    
    print(f"Total tables found: {len(tables)}")
    
    for i, table in enumerate(tables):
        rows = table.find_all('tr')
        if rows:
            headers = [th.get_text(strip=True) for th in rows[0].find_all(['th', 'td'])]
            # Search for keyword indicating race results or best lap
            if any(k in h for h in headers for k in ['Best', 'Lap', 'Pos', 'Driver']):
                print(f"\nTable {i} headers: {headers}")
                # Print first 5 rows to see data better
                for r_idx in range(1, min(6, len(rows))):
                    row_data = [td.get_text(strip=True) for td in rows[r_idx].find_all(['td', 'th'])]
                    print(f"Table {i} row {r_idx}: {row_data}")
                print(f"Table {i} total row count: {len(rows)}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_tables(sys.argv[1])
    else:
        print("Usage: python inspect_html.py <path_to_html>")
