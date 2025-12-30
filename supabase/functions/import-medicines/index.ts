import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BATCH_SIZE = 500;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting medicine import...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please log in to import medicines' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication - Please log in again' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { csvData, clearFirst } = await req.json();
    
    if (!csvData) {
      return new Response(
        JSON.stringify({ error: 'No CSV data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Parsing CSV data...');
    
    const lines = csvData.split('\n');
    console.log(`Total lines received: ${lines.length}`);
    
    const records: Array<{
      name: string;
      price: number | null;
      pack_size_label: string | null;
      short_composition: string | null;
    }> = [];
    
    // Check if first line is header
    const firstLine = lines[0]?.toLowerCase() || '';
    const startIndex = firstLine.includes('name') && firstLine.includes('price') ? 1 : 0;
    
    // Parse CSV
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = parseCSVLine(line);
      
      if (parts.length >= 5) {
        const [id, name, price, packSize, composition] = parts;
        
        if (name?.trim()) {
          records.push({
            name: name.trim(),
            price: price ? parseFloat(price) || null : null,
            pack_size_label: packSize?.trim() || null,
            short_composition: composition?.trim() || null,
          });
        }
      }
    }
    
    console.log(`Parsed ${records.length} records`);
    
    // Clear existing data if requested
    if (clearFirst) {
      console.log('Clearing existing medicine catalog...');
      const { error: deleteError } = await supabase
        .from('medicine_catalog')
        .delete()
        .neq('id', 0);
      
      if (deleteError) {
        console.error('Error clearing table:', deleteError);
      }
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
