import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Medicine = {
  id?: string;
  name: string;
  type: string;
  perServing: number;
  timesPerDay: number;
  days: number;
  scheduleTime?: { hour: number; minute: number; period: "AM" | "PM" };
  ailment?: string;
  startDate?: string;
};

type DbMedicine = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  per_serving: number;
  times_per_day: number;
  days: number;
  schedule_hour: number | null;
  schedule_minute: number | null;
  schedule_period: string | null;
  ailment: string | null;
  start_date: string;
  created_at: string;
  updated_at: string;
};

const mapDbToMedicine = (db: DbMedicine): Medicine => ({
  id: db.id,
  name: db.name,
  type: db.type,
  perServing: db.per_serving,
  timesPerDay: db.times_per_day,
  days: db.days,
  scheduleTime: db.schedule_hour !== null && db.schedule_minute !== null && db.schedule_period
    ? { hour: db.schedule_hour, minute: db.schedule_minute, period: db.schedule_period as "AM" | "PM" }
    : undefined,
  ailment: db.ailment || undefined,
  startDate: db.start_date,
});

export const useMedicines = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    if (!user) {
      setMedicines([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedicines((data || []).map(mapDbToMedicine));
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [user]);

  const addMedicines = async (newMedicines: Medicine[]) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const records = newMedicines
        .filter((m) => m.name.trim())
        .map((m) => ({
          user_id: user.id,
          name: m.name,
          type: m.type,
          per_serving: m.perServing,
          times_per_day: m.timesPerDay,
          days: m.days,
          schedule_hour: m.scheduleTime?.hour ?? null,
          schedule_minute: m.scheduleTime?.minute ?? null,
          schedule_period: m.scheduleTime?.period ?? null,
          ailment: m.ailment ?? null,
          start_date: new Date().toISOString(),
        }));

      const { error } = await supabase.from("medicines").insert(records);
      if (error) throw error;

      await fetchMedicines();
      return { error: null };
    } catch (error) {
      console.error("Error adding medicines:", error);
      return { error: error as Error };
    }
  };

  const deleteMedicine = async (id: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase.from("medicines").delete().eq("id", id);
      if (error) throw error;

      await fetchMedicines();
      return { error: null };
    } catch (error) {
      console.error("Error deleting medicine:", error);
      return { error: error as Error };
    }
  };

  return { medicines, loading, addMedicines, deleteMedicine, refetch: fetchMedicines };
};
