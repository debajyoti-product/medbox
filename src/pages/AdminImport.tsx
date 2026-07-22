// TODO: BLOCKER - This route is currently reachable by ANY authenticated user.
// DO NOT ship to production without implementing Role-Based Access Control (RBAC) to restrict this to admins only.
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

const CHUNK_SIZE = 2000; // Lines per batch

const AdminImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [importedRecords, setImportedRecords] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setImportedRecords(0);
    setStatus("Reading file...");

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const totalLines = lines.length - 1; // Exclude header
      setTotalRecords(totalLines);
      setStatus(`Found ${totalLines.toLocaleString()} medicines to import`);

      // Split into chunks
      const chunks: string[][] = [];
      for (let i = 1; i < lines.length; i += CHUNK_SIZE) {
        chunks.push(lines.slice(i, i + CHUNK_SIZE));
      }

      let inserted = 0;
      let errors = 0;
      const header = lines[0];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const csvData = [header, ...chunk].join('\n');
        
        setStatus(`Importing batch ${i + 1} of ${chunks.length}...`);
        
        const { data, error } = await supabase.functions.invoke('import-medicines', {
          body: { csvData, clearFirst: i === 0 }
        });

        if (error) {
          console.error(`Batch ${i + 1} error:`, error);
          errors++;
        } else if (data) {
          inserted += data.inserted || 0;
          setImportedRecords(inserted);
        }

        setProgress(((i + 1) / chunks.length) * 100);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setStatus(`Complete! Imported ${inserted.toLocaleString()} medicines${errors > 0 ? ` (${errors} batch errors)` : ''}`);
      toast.success(`Successfully imported ${inserted.toLocaleString()} medicines`);
      
    } catch (error) {
      console.error("Import error:", error);
      setStatus("Import failed");
      toast.error("Import failed. Check console for details.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-2">Medicine Database Import</h1>
          <p className="text-muted-foreground text-sm">
            Upload a CSV file to import medicines into the searchable database
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-md space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className={`cursor-pointer flex flex-col items-center gap-3 ${isImporting ? 'opacity-50' : ''}`}
            >
              <Upload className="w-12 h-12 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {isImporting ? "Importing..." : "Click to select CSV file"}
              </span>
              <span className="text-xs text-muted-foreground">
                Expected columns: id, name, price, pack_size_label, short_composition
              </span>
            </label>
          </div>

          {(isImporting || progress > 0) && (
            <div className="space-y-3">
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{status}</span>
                <span className="font-medium text-foreground">
                  {importedRecords.toLocaleString()} / {totalRecords.toLocaleString()}
                </span>
              </div>
              {progress >= 100 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Import complete!</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Large imports may take several minutes. Do not close this page.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminImport;
