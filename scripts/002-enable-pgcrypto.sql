-- Enable pgcrypto so gen_random_uuid() works everywhere.
-- Idempotent: safe to run multiple times.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
