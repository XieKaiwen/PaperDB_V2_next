npx prisma db push
# Ensure .env file is loaded
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)  # Safely source the .env variables
fi

# Optionally, print the value to debug
echo "Using DATABASE_URL: $DATABASE_URL"
# Then run sql query to make add RLS to all tables
psql -h aws-0-ap-southeast-1.pooler.supabase.com -p 5432 -d postgres -U postgres.xqcjbegpomtaysmthylw -f src/SQL-scripts/enableAllTableRLS.sql
