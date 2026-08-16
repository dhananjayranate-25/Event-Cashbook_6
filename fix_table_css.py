import re

file_path = "style.css"

with open(file_path, "r", encoding="utf-8") as f:
    css = f.read()

old_css = """    /* Allow horizontal scrolling on mobile to prevent overlapping */
    .table-scroll {
        overflow-x: auto !important;
        width: 100% !important;
        -webkit-overflow-scrolling: touch;
    }
    .year-section table, .cashbook-card table {
        width: 100% !important;
        min-width: 500px !important;
        table-layout: auto !important;
    }
    /* Make headers readable */
    .year-section table th, .cashbook-card table th {
        padding: 8px 5px !important;
        font-size: 10px !important;
        white-space: nowrap !important;
        text-align: left !important;
    }
    /* Let cells size themselves */
    .year-section table td, .cashbook-card table td {
        padding: 8px 5px !important;
        font-size: 11px !important;
        white-space: normal !important;
        word-wrap: break-word !important;
        text-align: left !important;
    }
    
    /* Remove explicit fixed percentages to allow flex sizing */
    .year-section th:nth-child(1), .year-section td:nth-child(1) { width: auto !important; text-align: center !important; }
    .year-section th:nth-child(2), .year-section td:nth-child(2) { width: auto !important; }
    .year-section th:nth-child(3), .year-section td:nth-child(3) { width: auto !important; text-align: center !important; }
    .year-section th:nth-child(4), .year-section td:nth-child(4) { width: auto !important; text-align: center !important; }
    .year-section th:nth-child(5), .year-section td:nth-child(5) { width: auto !important; text-align: right !important; white-space: nowrap !important; }
    .year-section th:nth-child(6), .year-section td:nth-child(6) { width: auto !important; text-align: right !important; white-space: nowrap !important; }
    .year-section th:nth-child(7), .year-section td:nth-child(7) { width: auto !important; text-align: right !important; white-space: nowrap !important; }"""

new_css = """    /* Force Table to strictly fit screen width without horizontal scroll */
    .table-scroll {
        overflow-x: hidden !important;
        width: 100% !important;
    }
    .year-section table, .cashbook-card table {
        width: 100% !important;
        min-width: unset !important;
        table-layout: fixed !important;
    }
    /* Headers can wrap on two lines to prevent overlap, font size reduced to fit */
    .year-section table th, .cashbook-card table th {
        padding: 4px 1px !important;
        font-size: 8px !important;
        white-space: normal !important;
        word-wrap: break-word !important;
        text-align: left !important;
        line-height: 1.1 !important;
    }
    /* Cells wrap text naturally to fit */
    .year-section table td, .cashbook-card table td {
        padding: 4px 1px !important;
        font-size: 9px !important;
        white-space: normal !important;
        word-wrap: break-word !important;
        text-align: left !important;
    }
    
    /* Explicit mobile column widths to minimize gaps and fit exactly 100% */
    .year-section th:nth-child(1), .year-section td:nth-child(1) { width: 5% !important; text-align: center !important; }
    .year-section th:nth-child(2), .year-section td:nth-child(2) { width: 28% !important; }
    .year-section th:nth-child(3), .year-section td:nth-child(3) { width: 12% !important; text-align: center !important; }
    .year-section th:nth-child(4), .year-section td:nth-child(4) { width: 10% !important; text-align: center !important; }
    .year-section th:nth-child(5), .year-section td:nth-child(5) { width: 15% !important; text-align: right !important; white-space: normal !important; }
    .year-section th:nth-child(6), .year-section td:nth-child(6) { width: 15% !important; text-align: right !important; white-space: normal !important; }
    .year-section th:nth-child(7), .year-section td:nth-child(7) { width: 15% !important; text-align: right !important; white-space: normal !important; }"""

if old_css in css:
    css = css.replace(old_css, new_css)
    print("Successfully replaced table CSS in style.css!")
else:
    print("Could not find the exact CSS block.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(css)
