-- Enable pgcrypto so gen_random_uuid() works everywhere.
-- Safe to run multiple times.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
