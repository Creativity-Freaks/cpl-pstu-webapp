import { supabase } from "../src/lib/supabase";

interface Department {
  key: string;
  name: string;
  short: string;
  description?: string;
}

// TODO: Replace with actual department data
const departmentList: Department[] = [];

const insertTeams = async () => {
  if (!supabase) {
    console.error("Supabase client is not initialized.");
    return;
  }

  try {
    for (const team of departmentList) {
      const { error } = await supabase.from("teams").insert({
        key: team.key,
        name: team.name,
        short: team.short,
        description: team.description,
      });

      if (error) {
        console.error(`Error inserting team ${team.name}:`, error);
      } else {
        console.log(`Successfully inserted team ${team.name}`);
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

insertTeams();