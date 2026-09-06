import { Match, Channel } from '../types';

export interface StreamProvider {
  id: string;
  name: string;
  fetchMatches(): Promise<Match[]>;
  resolveStreams(
    matchTitle: string,
    homeTeam: string,
    awayTeam: string,
    matchId: string,
    preFetchedMatch?: Match | null
  ): Promise<Channel[]>;
}
