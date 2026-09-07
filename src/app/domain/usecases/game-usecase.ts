import { Injectable, inject } from '@angular/core';
import { Game } from '../../core/entity/game';
import { TeamSide } from '../../core/entity/action';
import { GameGateway } from '../gateways/game-gateway';
import { GAME_GATEWAY } from '../gateways/game-gateway.token';

@Injectable({ providedIn: 'root' })
export class GameUsecase {
  private readonly gameGateway = inject<GameGateway>(GAME_GATEWAY);

  async getCurrentGame(): Promise<Game | null> {
    return this.gameGateway.getCurrentGame();
  }

  async addPoint(team: TeamSide): Promise<Game> {
    let game = await this.getCurrentGame();
    if (!game) {
      game = await this.gameGateway.createNewGame();
    }

    const teamData = team === 'A' ? game.teamA : game.teamB;
    if (teamData.score >= 12) {
      return game;
    }

    const updatedGame: Game = {
      ...game,
      teamA: { ...game.teamA, score: team === 'A' ? game.teamA.score + 1 : game.teamA.score },
      teamB: { ...game.teamB, score: team === 'B' ? game.teamB.score + 1 : game.teamB.score },
      actions: [
        ...game.actions,
        { type: 'addPoint', team, timestamp: Date.now() },
      ],
    };

    await this.gameGateway.saveGame(updatedGame);
    return updatedGame;
  }

  async undoPoint(): Promise<Game | null> {
    const game = await this.getCurrentGame();
    if (!game || game.actions.length === 0) {
      return game;
    }

    const lastAction = game.actions[game.actions.length - 1];
    if (lastAction.type !== 'addPoint') {
      return game;
    }

    const updatedGame: Game = {
      ...game,
      teamA: {
        ...game.teamA,
        score: lastAction.team === 'A' ? game.teamA.score - 1 : game.teamA.score,
      },
      teamB: {
        ...game.teamB,
        score: lastAction.team === 'B' ? game.teamB.score - 1 : game.teamB.score,
      },
      actions: game.actions.slice(0, -1),
    };

    await this.gameGateway.saveGame(updatedGame);
    return updatedGame;
  }

  async checkWinner(): Promise<TeamSide | null> {
    const game = await this.getCurrentGame();
    if (!game) {
      return null;
    }

    if (game.teamA.score >= 12) return 'A';
    if (game.teamB.score >= 12) return 'B';
    return null;
  }

  async createNewGame(): Promise<Game> {
    return this.gameGateway.createNewGame();
  }
}
