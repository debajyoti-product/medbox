-- Create medicine catalog table for searchable medicine database
CREATE TABLE public.medicine_catalog (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  pack_size_label TEXT,
  short_composition TEXT
);

-- Enable RLS (public read access for search)
ALTER TABLE public.medicine_catalog ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read medicine catalog (it's public reference data)
CREATE POLICY "Anyone can view medicine catalog"
ON public.medicine_catalog
FOR SELECT
USING (true);

-- Create GIN indexes for fuzzy text search on all text columns
CREATE INDEX medicine_catalog_name_idx ON public.medicine_catalog USING gin (name gin_trgm_ops);
CREATE INDEX medicine_catalog_pack_size_idx ON public.medicine_catalog USING gin (pack_size_label gin_trgm_ops);
CREATE INDEX medicine_catalog_composition_idx ON public.medicine_catalog USING gin (short_composition gin_trgm_ops);