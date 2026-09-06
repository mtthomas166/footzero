import { describe, it, expect } from 'vitest';
import { normalizeTeamName, teamSimilarity, teamsMatch, getLeaguePriority, getCountryForLeague } from './matching';

describe('Team Name Normalization', () => {
  it('should remove common team suffixes and clean strings', () => {
    expect(normalizeTeamName('Arsenal FC')).toBe('arsenal');
    expect(normalizeTeamName('Real Madrid CF')).toBe('madrid');
    expect(normalizeTeamName('Manchester United')).toBe('manchester');
    expect(normalizeTeamName('Atlético Madrid')).toBe('madrid');
  });

  it('should handle empty or null values gracefully', () => {
    expect(normalizeTeamName('')).toBe('');
  });
});

describe('Team Similarity Scoring', () => {
  it('should return 2.0 for exact matches', () => {
    expect(teamSimilarity('Chelsea', 'Chelsea')).toBe(2.0);
  });

  it('should return 1.5 for substring matches', () => {
    expect(teamSimilarity('Bayern Munich', 'Bayern')).toBe(1.5);
  });

  it('should score based on significant word overlaps', () => {
    expect(teamSimilarity('Paris Saint Germain', 'Paris')).toBe(1.5);
  });

  it('should return 0 for non-matching teams', () => {
    expect(teamSimilarity('Liverpool', 'Everton')).toBe(0);
  });
});

describe('Teams Matching Algorithm', () => {
  it('should match identical games with different syntax', () => {
    expect(teamsMatch('Arsenal vs Chelsea', 'Chelsea - Arsenal FC')).toBe(true);
  });

  it('should match with minor name variations', () => {
    expect(teamsMatch('Real Madrid CF vs Barcelona', 'Barcelona vs Madrid')).toBe(true);
  });

  it('should reject different games', () => {
    expect(teamsMatch('Liverpool vs Arsenal', 'Manchester United vs Chelsea')).toBe(false);
  });
});

describe('League Priority & Country Parsing', () => {
  it('should assign correct priority tiers', () => {
    expect(getLeaguePriority('Premier League')).toBe(2);
    expect(getLeaguePriority('UEFA Champions League')).toBe(1);
    expect(getLeaguePriority('Random League')).toBe(5);
  });

  it('should map countries correctly based on keywords', () => {
    expect(getCountryForLeague('English Premier League')).toBe('England');
    expect(getCountryForLeague('Moroccan Botola Pro')).toBe('Morocco');
    expect(getCountryForLeague('Under-21 friendly')).toBe('');
  });
});
