import os
import json
import re
from html.parser import HTMLParser

# --- Configurations ---
HTML_FILES = {
    1: "2026_01_17_22_37.Lusail International Circuit.html",
    2: "2026_01_31_22_39.Autodromo Enzo e Dino Ferrari.html"
}
DOWNLOADS_DIR = "/Users/kentachida/Downloads"
OUTPUT_FILE = "src/data/raceResults.js"
RANKING_FILE = "src/data/ranking.js"

POINTS_SYSTEM = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
}

# --- Parsers ---

class RaceTableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_row = False
        self.in_cell = False
        self.cell_data = ""
        self.headers = []
        self.rows = []
        self.current_row = {}
        self.col_index = -1
        self.target_table_found = False
        self.is_race_table = False

    def handle_starttag(self, tag, attrs):
        if tag == 'table':
            self.in_table = True
            # Reset for new table check, but we only want the first "main" table usually or check headers
            # Logic: We'll read headers first. If headers match race results, we process rows.
            self.headers = [] 
            self.is_race_table = False
            
        elif tag == 'tr':
            if self.in_table:
                self.in_row = True
                self.col_index = -1
                self.current_row = {}

        elif tag == 'th':
            if self.in_row:
                self.in_cell = True
                self.cell_data = ""

        elif tag == 'td':
            if self.in_row:
                self.in_cell = True
                self.cell_data = ""

    def handle_endtag(self, tag):
        if tag == 'table':
            self.in_table = False
            if self.is_race_table and not self.target_table_found:
                 self.target_table_found = True # Lock this table as the result

        elif tag == 'tr':
            if self.in_row:
                self.in_row = False
                # If we have headers and this is a data row
                if self.is_race_table and self.current_row and not self.in_table_header_row:
                    self.rows.append(self.current_row)

        elif tag == 'th':
            if self.in_cell:
                self.in_cell = False
                header = self.cell_data.strip()
                self.headers.append(header)
                # Check if this is the race table based on headers
                # Table 1 headers: Pos, Up, Driver, Team, Car, Laps, Time/Gap, Qual Time, Best Lap...
                if "Pos" in self.headers and "Driver" in self.headers and "Best Lap" in self.headers:
                    self.is_race_table = True
                    self.in_table_header_row = True # This row is headers
                else:
                    self.in_table_header_row = False # Or maybe not finished gathering headers

        elif tag == 'td':
            if self.in_cell:
                self.in_cell = False
                self.col_index += 1
                if self.is_race_table and self.col_index < len(self.headers):
                    header = self.headers[self.col_index]
                    self.current_row[header] = self.cell_data.strip()
                    self.in_table_header_row = False

    def handle_data(self, data):
        if self.in_cell:
            self.cell_data += data

def parse_html(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    parser = RaceTableParser()
    parser.feed(content)
    return parser.rows

def categorize_car(car_name):
    car_name_upper = car_name.upper()
    
    # Explicit LMGT3 checks
    if "LMGT3" in car_name_upper or "GT3" in car_name_upper:
        return "LMGT3"
        
    # Hypercar checks
    hypercar_keywords = [
        "HYPERCAR", "LMH", 
        "963", "499P", "SC63", "V-SERIES.R", "M HYBRID V8", "GR010", "VALKYRIE", # Existing
        "ALPINE", "A424", "PEUGEOT", "9X8", "IF" # New additions (IF is usually Isotta but unlikely here)
    ]
    
    if any(k in car_name_upper for k in hypercar_keywords):
        return "Hypercar"
        
    # Default fallback if not GT3 (assuming Hypercar if not GT3 is risky but for this series maybe ok?)
    # But let's stick to Unknown to be safe, or print warning.
    print(f"Warning: Unknown category for car: {car_name}")
    return "Unknown"

def process_results():
    all_results = {}
    
    for round_id, filename in HTML_FILES.items():
        file_path = os.path.join(DOWNLOADS_DIR, filename)
        if not os.path.exists(file_path):
            # Try scratch dir if we are running in a constrained env
            if os.path.exists(filename):
                file_path = filename
            else:
                print(f"File not found: {file_path}")
                continue

        print(f"Parsing Round {round_id}: {filename}")
        rows = parse_html(file_path)
        
        round_results = []
        for row in rows:
            # Output keys: pos, driver, car, time, gap, best, category
            
            def get_val(keys):
                for k in keys:
                    if k in row: return row[k]
                return "-"
            
            pos = get_val(["Pos"])
            driver = get_val(["Driver"])
            car = get_val(["Car"])
            time_val = get_val(["Time/Gap", "Time"]) # This might contain "DNF" or "Accident"
            best_lap = get_val(["Best Lap", "Best"])
            
            category = categorize_car(car)
            
            # Normalize driver name
            driver = " ".join(driver.split())
            
            # Clean up time/gap
            # If time_val indicates DNF/Accident, we keep it.
            # If it's a time, we might want to just keep it as is for now.
            
            round_results.append({
                "pos": pos,
                "driver": driver,
                "team": get_val(["Team"]),
                "car": car,
                "category": category,
                "time": time_val, 
                "gap": "-", 
                "best": best_lap
            })
            
        all_results[round_id] = round_results

    # Generate src/data/raceResults.js
    js_content = "export const raceResults = " + json.dumps(all_results, indent=4) + ";"
    with open(OUTPUT_FILE, "w") as f:
        f.write(js_content)
    print(f"Written {OUTPUT_FILE}")
    
    return all_results

def update_ranking(all_results):
    # Read existing ranking.js to preserve IDs and Names logic if possible, 
    # but we are effectively rebuilding points.
    # We'll read the file line by line to extract the initial list or just use the structure we know.
    # Actually, simpler to read the exported array if we could import it, but this is python.
    # We will use regex to find the array in ranking.js.
    
    with open(RANKING_FILE, 'r') as f:
        content = f.read()
        
    # Extract the array content
    match = re.search(r"export const rankingData = (\[.*?\]);", content, re.DOTALL)
    if not match:
        print("Could not find rankingData in file.")
        return

    try:
        # Evaluate as python list (might fail if JS specific syntax used, but JSON-like usually works)
        # JS keys might not be quoted.
        # We need to be careful.
        # Let's parse it somewhat robustly or just overwrite with new data if we had a master list.
        # Since we reset points to nulls in step 733, we can just start fresh or use names from results?
        # NO, we must preserve the list of drivers because some might not have raced in all rounds.
        # But `ranking.js` was reset.
        
        # Let's parse the JSON-like string. fixing keys.
        data_str = match.group(1)
        # Quote keys
        data_str = re.sub(r'(\s)(\w+):', r'\1"\2":', data_str)
        # Handle trailing commas
        data_str = re.sub(r',(\s*\])', r'\1', data_str)
        
        ranking_data = json.loads(data_str)
    except Exception as e:
        print(f"Error parsing ranking data: {e}")
        return

    # Create a map of normalized driver name to entry
    driver_map = {}
    for entry in ranking_data:
        norm_name = entry['name'].lower().replace(" ", "")
        driver_map[norm_name] = entry

    # Process points
    for round_id, results in all_results.items():
        r_idx = int(round_id) - 1 # Array index 0-based
        
        # Separate by category
        hypercar = [r for r in results if r['category'] == 'Hypercar']
        lmgt3 = [r for r in results if r['category'] == 'LMGT3']
        
        def assign_points(race_list):
            for i, r in enumerate(race_list):
                # Check formatted time string for DNF status first
                time_str = str(r.get('time', ''))
                if "DNF" in time_str or "Accident" in time_str:
                     continue

                # Use class rank (i + 1) explicitly
                p = i + 1
                
                points = POINTS_SYSTEM.get(p, 0)
                if points > 0:
                    d_name = r['driver']
                    norm_name = d_name.lower().replace(" ", "")
                    # Handling for specific name mismatches if needed in the future
                    
                    if norm_name in driver_map:
                        # Overwrite points (fix for re-runs)
                        driver_map[norm_name]['points'][r_idx] = points
                    else:
                        print(f"Driver not found in ranking: {d_name}")
        
        assign_points(hypercar)
        assign_points(lmgt3)

    # Write back
    new_json = json.dumps(ranking_data, indent=4)
    # Unquote keys to look like JS? Not strictly necessary but nice.
    # Valid JS accepts quoted keys.
    
    new_content = f"export const rankingData = {new_json};\n\n"
    
    # Append rounds info if needed (it was at end of file)
    # We need to preserve 'export const rounds = ...'
    rounds_match = re.search(r"export const rounds = .*?;", content, re.DOTALL)
    if rounds_match:
        new_content += rounds_match.group(0)
    else:
        # Add default rounds if missing
        pass 

    with open(RANKING_FILE, 'w') as f:
        f.write(new_content)
    print(f"Updated {RANKING_FILE}")

if __name__ == "__main__":
    results = process_results()
    update_ranking(results)
