import sqlite3

conn = sqlite3.connect('database.sqlite')
cursor = conn.cursor()
cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

for table in tables:
    print(f"Table: {table[0]}")
    print(table[1])
    print("-" * 40)
