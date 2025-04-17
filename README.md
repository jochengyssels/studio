# Supabase CSV Importer

This script provides a robust solution for importing CSV data into Supabase PostgreSQL database tables.

## Features

- Secure credential management using environment variables
- Batch processing for efficient data insertion
- Error handling and validation
- Support for multiple CSV files
- Progress reporting and statistics

## Prerequisites

- Python 3.6+
- `psycopg2` package
- `python-dotenv` package

## Installation

1. Install required packages:
```bash
pip install psycopg2-binary python-dotenv
```

2. Copy `.env.example` to `.env` and update with your Supabase credentials:
```bash
cp .env.example .env
```

3. Edit the `.env` file with your actual Supabase database credentials:
```
SUPABASE_DB_NAME=your_db
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your_password
SUPABASE_HOST=your_host.supabase.co
SUPABASE_PORT=5432
```

## Usage

1. Prepare your CSV files:
   - Ensure column names in CSV match your table structure
   - Files should be named according to their target tables (e.g., `locations.csv`, `activities.csv`)

2. Run the script:
```bash
python import_csv_to_supabase.py
```

## CSV File Format

Your CSV files should have headers that match the column names in your Supabase tables. For example:

locations.csv:
```csv
id,name,address,latitude,longitude
1,"Central Park","New York, NY",40.7829,-73.9654
```

## Error Handling

The script includes comprehensive error handling:
- CSV file validation
- Database connection errors
- Data insertion errors
- Automatic rollback on failure

## Batch Processing

By default, records are inserted in batches of 1000 rows. You can modify the batch size by changing the `batch_size` parameter in the `insert_from_csv` method.
