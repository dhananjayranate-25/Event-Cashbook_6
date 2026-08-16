import os
import glob

files = glob.glob("*.html") + glob.glob("*.js") + ["index.html.tmp"]

target1 = "committeeHtml = '<div style=\"page-break-inside:avoid; width:100%; margin-top:20px;\">' +"
replace1 = "committeeHtml = '<div class=\"pdf-page-break-avoid\" style=\"page-break-inside:avoid; width:100%; margin-top:20px;\">' +"

target2 = "iframe.style.height = Math.max(1123, iframe.contentDocument.body.scrollHeight) + 'px';"
replace2 = """
        // --- PAGE BREAK AVOIDANCE LOGIC ---
        const pageHeightInDOM = (794 * 297) / 210;
        const elementsToAvoidBreak = iframe.contentDocument.querySelectorAll('tr, .pdf-page-break-avoid');
        for (let i = 0; i < elementsToAvoidBreak.length; i++) {
            const el = elementsToAvoidBreak[i];
            const rect = el.getBoundingClientRect();
            const absTop = rect.top + iframe.contentWindow.scrollY;
            const absBottom = rect.bottom + iframe.contentWindow.scrollY;
            
            // Allow 2px tolerance
            const startPage = Math.floor((absTop + 2) / pageHeightInDOM);
            const endPage = Math.floor((absBottom - 2) / pageHeightInDOM);
            
            if (startPage !== endPage) {
                const nextPageTop = (startPage + 1) * pageHeightInDOM;
                const pushAmount = Math.ceil(nextPageTop - absTop) + 1; // 1px safe margin
                
                if (el.tagName.toLowerCase() === 'tr') {
                    const spacer = iframe.contentDocument.createElement('tr');
                    spacer.style.height = pushAmount + 'px';
                    spacer.innerHTML = '<td colspan="100%" style="border:none; padding:0; margin:0; height:' + pushAmount + 'px;"></td>';
                    el.parentNode.insertBefore(spacer, el);
                } else {
                    const currentMargin = parseFloat(iframe.contentWindow.getComputedStyle(el).marginTop) || 0;
                    el.style.marginTop = (currentMargin + pushAmount) + 'px';
                }
            }
        }
        // --- END PAGE BREAK AVOIDANCE LOGIC ---
        
        iframe.style.height = Math.max(1123, iframe.contentDocument.body.scrollHeight) + 'px';
"""

for f in files:
    if not os.path.isfile(f): continue
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if target2 in content:
            if target1 in content:
                content = content.replace(target1, replace1)
            content = content.replace(target2, replace2)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Patched {f}")
    except Exception as e:
        print(f"Error on {f}: {e}")

print("Done.")
