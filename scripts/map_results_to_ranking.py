import json
import re

POINTS_SYSTEM = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
}

def get_points(position):
    try:
        if position == "-": return 0
        pos = int(position)
        return POINTS_SYSTEM.get(pos, 0)
    except ValueError:
        return 0

def normalize_name(name):
    # Normalize heavily to increase match rate
    # remove all non-alphanumeric, lowercase
    return re.sub(r'[^a-zA-Z0-9]', '', name).lower()

def load_js_object(content):
    content = re.sub(r'(\s)(id):', r'\1"id":', content)
    content = re.sub(r'(\s)(name):', r'\1"name":', content)
    content = re.sub(r'(\s)(points):', r'\1"points":', content)
    content = re.sub(r',\s*]', ']', content)
    content = re.sub(r',\s*}', '}', content)

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Error parsing content: {e}")
        return None

def main():
    # 1. Load Latest Results
    with open('src/data/latestResults.js', 'r') as f:
        results_content = f.read()
    
    # Simple extraction: find first `[` and last `]` associated using simple string search
    # As long as there are no nested brackets in strings, we are fine.
    start = results_content.find('[')
    end = results_content.rfind(']') # latestResults is the only array in file usually
    
    if start == -1 or end == -1:
        print("Failed to find latestResults array limits")
        return
        
    results_str = results_content[start:end+1]
    
    try:
        results = json.loads(results_str)
    except json.JSONDecodeError:
         # Try JS object load if strict json fails (keys are quoted in latestResults but just in case)
         results = load_js_object(results_str)

    if not results:
        print("Failed to parse latestResults")
        return

    # 2. Load Ranking Data
    with open('src/data/ranking.js', 'r') as f:
        ranking_full_content = f.read()

    # Find rankingData array
    # It starts after "export const rankingData ="
    # We find first `[`
    start_ranking = ranking_full_content.find('[')
    
    # We need to find the matching closing bracket for this array
    # Since there are multiple arrays, we can't just search from end.
    # We can count brackets.
    
    if start_ranking == -1:
        print("Failed to find rankingData start")
        # debug
        print(ranking_full_content[:100])
        return

    bracket_count = 0
    end_ranking = -1
    for i in range(start_ranking, len(ranking_full_content)):
        char = ranking_full_content[i]
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_ranking = i
                break
    
    if end_ranking == -1:
         print("Failed to find rankingData end")
         return

    ranking_data_str = ranking_full_content[start_ranking:end_ranking+1]
    ranking_data = load_js_object(ranking_data_str)
    
    if not ranking_data:
        print("Failed to parse rankingData")
        return

    # 3. Calculate Points
    hypercar_results = [r for r in results if r['category'] == 'Hypercar']
    lmgt3_results = [r for r in results if r['category'] == 'LMGT3']

    def sort_key(r):
        return int(r['pos']) if r['pos'] != "-" else 999
    
    hypercar_results.sort(key=sort_key)
    lmgt3_results.sort(key=sort_key)

    round_points = {}

    for i, r in enumerate(hypercar_results):
        p = get_points(i + 1)
        name_key = normalize_name(r['driver'])
        round_points[name_key] = p
        # Debug
        # print(f"H: {r['driver']} ({name_key}) -> {p}")

    for i, r in enumerate(lmgt3_results):
        p = get_points(i + 1)
        name_key = normalize_name(r['driver'])
        round_points[name_key] = p
        # Debug
        # print(f"G: {r['driver']} ({name_key}) -> {p}")

    # 4. Update Ranking Data
    updated_ranking = []
    
    for driver in ranking_data:
        d_name = driver['name']
        n_name = normalize_name(driver['name'])
        
        pts = 0
        if n_name in round_points:
            pts = round_points[n_name]
        else:
            found = False
            for r_name in round_points:
                if len(r_name) > 3 and (r_name in n_name or n_name in r_name):
                     pts = round_points[r_name]
                     found = True
                     # print(f"Fuzzy match: {d_name} <-> {r_name}")
                     break
            if not found:
                 # print(f"No match for {d_name} ({n_name})")
                 pts = 0

        current_points = driver['points']
        while len(current_points) < 8:
            current_points.append(None)
            
        new_points = [
            current_points[0],
            current_points[1],
            pts,
            None, None, None, None, None
        ]
        
        driver['points'] = new_points
        updated_ranking.append(driver)

    # 5. Output
    print("export const rankingData = [")
    for d in updated_ranking:
        pts_str = json.dumps(d['points']).replace("null", "null") 
        print(f"    {{ id: {d['id']}, name: \"{d['name']}\", points: {pts_str} }},")
    print("];")
    print("")
    
    # Extract rounds part
    start_rounds = ranking_full_content.find('export const rounds =')
    if start_rounds != -1:
        print(ranking_full_content[start_rounds:])
    else:
        # Fallback
        print("export const rounds = [")
        print("    { id: 1, name: 'Rd.1', venue: 'Spa-Francorchamps' },")
        print("    { id: 2, name: 'Rd.2', venue: 'Le Mans' },")
        print("    { id: 3, name: 'Rd.3', venue: 'Imola' },")
        print("    { id: 4, name: 'Rd.4', venue: 'Fuji' },")
        print("    { id: 5, name: 'Rd.5', venue: 'Bahrain' },")
        print("    { id: 6, name: 'Rd.6', venue: 'COTA' },")
        print("    { id: 7, name: 'Rd.7', venue: 'Interlagos' },")
        print("    { id: 8, name: 'Rd.8', venue: 'Monza' },")
        print("];")

if __name__ == "__main__":
    main()
