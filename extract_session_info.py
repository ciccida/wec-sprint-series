
import sys
from bs4 import BeautifulSoup

def extract_info(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Try to find session name
    h1 = soup.find('h1')
    if h1:
        print(f"H1: {h1.get_text(strip=True)}")
    
    h2s = soup.find_all('h2')
    for h2 in h2s:
        print(f"H2: {h2.get_text(strip=True)}")

    # Specific tables often have IDs or classes in r2la
    # Let's look for "Race Results" specifically in the text
    race_heading = soup.find(lambda tag: tag.name == "h2" and "Race Results" in tag.text)
    if race_heading:
        print("Found 'Race Results' heading")
        # Find the next table after this heading
        table = race_heading.find_next('table')
        if table:
            rows = table.find_all('tr')
            headers = [th.get_text(strip=True) for th in rows[0].find_all(['th', 'td'])]
            print(f"Race Table headers: {headers}")
            for r in rows[1:6]:
                print([td.get_text(strip=True) for td in r.find_all(['td', 'th'])])

if __name__ == "__main__":
    extract_info(sys.argv[1])
