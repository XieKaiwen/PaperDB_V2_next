npx primsa db push

# Then run sql query to make add RLS to all tables
psql $DATABASE_URL -f src/SQL-scripts/enableAllTableRLS.sql
