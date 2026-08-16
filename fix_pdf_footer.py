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

injection_code = """
        let committeeHtml = '<div style="display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;"><div style="text-align:center;"><div style="font-weight:800; font-size:15px; color:#5a2010; margin-bottom:5px;">अध्यक्ष</div><div style="font-weight:700; font-size:16px; color:#1a1a2e;">तेजस फटांगरे</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - 9370599259</div></div><div style="text-align:center;"><div style="font-weight:800; font-size:15px; color:#5a2010; margin-bottom:5px;">खजिनदार</div><div style="font-weight:700; font-size:16px; color:#1a1a2e;">धनंजय रणाते</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - 9322134560</div></div></div>';
        try {
            const comRes = await fetch('/api/committee');
            const comData = await comRes.json();
            if (comData.success && comData.data && comData.data.length > 0) {
                committeeHtml = '<div style="page-break-inside:avoid; width:100%; margin-top:20px;">' +
                    '<div style="text-align:center; margin-bottom:15px;">' +
                        '<span style="color:#ff8c00; font-size:14px; margin-right:8px;">❖</span>' +
                        '<span style="font-size:17px; font-weight:800; color:#5a2010; letter-spacing:1px; text-shadow:0 1px 2px rgba(0,0,0,0.1);">उत्सव कार्यकारिणी</span>' +
                        '<span style="color:#ff8c00; font-size:14px; margin-left:8px;">❖</span>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:center; flex-wrap:wrap; gap:12px; padding:0 10px;">';
                
                comData.data.forEach(m => {
                    let d = m.designation || '';
                    if (!d) {
                        if (m.role === 'president') d = 'अध्यक्ष';
                        else if (m.role === 'treasurer') d = 'खजिनदार';
                        else d = 'सदस्य';
                    }
                    committeeHtml += '<div style="text-align:center; flex: 1 1 calc(25% - 12px); min-width:110px; max-width:160px; margin-bottom:8px;">' +
                        '<div style="font-weight:700; font-size:13px; color:#1a1a2e; margin-bottom:3px;">' + (m.name || '') + '</div>' +
                        '<div style="font-weight:600; font-size:11px; color:#5a2010;">' + d + '</div>' +
                    '</div>';
                });
                committeeHtml += '</div></div>';
            }
        } catch(e) { console.error('Error fetching committee for PDF', e); }
"""

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the function signature
    sig1 = "async function generatePDFHTML(entries, year, logoDataURL) {"
    
    if sig1 not in content:
        continue
    
    pat = re.compile(r'<div style=\\?["\']display:flex;\s*justify-content:space-between;\s*margin-top:30px;\s*padding:0\s*30px;\\?["\']>.*?मो\.\s*नं.*?<\\?/div><\\?/div><\\?/div>', re.DOTALL)
    new_html_insertion = "' + committeeHtml + '"
    
    # Check if we already applied the fix
    if "const comRes = await fetch('/api/committee');" in content:
        print(f"Fix already applied to {filename}")
        continue

    parts = content.split(sig1)
    if len(parts) > 1:
        for i in range(1, len(parts)):
            subparts = parts[i].split("return '<!DOCTYPE html>")
            if len(subparts) > 1:
                subparts[0] = subparts[0] + injection_code
                parts[i] = "return '<!DOCTYPE html>".join(subparts)
            else:
                subparts = parts[i].split('return `<!DOCTYPE html>')
                if len(subparts) > 1:
                    subparts[0] = subparts[0] + injection_code
                    parts[i] = 'return `<!DOCTYPE html>'.join(subparts)
                else:
                    subparts = parts[i].split('return "\\n<!DOCTYPE html>')
                    if len(subparts) > 1:
                        subparts[0] = subparts[0] + injection_code
                        parts[i] = 'return "\\n<!DOCTYPE html>'.join(subparts)

        content = sig1.join(parts)
        
        # Replace the HTML block inside the return string
        content = re.sub(pat, new_html_insertion, content)

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
