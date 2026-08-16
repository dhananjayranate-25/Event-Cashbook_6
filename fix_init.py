import os

files_to_fix = [
    "gallery_fixed_script.js",
    "gallery_script.js",
    "index.html",
    "temp.js",
    "test_script_1.js",
    "index.html.tmp"
]

correct_initialization = """        let committeeHtml = '<div style="display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;"><div style="text-align:center;"><div style="font-weight:800; font-size:15px; color:#5a2010; margin-bottom:5px;">अध्यक्ष</div><div style="font-weight:700; font-size:16px; color:#1a1a2e;">तेजस फटांगरे</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - 9370599259</div></div><div style="text-align:center;"><div style="font-weight:800; font-size:15px; color:#5a2010; margin-bottom:5px;">खजिनदार</div><div style="font-weight:700; font-size:16px; color:#1a1a2e;">धनंजय रणाते</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - 9322134560</div></div></div>';"""

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("let committeeHtml = '' + committeeHtml + '';", correct_initialization)
    content = content.replace("let committeeHtml = '${committeeHtml}';", correct_initialization)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed initialization in {filename}")

