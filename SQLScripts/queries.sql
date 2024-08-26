-- To enable RLS on all tables in the current database. Remember to disable on prisma migrations
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE' 
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
          AND table_schema = 'public' -- Only for the public schema, or adjust as needed
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.table_schema, r.table_name);
        EXCEPTION WHEN others THEN
            RAISE NOTICE 'Skipping table %I.%I due to insufficient privileges', r.table_schema, r.table_name;
        END;
    END LOOP;
END $$;
