import { Team } from './team';
import { Action } from './action';

export interface Game {
  id: string;
  teamA: Team;
  teamB: Team;
  actions: Action[];
  createdAt: number;
}
