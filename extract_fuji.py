import re
import json

path = '/Users/kentachida/Downloads/2026_04_11_22_40.Fuji Speedway.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Row extraction
rows = re.findall(r'<tr[^>]*>(.*?)</tr>', content, re.DOTALL)

def clean_html(raw_html):
    # Remove HTML tags and extra whitespace
    s = re.sub(r'<[^>]+>', ' ', raw_html)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def get_category(row_html):
    # Extract category from badge title
    match = re.search(r'title="(Hyper|LMGT3|GT3|LMP2|LMP3|GTE)"', row_html)
    if match:
        cat = match.group(1)
        if cat == 'GT3': return 'LMGT3' # Normalize
        return cat
    return "Unknown"

results = []
for row in rows:
    cols = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
    if len(cols) >= 7:
        pos_str = clean_html(cols[0])
        if pos_str.isdigit():
            name = clean_html(cols[1])
            name = re.sub(r'\(.*?\)', '', name).strip() # Remove ID suffix
            
            # User wants to ignore ToiToi Toys
            if "ToiToi Toys" in name:
                continue
                
            team = name # In this series, usually same as driver
            car_full = clean_html(cols[4]) # Car column
            category = get_category(row)
            
            time_str = clean_html(cols[6])
            # If gap is in col 7 or 8
            # In Row 12: ['1', '1', 'A Plasma', 'A Plasma', '#12 Cadillac V-Series.R', '19', '30:27.838', '1:29.810', '1:31.195']
            # Col 6 is Time, Col 8 is Best
            best_lap = clean_html(cols[8]) if len(cols) > 8 else "-"
            
            results.append({
                "overall_pos": int(pos_str),
                "driver": name,
                "team": team,
                "car": car_full,
                "category": category,
                "time": time_str,
                "best": best_lap
            })

# Re-calculate class positions
class_counts = {"Hypercar": 0, "LMGT3": 0, "LMP2": 0}
final_results = []
for res in sorted(results, key=lambda x: x['overall_pos']):
    cat = res['category']
    if cat not in class_counts: class_counts[cat] = 0
    class_counts[cat] += 1
    res['pos'] = str(class_counts[cat])
    final_results.append(res)

# Output as JSON for easy copy
print(json.dumps(final_results, indent=4, ensure_ascii=False))
