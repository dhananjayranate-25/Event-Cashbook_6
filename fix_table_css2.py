import re

file_path = "style.css"

with open(file_path, "r", encoding="utf-8") as f:
    css = f.read()

old_css = """    /* Explicit mobile column widths to minimize gaps and fit exactly 100% */
    .year-section th:nth-child(1), .year-section td:nth-child(1) { width: 5% !important; text-align: center !important; }
    .year-section th:nth-child(2), .year-section td:nth-child(2) { width: 28% !important; }
    .year-section th:nth-child(3), .year-section td:nth-child(3) { width: 12% !important; text-align: center !important; }
    .year-section th:nth-child(4), .year-section td:nth-child(4) { width: 10% !important; text-align: center !important; }
    .year-section th:nth-child(5), .year-section td:nth-child(5) { width: 15% !important; text-align: right !important; white-space: normal !important; }
    .year-section th:nth-child(6), .year-section td:nth-child(6) { width: 15% !important; text-align: right !important; white-space: normal !important; }
    .year-section th:nth-child(7), .year-section td:nth-child(7) { width: 15% !important; text-align: right !important; white-space: normal !important; }"""

new_css = """    /* Explicit mobile column widths to minimize gaps and fit exactly 100% */
    .year-section th:nth-child(1), .year-section td:nth-child(1) { width: 5% !important; text-align: center !important; white-space: nowrap !important; }
    .year-section th:nth-child(2), .year-section td:nth-child(2) { width: 24% !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
    .year-section th:nth-child(3), .year-section td:nth-child(3) { width: 13% !important; text-align: center !important; white-space: nowrap !important; }
    .year-section th:nth-child(4), .year-section td:nth-child(4) { width: 9% !important; text-align: center !important; white-space: nowrap !important; }
    .year-section th:nth-child(5), .year-section td:nth-child(5) { width: 16% !important; text-align: right !important; white-space: normal !important; }
    .year-section th:nth-child(6), .year-section td:nth-child(6) { width: 16% !important; text-align: right !important; white-space: normal !important; }
    .year-section th:nth-child(7), .year-section td:nth-child(7) { width: 17% !important; text-align: right !important; white-space: nowrap !important; }"""

if old_css in css:
    css = css.replace(old_css, new_css)
    print("Successfully replaced table CSS in style.css!")
else:
    print("Could not find the exact CSS block.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(css)
