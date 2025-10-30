import { supabase } from "@/lib/supabase";

export type Player = {
  id: string;
  name: string;
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicket-keeper";
  session?: string;
  avatar?: string;
};

export type DepartmentKey = "csit" | "cce" | "pme" | "eee" | "mathematics";

export type DepartmentTeam = {
  key: DepartmentKey;
  name: string;
  short: string;
  description: string;
  captain?: string;
  coach?: string;
  achievements?: string[];
  players: Player[];
};

export const fetchDepartments = async (): Promise<DepartmentTeam[]> => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("key:short_name, name, short:short_name, description, color, logo_url");

    if (error) throw error;

    // Map returned rows to DepartmentTeam shape (players/captain may be absent)
    const rows = (data || []) as Array<Record<string, unknown>>;
    return rows.map((r) => ({
      key: ((r['key'] as string) || (r['short'] as string) || '') as DepartmentKey,
      name: String(r['name'] || ''),
      short: String((r['short'] as string) || (r['key'] as string) || ''),
      description: String(r['description'] || ''),
  captain: undefined,
      coach: undefined,
  achievements: undefined,
      players: [],
    })) as DepartmentTeam[];
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};
