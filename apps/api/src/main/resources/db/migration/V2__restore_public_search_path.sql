-- V1 contains pg_dump session settings that clear search_path.
-- Restore the schema used by unqualified application queries after migration.
SELECT pg_catalog.set_config('search_path', 'public', false);
