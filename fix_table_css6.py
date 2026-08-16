import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's completely remove the previously appended block by splitting at "/* User Requested Mobile Table Fixes"
if "/* User Requested Mobile Table Fixes" in content:
    content = content.split("/* User Requested Mobile Table Fixes")[0]

overrides = """
/* User Requested Mobile Table Fixes - 1 Line, No Scroll, Edge-to-Edge */
@media (max-width: 480px) {
    /* ONLY affect table container, not the whole page */
    .table-container {
        padding: 5px !important;
        margin-left: -10px !important; /* expand into the container's padding */
        margin-right: -10px !important;
        border-radius: 8px !important;
    }
    
    /* Ensure no scroll and strict one line */
    .table-scroll {
        overflow-x: hidden !important;
        width: 100% !important;
        padding: 0 !important;
    }
    
    .year-section table, .cashbook-card table {
        width: 100% !important;
        min-width: unset !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
    }
    
    /* Force one line, reduce font and padding */
    .year-section table th, .cashbook-card table th,
    .year-section table td, .cashbook-card table td {
        padding: 6px 3px !important;
        font-size: 8px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        word-wrap: normal !important;
        vertical-align: middle !important;
    }
    
    /* Adjust specific column widths to fit all 7 columns perfectly */
    /* 1:#, 2:NAME, 3:DATE, 4:MODE, 5:CASH IN, 6:CASH OUT, 7:BALANCE */
    .year-section th:nth-child(1), .year-section td:nth-child(1) { width: 5% !important; text-align: center !important; }
    .year-section th:nth-child(2), .year-section td:nth-child(2) { width: 25% !important; text-align: left !important; }
    .year-section th:nth-child(3), .year-section td:nth-child(3) { width: 14% !important; text-align: center !important; }
    .year-section th:nth-child(4), .year-section td:nth-child(4) { width: 10% !important; text-align: center !important; }
    .year-section th:nth-child(5), .year-section td:nth-child(5) { width: 15% !important; text-align: right !important; }
    .year-section th:nth-child(6), .year-section td:nth-child(6) { width: 15% !important; text-align: right !important; }
    .year-section th:nth-child(7), .year-section td:nth-child(7) { width: 16% !important; text-align: right !important; }
    
    .mode-badge {
        padding: 1px 3px !important;
        font-size: 7px !important;
        display: inline-block !important;
    }
}
"""
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content + "\n" + overrides)

print("Done")
