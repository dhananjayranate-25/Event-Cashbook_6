import re

file_path = "script.js"

with open(file_path, "r", encoding="utf-8") as f:
    js = f.read()

old_pdf_html = """<div style="display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;">
                        <div style="text-align:center;">
                            <div style="font-weight:800; font-size:12px; color:#5a2010; margin-bottom:5px;">अध्यक्ष</div>
                            <div style="font-weight:700; font-size:13px; color:#1a1a2e;">तेजस फटांगरे</div>
                            <div style="font-size:11px; color:#555555; margin-top:3px;">मो. नं - 9370599259</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-weight:800; font-size:12px; color:#5a2010; margin-bottom:5px;">खजिनदार</div>
                            <div style="font-weight:700; font-size:13px; color:#1a1a2e;">धनंजय रणाते</div>
                            <div style="font-size:11px; color:#555555; margin-top:3px;">मो. नं - 9322134560</div>
                        </div>
                    </div>"""

new_pdf_html = """<div style="display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;">
                        <div style="text-align:center;">
                            <div style="font-weight:800; font-size:12px; color:#5a2010; margin-bottom:5px;">अध्यक्ष</div>
                            <div style="font-weight:700; font-size:13px; color:#1a1a2e;">${(window.currentCommitteeData && window.currentCommitteeData.find(m => m.role.includes("अध्यक्ष"))) ? window.currentCommitteeData.find(m => m.role.includes("अध्यक्ष")).name : 'तेजस फटांगरे'}</div>
                            <div style="font-size:11px; color:#555555; margin-top:3px;">मो. नं - ${(window.currentCommitteeData && window.currentCommitteeData.find(m => m.role.includes("अध्यक्ष"))) ? window.currentCommitteeData.find(m => m.role.includes("अध्यक्ष")).mobile : '9370599259'}</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-weight:800; font-size:12px; color:#5a2010; margin-bottom:5px;">खजिनदार</div>
                            <div style="font-weight:700; font-size:13px; color:#1a1a2e;">${(window.currentCommitteeData && window.currentCommitteeData.find(m => m.role.includes("खजिनदार"))) ? window.currentCommitteeData.find(m => m.role.includes("खजिनदार")).name : 'धनंजय रणाते'}</div>
                            <div style="font-size:11px; color:#555555; margin-top:3px;">मो. नं - ${(window.currentCommitteeData && window.currentCommitteeData.find(m => m.role.includes("खजिनदार"))) ? window.currentCommitteeData.find(m => m.role.includes("खजिनदार")).mobile : '9322134560'}</div>
                        </div>
                    </div>"""

if old_pdf_html in js:
    js = js.replace(old_pdf_html, new_pdf_html)
    print("Successfully replaced hardcoded PDF committee in script.js!")
else:
    print("Could not find the exact HTML in script.js.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(js)
