export type TeamSide = 'A' | 'B';

export interface Action {
  type: 'addPoint';
  team: TeamSide;
  timestamp: number;
}
