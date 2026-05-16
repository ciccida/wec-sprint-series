
import sys
from bs4 import BeautifulSoup

def analyze_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # List all tables and their classes
    tables = soup.find_all('table')
    print(f"Total tables found: {len(tables)}")
    for i, table in enumerate(tables):
        classes = table.get('class', [])
        parent_id = table.parent.get('id', 'N/A')
        print(f"Table {i}: Classes={classes}, Parent ID={parent_id}")
        
        # Print first row of each table to identify it
        rows = table.find_all('tr')
        if rows:
            headers = [th.get_text(strip=True) for th in rows[0].find_all(['th', 'td'])]
            print(f"  Headers: {headers}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_html(sys.argv[1])
    else:
        print("Usage: python analyze_html.py <path_to_html>")
