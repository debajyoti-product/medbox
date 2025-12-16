import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BATCH_SIZE = 1000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting medicine import...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Read CSV file embedded with the function
    const csvPath = new URL('./medicines.csv', import.meta.url);
    const csvContent = await Deno.readTextFile(csvPath);
    
    console.log('CSV file loaded, parsing...');
    
    const lines = csvContent.split('\n');
    const header = lines[0];
    console.log(`Header: ${header}`);
    console.log(`Total lines: ${lines.length}`);
    
    const records: Array<{
      name: string;
      price: number | null;
      pack_size_label: string | null;
      short_composition: string | null;
    }> = [];
    
    // Parse CSV (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handle commas in quoted fields)
      const parts = parseCSVLine(line);
      
      if (parts.length >= 5) {
        const [id, name, price, packSize, composition] = parts;
        
        records.push({
          name: name?.trim() || '',
          price: price ? parseFloat(price) || null : null,
          pack_size_label: packSize?.trim() || null,
          short_composition: composition?.trim() || null,
        });
      }
    }
    
    console.log(`Parsed ${records.length} records`);
    
    // Clear existing data first
    console.log('Clearing existing medicine catalog...');
    const { error: deleteError } = await supabase
      .from('medicine_catalog')
      .delete()
      .neq('id', 0); // Delete all
    
    if (deleteError) {
      console.error('Error clearing table:', deleteError);
    }
    
    // Insert in batches
    let inserted = 0;
    let errors = 0;
    
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      
      const { error } = await supabase
        .from('medicine_catalog')
        .insert(batch);
      
      if (error) {
        console.error(`Batch ${Math.floor(i / BATCH_SIZE)} error:`, error);
        errors++;
      } else {
        inserted += batch.length;
        console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}, total: ${inserted}`);
      }
    }
    
    console.log(`Import complete! Inserted: ${inserted}, Errors: ${errors}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted, 
        errors,
        total: records.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Import error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}
