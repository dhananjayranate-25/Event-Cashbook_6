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
                let rowsData = [];
                rowsData.push(orderedData.slice(0, 4));
                rowsData.push(orderedData.slice(4, 8));
                rowsData.push(orderedData.slice(8, 11));

                // Clear any gap on the main container since we are creating row divs
                committeeHtml = committeeHtml.replace('gap:15px 0px;', 'gap:0px; flex-direction:column; align-items:center;');
                committeeHtml = committeeHtml.replace('gap:15px 5px;', 'gap:0px; flex-direction:column; align-items:center;');

                rowsData.forEach((rowGroup, rowIndex) => {
                    // Small margin-bottom for vertical gap
                    let marginBottom = rowIndex < rowsData.length - 1 ? '10px' : '0px';
                    committeeHtml += '<div style="display:flex; justify-content:center; gap:0px; margin-bottom:' + marginBottom + '; width:100%;">';
                    
                    rowGroup.forEach(m => {
                        let d = m.designation || '';
                        if (!d) {
                            if (m.role === 'president') d = 'अध्यक्ष';
                            else if (m.role === 'treasurer') d = 'खजिनदार';
                            else d = 'सदस्य';
                        }
                        
                        committeeHtml += '<div style="text-align:center; flex: 0 1 auto; max-width:145px; padding: 0 10px;">' +
                            '<div style="font-weight:700; font-size:15px; color:#1a1a2e; margin-bottom:1px;">' + (m.name || '') + '</div>' +
                            '<div style="font-weight:600; font-size:12px; color:#5a2010;">' + d + '</div>' +
                        '</div>';
                    });
                    
                    committeeHtml += '</div>';
                });
"""

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will match from `let count = 0;` to the end of the loop
    pattern = re.compile(r'let count = 0;\s*orderedData\.forEach\(m => \{.*?\n\s+\}\);', re.DOTALL)
    content = pattern.sub(replacement_loop.strip(), content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
