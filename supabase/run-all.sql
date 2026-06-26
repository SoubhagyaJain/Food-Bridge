-- FoodBridge v1: run entire schema in one go
-- Supabase Dashboard → SQL Editor → paste and Run
-- Order: 001 → 008

\ir migrations/001_extensions_enums.sql
\ir migrations/002_core_tables.sql
\ir migrations/003_audit_notifications.sql
\ir migrations/004_functions_triggers.sql
\ir migrations/005_rls_policies.sql
\ir migrations/006_storage.sql
\ir migrations/007_views_indexes.sql
\ir migrations/008_backfill.sql