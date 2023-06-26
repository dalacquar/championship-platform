export interface User {
  id: Number;
  username: string;
  email: string;
}

export interface Token {
  id: Number;
  username: string;
}

export interface Championship {
  id: number;
  name: string;
  start_time: string;
  created_at: string;
  min_teams: number;
  max_teams: number;
  prizes: string;
  format: string;
  rules: string;
  contact: string;
  visibility: string;
  round: number;
  game_id: number;
  admin_id: number;
  teams: Team[];
}

export interface Team {
  id: number;
  name: string;
  password: string;
  game_id: number;
  owner_id: number;
  championships: Championship[];
  users: User[];
}

export interface InviteUserToTeam {
  team_id?: number;
  user_id?: number;
}

export interface Game {
  id: number;
  name: string;
}
export interface User {
    id: Number;
    username: string;
}

export interface Championship {
    id: number,
    name: string,
    start_time: string,
    created_at: string,
    min_teams: number,
    max_teams: number,
    prizes: string,
    format: string,
    rules: string,
    contact: string,
    visibility: string,
    game_id: number,
    admin_id: number,
    teams: Team[]
}

export interface Team {
    id: number,
    name: string,
    password: string,
    game_id: number,
    owner_id: number
    championships: Championship[]
}

export interface Match {
    id?: number;
    championship_id: number;
    team_1_id: number;
    team_2_id?: number | null;
    round: number;
    bracket: number;
    result?: string;
    winner_team_id?: number;
}