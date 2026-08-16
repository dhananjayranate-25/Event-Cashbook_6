import os

files_to_fix = [
    "gallery_fixed_script.js",
    "gallery_script.js",
    "index.html",
    "temp.js",
    "test_script_1.js",
    "index.html.tmp"
]

website_html = '<div style="text-align:center; font-size:13px; font-weight:600; margin-bottom:15px; margin-top:-5px; color:#1a1a2e;">अधिकृत वेबसाईट : <a href="https://shivsrushti-utsav-mandal.onrender.com" target="_blank" style="color:#0000ee; text-decoration:none;">https://shivsrushti-utsav-mandal.onrender.com</a></div>'
website_html_escaped = '<div style=\\"text-align:center; font-size:13px; font-weight:600; margin-bottom:15px; margin-top:-5px; color:#1a1a2e;\\">अधिकृत वेबसाईट : <a href=\\"https://shivsrushti-utsav-mandal.onrender.com\\" target=\\"_blank\\" style=\\"color:#0000ee; text-decoration:none;\\">https://shivsrushti-utsav-mandal.onrender.com</a></div>'

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the yellow line I added and insert website text there
    target_yellow_line_unescaped = '<div class="summary-section"><div style="height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin-bottom:15px;border-radius:2px;"></div><div class="summary-title">आर्थिक अहवाल</div>'
    replacement_top_unescaped = f'<div class="summary-section">{website_html}<div class="summary-title">आर्थिक अहवाल</div>'
    
    # Let's also handle if it's already there or the line has backslashes
    content = content.replace(target_yellow_line_unescaped, replacement_top_unescaped)

    # If quotes were escaped in JS string
    target_yellow_line_escaped = '<div class=\\"summary-section\\"><div style=\\"height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin-bottom:15px;border-radius:2px;\\"></div><div class=\\"summary-title\\">आर्थिक अहवाल</div>'
    # Actually, in the last script I didn't escape the replacement, so it's probably unescaped inside the string. Let's just do a flexible regex replace to be safe.
    import re
    # Match the yellow line before Aarthik Ahawal
    yellow_line_pat = re.compile(r'<div class=\\?["\']summary-section\\?["\']><div style=\\?["\']height:1\.5px;background:linear-gradient\(90deg,#ff8c00,#ffd700,#ff8c00\);margin-bottom:15px;border-radius:2px;\\?["\']></div><div class=\\?["\']summary-title\\?["\']>आर्थिक अहवाल</div>')
    
    # We will use a function to determine if it should inject escaped or unescaped website html based on what it matched
    def repl_top(match):
        m = match.group(0)
        if '\\"' in m:
            return f'<div class=\\"summary-section\\">{website_html_escaped}<div class=\\"summary-title\\">आर्थिक अहवाल</div>'
        else:
            return f'<div class="summary-section">{website_html}<div class="summary-title">आर्थिक अहवाल</div>'
            
    content = yellow_line_pat.sub(repl_top, content)


    # 2. Remove the website text from the footer
    footer_website_unescaped = '<div style="margin-bottom:8px; font-weight:600; font-size:13px; color:#1a1a2e; text-align:center;">अधिकृत वेबसाईट : <a href="https://shivsrushti-utsav-mandal.onrender.com" target="_blank" style="color:#0000ee; text-decoration:none;">https://shivsrushti-utsav-mandal.onrender.com</a></div>'
    footer_website_escaped = '<div style=\\"margin-bottom:8px; font-weight:600; font-size:13px; color:#1a1a2e; text-align:center;\\">अधिकृत वेबसाईट : <a href=\\"https://shivsrushti-utsav-mandal.onrender.com\\" target=\\"_blank\\" style=\\"color:#0000ee; text-decoration:none;\\">https://shivsrushti-utsav-mandal.onrender.com</a></div>'
    
    content = content.replace(footer_website_unescaped, "")
    content = content.replace(footer_website_escaped, "")

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

