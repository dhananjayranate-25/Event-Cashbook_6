import os

files_to_fix = [
    "gallery_fixed_script.js",
    "gallery_script.js",
    "index.html",
    "temp.js",
    "test_script_1.js",
    "index.html.tmp"
]

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert the footer changes
    new_footer_escaped = '<div style=\\"height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin:40px 0 15px 0;border-radius:2px;\\"></div><div class="page-footer" style=\\"padding-bottom:20px;\\">'
    old_footer_escaped = '<div class="page-footer" style=\\"margin-top:40px; padding-bottom:20px;\\">'
    content = content.replace(new_footer_escaped, old_footer_escaped)
    
    new_footer_unescaped = '<div style="height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin:40px 0 15px 0;border-radius:2px;"></div><div class="page-footer" style="padding-bottom:20px;">'
    old_footer_unescaped = '<div class="page-footer" style="margin-top:40px; padding-bottom:20px;">'
    content = content.replace(new_footer_unescaped, old_footer_unescaped)

    # Insert the yellow line above Aarthik Ahawal
    # It might already have the yellow line if script run multiple times, so check first
    target_text = '<div class="summary-section"><div class="summary-title">आर्थिक अहवाल</div>'
    replacement_text = '<div class="summary-section"><div style="height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin-bottom:15px;border-radius:2px;"></div><div class="summary-title">आर्थिक अहवाल</div>'
    
    # Note: escape variations might exist
    target_escaped = '<div class=\\"summary-section\\"><div class=\\"summary-title\\">आर्थिक अहवाल</div>'
    replacement_escaped = '<div class=\\"summary-section\\"><div style=\\"height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin-bottom:15px;border-radius:2px;\\"></div><div class=\\"summary-title\\">आर्थिक अहवाल</div>'

    # Actually, in JS it's just normal HTML without escaping most quotes unless it was inside a backtick?
    # Let's check how it's written. In gallery_fixed_script.js, it's inside `return '<html>... '` so double quotes inside HTML are not escaped, only single quotes are escaped.
    # Ah, let's verify if there are any escaped quotes for classes.
    # The string is `<div class="summary-section"><div class="summary-title">आर्थिक अहवाल</div>`
    
    content = content.replace(target_text, replacement_text)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
