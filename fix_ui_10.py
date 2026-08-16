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

reorder_logic = """
                let orderedData = [...comData.data];
                const desiredOrder = [
                    "तेजस फटांगरे",
                    "धीरज झावरे",
                    "आदित्य मते",
                    "सार्थक माताडे",
                    "धनंजय रणाते",
                    "ओंकार वर्पे",
                    "तेजस देशमुख",
                    "तेजस वर्पे",
                    "वैभव सांगळे",
                    "निलेश कदम",
                    "शुभम पेटकर"
                ];
                orderedData.sort((a, b) => {
                    let nameA = a.name ? a.name.trim() : "";
                    let nameB = b.name ? b.name.trim() : "";
                    let indexA = desiredOrder.indexOf(nameA);
                    let indexB = desiredOrder.indexOf(nameB);
                    if (indexA === -1) indexA = 999;
                    if (indexB === -1) indexB = 999;
                    return indexA - indexB;
                });
                
                orderedData.forEach(m => {
"""

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply the sorting logic
    content = content.replace("comData.data.forEach(m => {", reorder_logic)
    
    # Change flex to force 4 items per row (22-24% width)
    # The current item looks like: 
    # committeeHtml += '<div style="text-align:center; flex: 0 1 auto; max-width: 185px; padding: 0 8px; margin-bottom:5px;">' +
    
    # Regex to find the flex div
    content = re.sub(
        r'<div style="text-align:center; flex:.*?; margin-bottom:5px;">',
        '<div style="text-align:center; flex: 0 0 23%; max-width: 25%; padding: 0 5px; margin-bottom:5px;">',
        content
    )

    # Adjust container gap (if needed, it was gap:15px 5px;)
    # Let's keep gap 15px 5px but change flex wrap to center
    content = content.replace("gap:15px 5px;", "gap:15px 2%;")

    # Font sizes: Let's restore the large font sizes! Wait, I see in line 725 it says:
    # font-size:13px and font-size:11px in the snippet?
    # Oh no! Did the UI replacement script target the wrong things?
    # The snippet I read showed:
    # '<div style="font-weight:700; font-size:13px; color:#1a1a2e; margin-bottom:3px;">' + (m.name || '') + '</div>'
    # Why is it 13px??? Ah, because I wrote `font-size:26px` in my replacement, but there might be multiple occurrences. Let's force it to be large explicitly now.
    
    content = re.sub(
        r'<div style="font-weight:700; font-size:\d+px; color:#1a1a2e; margin-bottom:3px;">',
        '<div style="font-weight:700; font-size:20px; color:#1a1a2e; margin-bottom:3px;">',
        content
    )
    
    content = re.sub(
        r'<div style="font-weight:600; font-size:\d+px; color:#5a2010;">',
        '<div style="font-weight:600; font-size:15px; color:#5a2010;">',
        content
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
