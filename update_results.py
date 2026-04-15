import sys

path = '/Users/kentachida/.gemini/antigravity/scratch/wec-sprint-series/src/data/raceResults.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the last '};' line
idx_export_end = -1
for i in range(len(lines)-1, -1, -1):
    if '};' in lines[i]:
        idx_export_end = i
        break

if idx_export_end == -1:
    print("Could not find end of export")
    sys.exit(1)

# Find the last ']' which belongs to Rd.6
idx_rd6_end = -1
for i in range(idx_export_end - 1, -1, -1):
    if ']' in lines[i]:
        idx_rd6_end = i
        break

if idx_rd6_end == -1:
    print("Could not find end of Rd.6")
    sys.exit(1)

new_rd7 = [
    '    ],\n',
    '    "7": [\n',
    '        { "pos": "1", "driver": "A Plasma", "team": "A Plasma", "car": "#12 Cadillac V-Series.R", "category": "Hypercar", "time": "30:27.838", "gap": "-", "best": "1:31.195" },\n',
    '        { "pos": "2", "driver": "Muhi Tamaki", "team": "Muhi Tamaki", "car": "#333 Porsche 963", "category": "Hypercar", "time": "+19.100", "gap": "-", "best": "1:35.127" },\n',
    '        { "pos": "3", "driver": "Nobasan", "team": "Nobasan", "car": "#765 BMW M Hybrid V8", "category": "Hypercar", "time": "+43.300", "gap": "-", "best": "1:35.562" },\n',
    '        { "pos": "4", "driver": "Shingen Mochi", "team": "Shingen Mochi", "car": "#3 Ferrari 499P", "category": "Hypercar", "time": "+47.994", "gap": "-", "best": "1:35.684" },\n',
    '        { "pos": "5", "driver": "Seiken Xa", "team": "Seiken Xa", "car": "#40 Porsche 963", "category": "Hypercar", "time": "+56.440", "gap": "-", "best": "1:36.197" },\n',
    '        { "pos": "6", "driver": "Tomoki Hirose", "team": "Tomoki Hirose", "car": "#62 Toyota GR010", "category": "Hypercar", "time": "+1:10.340", "gap": "-", "best": "1:30.974" },\n',
    '        { "pos": "7", "driver": "yas mishi", "team": "yas mishi", "car": "#41 Toyota GR010", "category": "Hypercar", "time": "+1:10.360", "gap": "-", "best": "1:36.626" },\n',
    '        { "pos": "8", "driver": "Seth Koganeya", "team": "Seth Koganeya", "car": "#11 BMW M Hybrid V8", "category": "Hypercar", "time": "+1 lap    +46.800", "gap": "-", "best": "1:34.604" },\n',
    '        { "pos": "9", "driver": "Shingo Koyabu", "team": "Shingo Koyabu", "car": "#42 Ferrari 499P", "category": "Hypercar", "time": "+1 lap    +1:34.400", "gap": "-", "best": "1:35.265" },\n',
    '        { "pos": "10", "driver": "GT YUKI", "team": "GT YUKI", "car": "#21 Ferrari 499P", "category": "Hypercar", "time": "DNF (6 laps)", "gap": "-", "best": "1:47.135" },\n',
    '        { "pos": "1", "driver": "Tomoya Onodera", "team": "Tomoya Onodera", "car": "#95 McLaren 720S LMGT3 Evo", "category": "LMGT3", "time": "+2 laps    +28.460", "gap": "-", "best": "1:46.998" },\n',
    '        { "pos": "2", "driver": "Stefano Ricchiuti", "team": "Stefano Ricchiuti", "car": "#164 Lamborghini Huracan LMGT3 Evo2", "category": "LMGT3", "time": "+2 laps    +30.900", "gap": "-", "best": "1:46.620" },\n',
    '        { "pos": "3", "driver": "H.MOS", "team": "H.MOS", "car": "#27 McLaren 720S LMGT3 Evo", "category": "LMGT3", "time": "+2 laps    +31.460", "gap": "-", "best": "1:47.535" },\n',
    '        { "pos": "4", "driver": "Masa Matsumura", "team": "Masa Matsumura", "car": "#25 Porsche 911 GT3 R LMGT3", "category": "LMGT3", "time": "+2 laps    +41.140", "gap": "-", "best": "1:47.835" },\n',
    '        { "pos": "5", "driver": "kaeru uenchu", "team": "kaeru uenchu", "car": "#36 Porsche 911 GT3 R LMGT3", "category": "LMGT3", "time": "+2 laps    +41.200", "gap": "-", "best": "1:47.747" },\n',
    '        { "pos": "6", "driver": "Koki Yamamoto", "team": "Koki Yamamoto", "car": "#4 Porsche 911 GT3 R LMGT3", "category": "LMGT3", "time": "+2 laps    +55.920", "gap": "-", "best": "1:46.188" },\n',
    '        { "pos": "7", "driver": "Naofumi Ishida", "team": "Naofumi Ishida", "car": "#33 Lexus RCF LMGT3", "category": "LMGT3", "time": "+2 laps    +57.920", "gap": "-", "best": "1:47.742" },\n',
    '        { "pos": "8", "driver": "KEI SAGAWA", "team": "KEI SAGAWA", "car": "#364 Ferrari 296 LMGT3", "category": "LMGT3", "time": "+2 laps    +58.020", "gap": "-", "best": "1:46.613" },\n',
    '        { "pos": "9", "driver": "R.MIYAMOTO", "team": "R.MIYAMOTO", "car": "#025 Chevrolet Corvette Z06 LMGT3.R", "category": "LMGT3", "time": "+2 laps    +1:00.120", "gap": "-", "best": "1:48.412" },\n',
    '        { "pos": "10", "driver": "RAPID TUYOPON", "team": "RAPID TUYOPON", "car": "#24 McLaren 720S LMGT3 Evo", "category": "LMGT3", "time": "+2 laps    +1:00.520", "gap": "-", "best": "1:47.949" },\n',
    '        { "pos": "11", "driver": "KH-KMS", "team": "KH-KMS", "car": "#86 Porsche 911 GT3 R LMGT3", "category": "LMGT3", "time": "+2 laps    +1:22.600", "gap": "-", "best": "1:49.858" },\n',
    '        { "pos": "12", "driver": "Brendon Hatasan", "team": "Brendon Hatasan", "car": "#28 McLaren 720S LMGT3 Evo", "category": "LMGT3", "time": "+2 laps    +1:45.480", "gap": "-", "best": "1:50.738" },\n',
    '        { "pos": "13", "driver": "Milfoil Strike", "team": "Milfoil Strike", "car": "#91 McLaren 720S LMGT3 Evo", "category": "LMGT3", "time": "+3 laps    +2.360", "gap": "-", "best": "1:50.989" },\n',
    '        { "pos": "14", "driver": "ziggy Katsuya", "team": "ziggy Katsuya", "car": "#117 Ferrari 296 LMGT3", "category": "LMGT3", "time": "+3 laps    +36.140", "gap": "-", "best": "1:45.689" }\n',
    '    ]\n',
    '};\n'
]

output_lines = lines[:idx_rd6_end] + new_rd7

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(output_lines)
print("Updated successfully")
