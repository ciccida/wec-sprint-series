import json
import re

# Name Mapping: Results Name -> Ranking Name
driver_map = {
    "Muhi Tamaki": "MUHI TAMAKI",
    "Masa Matsumura": "MASA MATSUMURA",
    "Hayata Asaga": "Hayata Asaga",
    "Kei Sagawa": "KEI SAGAWA",
    "Daitou Hatsune": "Daitou Hatsune",
    "Sushi Shippou": "S Shippou",
    "Noba San": "Nobasan",
    "Tomoya Onodera": "TOMOYA ONODERA",
    "Ryoma Miyamoto": "R.MIYAMOTO",
    "simzo hunt": "simzo",
    "Kaeru Uenchu": "kaeru uenchu",
    "GT YUKI": "YUKI GT",
    "satou naoto": "satou naoto",
    "Brendon Hatasan": "Brendon Hatasan",
    "ToiToi Toys": "TOITOI TOYS",
    "milfoil strike": "Milfoil Strike",
    "Koki Yamamoto": "Koki Yamamoto",
    "Shingo Koyabu": "Shingo Koyabu",
    "H MOS": "H.MOS",
    "Shingen Mochi": "Shingen Mochi",
    "Fniku Neko": "Fniku Neko",
    "Sara Mayo": "SARA MAYO",
    "momigi tetuo": "momigi tetuo",
    "ziggy Katsuya": "ziggy Katsuya",
    "Rapid Tuyopon": "RAPID TUYOPON",
    "aJ fault": "aJ fault",
    "KH-AE KMS": "KH-KMS",
    "Sota Ito": "SOTA ITO"
}

points_system = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

def get_points(pos):
    if 1 <= pos <= 10:
        return points_system[pos - 1]
    return 0

# Read Latest Results
results_path = '/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/src/data/latestResults.js'
with open(results_path, 'r') as f:
    content = f.read()
    # Extract JSON part
    json_str = content.replace('export const latestResults =', '').strip().rstrip(';')
    results = json.loads(json_str)

# Calculate Points
driver_points_update = {}  # Ranking Name -> Points for Rd 3

hypercar_count = 0
lmgt3_count = 0

for r in results:
    cat = r['category']
    driver_name_results = r['driver']
    ranking_name = driver_map.get(driver_name_results) # Get canonical name
    
    if not ranking_name:
        print(f"Warning: No mapping for {driver_name_results}")
        continue

    points = 0
    if cat == 'Hypercar':
        hypercar_count += 1
        points = get_points(hypercar_count)
    elif cat == 'LMGT3':
        lmgt3_count += 1
        points = get_points(lmgt3_count)
    
    if points > 0:
        driver_points_update[ranking_name] = points

# Read Ranking Data
ranking_path = '/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/src/data/ranking.js'
with open(ranking_path, 'r') as f:
    ranking_lines = f.readlines()

new_lines = []
for line in ranking_lines:
    if 'name:' in line and 'points:' in line:
        # Extract name
        match = re.search(r'name: "([^"]+)"', line)
        if match:
            current_name = match.group(1)
            
            # Find points array
            points_match = re.search(r'points: \[(.*?)\]', line)
            if points_match:
                points_str = points_match.group(1)
                points_arr = [x.strip() for x in points_str.split(',')]
                
                # Clean up extracted strings (remove quotes if any, though usually bare numbers or null)
                # But here they are likely raw strings like "25", "null"
                
                # Update Round 3 (index 2)
                new_points_val = driver_points_update.get(current_name, 0)
                
                # Reconstruct points array
                # Keeping previous points (index 0, 1) unchanged
                # Setting index 2 to new value
                # Setting index 3-7 to null
                
                # Note: points_arr elements are strings like "25", "25", "25", "null", ...
                # Let's rebuild the array carefully
                
                # We need to make sure we preserve the existing points for Rd 1 and 2
                # Round 1 is index 0, Round 2 is index 1.
                
                p0 = points_arr[0]
                p1 = points_arr[1]
                
                # Round 3
                p2 = str(new_points_val)
                
                # Rest are null
                rest = ["null"] * 5
                
                new_points_list = [p0, p1, p2] + rest
                new_points_str = ", ".join(new_points_list)
                
                line = re.sub(r'points: \[.*?\]', f'points: [{new_points_str}]', line)
                
    new_lines.append(line)

with open(ranking_path, 'w') as f:
    f.writelines(new_lines)

print("Ranking updated successfully.")
