-- Enable the pg_trgm extension for trigram-based text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a GIN index on medicines.name for fast text search
CREATE INDEX medicines_name_search_idx ON medicines USING gin (name gin_trgm_ops);