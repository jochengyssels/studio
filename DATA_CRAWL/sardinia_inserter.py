import psycopg2
import csv

# Connect to Supabase
conn = psycopg2.connect(
    dbname="your_db",
    user="postgres",
    password="your_password",
    host="db.jumbshuisqxneptseavf.supabase.co"
)

def insert_from_csv(table, csv_path):
    cur = conn.cursor()
    with open(csv_path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            columns = ', '.join(row.keys())
            placeholders = ', '.join(['%s'] * len(row))
            query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
            cur.execute(query, list(row.values()))
    conn.commit()

# Usage
insert_from_csv('locations', 'locations.csv')
insert_from_csv('activities', 'activities.csv')
