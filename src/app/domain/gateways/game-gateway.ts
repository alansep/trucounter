import { Game } from '../../core/entity/game';

export interface GameGateway {
  getCurrentGame(): Promise<Game | null>;
  saveGame(game: Game): Promise<void>;
  createNewGame(): Promise<Game>;
}
