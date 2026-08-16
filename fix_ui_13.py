import os
import re

files_to_fix = [
    "gallery_fixed_script.js",
    "gallery_script.js",
    "index.html",
    "temp.js",
    "test_script_1.js",
    "index.html.tmp"
]

replacement_loop = """
                let count = 0;
                orderedData.forEach(m => {
                    let d = m.designation || '';
                    if (!d) {
                        if (m.role === 'president') d = 'अध्यक्ष';
                        else if (m.role === 'treasurer') d = 'खजिनदार';
                        else d = 'सदस्य';
                    }
                    
                    // Force row break every 4 items to maintain exactly 4-4-3 structure
                    if (count > 0 && count % 4 === 0) {
                        committeeHtml += '<div style="flex-basis:100%; height:0; margin:0; padding:0;"></div>';
                    }
                    
                    // Use flex: 0 1 auto; to shrink-wrap the text perfectly, removing extra gap
                    committeeHtml += '<div style="text-align:center; flex: 0 1 auto; max-width:145px; padding: 0 10px; margin-bottom:5px;">' +
                        '<div style="font-weight:700; font-size:15px; color:#1a1a2e; margin-bottom:3px;">' + (m.name || '') + '</div>' +
                        '<div style="font-weight:600; font-size:12px; color:#5a2010;">' + d + '</div>' +
                    '</div>';
                    
                    count++;
                });
"""

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find the whole loop and replace it
    # We will match from orderedData.forEach(m => { down to the closing });
    
    pattern = re.compile(r'orderedData\.forEach\(m => \{.*?\n\s+\}\);', re.DOTALL)
    content = pattern.sub(replacement_loop.strip(), content)
    
    # Let's also adjust the gap on the container to be smaller horizontally if needed.
    # Currently gap:15px 5px;
    # Since we added padding:0 10px to the items, the horizontal distance is already 20px + gap.
    # So let's make horizontal gap 0px, row gap 15px
    content = content.replace("gap:15px 5px;", "gap:15px 0px;")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
