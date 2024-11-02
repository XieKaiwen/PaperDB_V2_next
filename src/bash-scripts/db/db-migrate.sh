#!/bin/bash

# Navigate to your project directory (if needed)
# cd /path/to/your/project

# Run npx prisma migrate
echo "Running Prisma Migrate..."
npx prisma migrate dev

# Check if the migration was successful
if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
else
  echo "Migration failed. Please check for errors."
  exit 1
fi

psql $DATABASE_URL -f src/SQL-scripts/enableAllTableRLS.sql