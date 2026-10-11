export type TournamentStatus = "planned" | "completed" | "cancelled";

export interface Player {
  id: string;
  name: string;
  photoUrl?: string;
  joinedYear: number;
}

export interface Tournament {
  id: string;
  year: number;
  date: string;
  location: string;
  courseId?: string;
  hcpPercentage: number;
  status: TournamentStatus;
  registeredPlayerIds: string[];
}

export interface Result {
  id: string;
  tournamentId: string;
  playerId: string;
  score: number;
  hcpPercentage: number;
  placement: number;
}

export interface SidePrize {
  id: string;
  tournamentId: string;
  title: string;
  winnerPlayerId?: string;
  description?: string;
}

export interface Photo {
  id: string;
  tournamentId: string;
  url: string;
  storagePath: string;
  caption?: string;
}

export interface Highlight {
  id: string;
  tournamentId: string;
  text: string;
  author?: string;
}

export interface Course {
  id: string;
  name: string;
  localRules?: string;
}

export interface RecordEntry {
  lowestScoreEver: { playerId: string; playerName: string; score: number; year: number } | null;
  biggestImprovement: {
    playerId: string;
    playerName: string;
    delta: number;
    fromYear: number;
    toYear: number;
  } | null;
  mostPodiums: { playerId: string; playerName: string; count: number } | null;
}

export interface Champion {
  year: number;
  status: "completed" | "cancelled";
  player: { id: string; name: string; photoUrl?: string } | null;
  score: number | null;
}

export interface LandingSummary {
  nextTournament: Tournament | null;
  currentHcpPercentage: number | null;
  reigningChampion: { id: string; name: string; photoUrl?: string; year: number } | null;
  registeredPlayerCount: number;
}
