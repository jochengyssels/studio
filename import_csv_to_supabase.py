import psycopg2
import csv
import os
from typing import Dict, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseImporter:
    def __init__(self):
        # Get database credentials from environment variables
        self.db_config = {
            "dbname": os.getenv("SUPABASE_DB_NAME"),
            "user": os.getenv("SUPABASE_USER", "postgres"),
            "password": os.getenv("SUPABASE_PASSWORD"),
            "host": os.getenv("SUPABASE_HOST"),
            "port": os.getenv("SUPABASE_PORT", "5432")
        }
        self.conn = None
        self.cur = None

    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(**self.db_config)
            self.cur = self.conn.cursor()
            print("Successfully connected to Supabase database")
        except psycopg2.Error as e:
            print(f"Error connecting to database: {e}")
            raise

    def close(self):
        """Close database connection"""
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()
            print("Database connection closed")

    def validate_csv(self, csv_path: str) -> bool:
        """Validate if CSV file exists and is not empty"""
        if not os.path.exists(csv_path):
            print(f"Error: CSV file {csv_path} not found")
            return False
        
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            if not reader.fieldnames:
                print(f"Error: CSV file {csv_path} is empty or has no headers")
                return False
        return True

    def insert_from_csv(self, table: str, csv_path: str, batch_size: int = 1000) -> Dict:
        """
        Insert data from CSV file into specified table with batch processing
        
        Args:
            table: Name of the target table
            csv_path: Path to the CSV file
            batch_size: Number of rows to insert in each batch
            
        Returns:
            Dict containing success status and statistics
        """
        if not self.validate_csv(csv_path):
            return {"success": False, "rows_processed": 0, "error": "CSV validation failed"}

        try:
            with open(csv_path, 'r') as f:
                reader = csv.DictReader(f)
                rows_processed = 0
                batch = []

                for row in reader:
                    batch.append(row)
                    rows_processed += 1

                    if len(batch) >= batch_size:
                        self._insert_batch(table, batch)
                        batch = []

                # Insert remaining rows
                if batch:
                    self._insert_batch(table, batch)

                self.conn.commit()
                return {
                    "success": True,
                    "rows_processed": rows_processed,
                    "table": table,
                    "file": csv_path
                }

        except Exception as e:
            self.conn.rollback()
            print(f"Error processing CSV file: {e}")
            return {"success": False, "rows_processed": rows_processed, "error": str(e)}

    def _insert_batch(self, table: str, rows: List[Dict]):
        """Helper method to insert a batch of rows"""
        if not rows:
            return

        columns = rows[0].keys()
        values = [[row[column] for column in columns] for row in rows]
        
        columns_str = ', '.join(columns)
        placeholders = ', '.join(['%s'] * len(columns))
        query = f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})"
        
        self.cur.executemany(query, values)

def main():
    # Initialize importer
    importer = SupabaseImporter()
    
    try:
        # Connect to database
        importer.connect()
        
        # Import data from CSV files
        tables_and_files = [
            ('locations', 'locations.csv'),
            ('activities', 'activities.csv')
        ]
        
        for table, csv_file in tables_and_files:
            print(f"\nProcessing {csv_file}...")
            result = importer.insert_from_csv(table, csv_file)
            
            if result["success"]:
                print(f"Successfully imported {result['rows_processed']} rows into {result['table']}")
            else:
                print(f"Failed to import {csv_file}: {result.get('error', 'Unknown error')}")
                
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        importer.close()

if __name__ == "__main__":
    main() 