import { Injectable, inject } from '@angular/core';
import { GameGateway } from '../../domain/gateways/game-gateway';
import { StorageGateway } from '../../domain/gateways/storage-gateway';
import { STORAGE_GATEWAY } from '../../domain/gateways/storage-gateway.token';
import { Game } from '../../core/entity/game';

const CURRENT_GAME_KEY = 'trucounter_current_game';
const LAST_SCORE_KEY = 'trucounter_last_score';

@Injectable({ providedIn: 'root' })
export class LocalGameAdapter implements GameGateway {
  private readonly storage = inject<StorageGateway>(STORAGE_GATEWAY);

  async getCurrentGame(): Promise<Game | null> {
    return this.storage.getItem<Game>(CURRENT_GAME_KEY);
  }

  async saveGame(game: Game): Promise<void> {
    await this.storage.setItem(CURRENT_GAME_KEY, game);
  }

  async createNewGame(): Promise<Game> {
    // Save current game as last score before creating new one
    const currentGame = await this.getCurrentGame();
    if (currentGame && (currentGame.teamA.score > 0 || currentGame.teamB.score > 0)) {
      await this.storage.setItem(LAST_SCORE_KEY, {
        teamA: currentGame.teamA.score,
        teamB: currentGame.teamB.score,
        timestamp: Date.now(),
      });
    }

    const newGame: Game = {
      id: crypto.randomUUID(),
      teamA: { name: 'Time A', score: 0 },
      teamB: { name: 'Time B', score: 0 },
      actions: [],
      createdAt: Date.now(),
    };

    await this.saveGame(newGame);
    return newGame;
  }
}
