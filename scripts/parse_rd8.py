import os
import json
import re
from html.parser import HTMLParser

HTML_FILE = "/Users/kentachida/Downloads/2026_08_22_22_41.Circuit de la Sarthe.html"

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
                 self.target_table_found = True

        elif tag == 'tr':
            if self.in_row:
                self.in_row = False
                if self.is_race_table and self.current_row and not getattr(self, 'in_table_header_row', False):
                    self.rows.append(self.current_row)

        elif tag == 'th':
            if self.in_cell:
                self.in_cell = False
                header = self.cell_data.strip()
                self.headers.append(header)
                if "Pos" in self.headers and "Driver" in self.headers and "Best Lap" in self.headers:
                    self.is_race_table = True
                    self.in_table_header_row = True
                else:
                    self.in_table_header_row = False

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

def categorize_car(car_name):
    car_name_upper = car_name.upper()
    if "LMGT3" in car_name_upper or "GT3" in car_name_upper:
        return "LMGT3"
    hypercar_keywords = [
        "HYPERCAR", "LMH", 
        "963", "499P", "SC63", "V-SERIES.R", "M HYBRID V8", "GR010", "VALKYRIE",
        "ALPINE", "A424", "PEUGEOT", "9X8", "IF"
    ]
    if any(k in car_name_upper for k in hypercar_keywords):
        return "Hypercar"
    return "Unknown"

def process_results():
    with open(HTML_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    parser = RaceTableParser()
    parser.feed(content)
    rows = parser.rows
    
    round_results = []
    for row in rows:
        def get_val(keys):
            for k in keys:
                if k in row: return row[k]
            return "-"
        
        pos = get_val(["Pos"])
        driver = get_val(["Driver"])
        car = get_val(["Car"])
        time_val = get_val(["Time/Gap", "Time"])
        best_lap = get_val(["Best Lap", "Best"])
        
        category = categorize_car(car)
        driver = " ".join(driver.split())
        
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

    with open("rd8_parsed.json", "w", encoding='utf-8') as f:
        json.dump(round_results, f, indent=4, ensure_ascii=False)
    print("Written rd8_parsed.json")

if __name__ == "__main__":
    process_results()
