import MySQLdb

try:
    # Connect to MySQL server without selecting a specific database
    db = MySQLdb.connect(host="localhost", user="root", passwd="@adhi123")
    cursor = db.cursor()
    
    # Create database if it doesn't exist
    cursor.execute("CREATE DATABASE IF NOT EXISTS anonymous_compliment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    print("Database created successfully!")
    
    db.commit()
    cursor.close()
    db.close()
except Exception as e:
    print(f"Error creating database: {e}")
