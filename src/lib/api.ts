import { tournaments, Tournament, Match } from "@/data/tournaments";
import { departmentList, DepartmentTeam } from "@/data/teams";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type UIMatchItem = { match: Match; tournamentTitle: string; tournamentId: string };
export type UITeamOverview = { id: string; name: string; short: string; players: number };
export type UITournament = Tournament;

// Supabase row typings (minimal subset used by queries)
type SupabaseMatchRow = {
  id: string;
  tournament_id: string;
  match_date?: string;
  team_a?: string;
  team_b?: string;
  venue?: string;
  status?: string;
  scorecard?: unknown;
  tournaments?: { id: string; name: string } | null;
};

type SupabaseTeamRow = {
  id: string;
  name: string;
  short_name?: string;
  description?: string;
  team_members?: SupabaseTeamMember[] | null;
};

type SupabaseTeamMember = {
  team_id: string;
  profile_id: string;
  profile_name?: string;
  role?: string;
};

export const fetchMatches = async (): Promise<UIMatchItem[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('matches').select('*, tournaments: tournament_id(id, name, season)').order('match_date', { ascending: true });
    if (error) return [];
    const rows: UIMatchItem[] = (data || []).map((r: unknown) => {
      const rec = r as SupabaseMatchRow;
      return { match: (rec as unknown) as Match, tournamentTitle: rec?.tournaments?.name || '', tournamentId: rec?.tournament_id } as UIMatchItem;
    });
    return rows;
  }
  // local fallback
  return tournaments.flatMap((t) => t.matches.map((m) => ({ match: m, tournamentTitle: t.title, tournamentId: t.id })));
};

export const fetchMatchById = async (tournamentId: string, matchId: string): Promise<Match | null> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('matches').select('*').eq('id', matchId).limit(1).maybeSingle();
    if (error) return null;
    return (data as Match) || null;
  }
  const t = tournaments.find((x) => x.id === tournamentId);
  if (!t) return null;
  return t.matches.find((m) => m.id === matchId) || null;
};

export const fetchTeamsOverview = async (): Promise<UITeamOverview[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('teams').select('id, name, short_name, (select count(*) from team_members where team_members.team_id = teams.id) as players_count');
    if (error) return [];
    return (data || []).map((r: unknown) => {
      const rec = r as SupabaseTeamRow & { players_count?: number };
      return { id: rec.id, name: rec.name, short: rec.short_name || '', players: Number(rec.players_count) || 0 };
    });
  }
  return departmentList.map((d) => ({ id: d.key, name: d.name, short: d.short, players: d.players.length }));
};

export const fetchDepartmentTeam = async (deptKey: string): Promise<DepartmentTeam | null> => {
  if (isSupabaseConfigured && supabase) {
    // Assuming deptKey maps to team short_name
    const { data, error } = await supabase.from('teams').select('*, team_members(*)').eq('short_name', deptKey).limit(1).maybeSingle();
    if (error || !data) return null;
    // Map to DepartmentTeam shape minimally
    const team = data as SupabaseTeamRow;
    const players = (team.team_members || []).map((m) => ({ id: String(m.profile_id), name: m.profile_name || 'Player', role: (m.role as string) || 'Batsman' }));
    const dept: DepartmentTeam = {
      key: String(team.id),
      name: team.name,
      short: team.short_name || team.name,
      description: team.description || '',
      players,
    } as DepartmentTeam;
    return dept;
  }
  return departmentList.find((d) => d.key === (deptKey as DepartmentTeam['key'])) || null;
};

export const fetchTournamentById = async (id: string): Promise<UITournament | null> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).limit(1).maybeSingle();
    if (error || !data) return null;
    return data as UITournament;
  }
  return tournaments.find((t) => t.id === id) || null;
};

// Note: These are simple local implementations. When Supabase is configured, you can extend
// these functions to query Supabase tables instead. For now, returning local static data keeps pages working.

export default {};
