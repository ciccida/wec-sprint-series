
import re

with open('/Users/kentachida/Downloads/2026_01_31_22_39.Autodromo Enzo e Dino Ferrari.html', 'r') as f:
    content = f.read()

# Split by tags to make it easier to grep
content = content.replace('><', '>\n<')

# Extract the Race Results section
# Heading is "Race results"
match = re.search(r'Race results', content)
if match:
    start_pos = match.start()
    # Next section is "Qualification history" or similar
    end_match = re.search(r'Qualification history', content[start_pos:])
    if end_match:
        race_results_html = content[start_pos:start_pos + end_match.start()]
    else:
        race_results_html = content[start_pos:]
else:
    print("Race results not found")
    exit()

# Find all driver rows
# Pattern: <div class="uk-badge uk-badge-class[0-9] uk-badge-class-(Hyper|GT3) " title="(Hyper|GT3)">([0-9]+)</div>
# Followed by driver name in the next few <td>s

rows = re.findall(r'<div class="uk-badge uk-badge-class[0-9] uk-badge-class-(Hyper|GT3) " title="(Hyper|GT3)">([0-9]+)</div>.*?<td class="uk-text-left" style="max-width: 250px;">\s*<div>\s*(.*?)\s*</div>', race_results_html, re.DOTALL)

for cls, title, pos, name in rows:
    print(f"{pos}. {name} ({title})")
