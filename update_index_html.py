import re

file_path = "index.html"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Replace the hardcoded committee section
match = re.search(r'<h2 class="section-title">उत्सव कार्यकारिणी</h2>(.*?)<div class="contact-section"', html, re.DOTALL)
if match:
    old_section = match.group(1)
    
    new_section = """
                        <div class="grid" id="dynamic-committee-container">
                            <!-- Committee members will be dynamically loaded here by script.js -->
                            <div style="text-align: center; width: 100%; color: #fff; padding: 20px;">
                                <i class="fas fa-spinner fa-spin fa-2x"></i>
                                <p style="margin-top: 10px;">माहिती लोड होत आहे...</p>
                            </div>
                        </div>
                    </section>

                    <!-- Contact Us Section -->
                    """
    
    html = html.replace(old_section, new_section)
    print("Replaced hardcoded committee HTML.")


# 2. Add the dynamic committee PDF variables
pdf_match = re.search(r'let committeeHtml = \'([\s\S]*?)\';', html)
if pdf_match:
    old_pdf_html = pdf_match.group(0)
    
    new_pdf_html = """// Dynamic Committee Signatures
                let presidentName = "तेजस फटांगरे";
                let presidentPhone = "9370599259";
                let treasurerName = "धनंजय रणाते";
                let treasurerPhone = "9322134560";
                
                if (window.currentCommitteeData) {
                    const pres = window.currentCommitteeData.find(m => m.role.includes("अध्यक्ष"));
                    if(pres) { presidentName = pres.name; presidentPhone = pres.mobile; }
                    const treas = window.currentCommitteeData.find(m => m.role.includes("खजिनदार"));
                    if(treas) { treasurerName = treas.name; treasurerPhone = treas.mobile; }
                }
                
                let committeeHtml = '<div style="display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;"><div style="text-align:center;"><div style="font-weight:800; font-size:20px; color:#5a2010; margin-bottom:5px;">अध्यक्ष</div><div style="font-weight:700; font-size:26px; color:#1a1a2e;">' + presidentName + '</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - ' + presidentPhone + '</div></div><div style="text-align:center;"><div style="font-weight:800; font-size:20px; color:#5a2010; margin-bottom:5px;">खजिनदार</div><div style="font-weight:700; font-size:26px; color:#1a1a2e;">' + treasurerName + '</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - ' + treasurerPhone + '</div></div></div>';"""
                
    html = html.replace(old_pdf_html, new_pdf_html)
    print("Replaced PDF committee logic.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully!")
