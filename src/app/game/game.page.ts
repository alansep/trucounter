import { Component, inject, signal, OnInit } from '@angular/core';
import { GameUsecase } from '../domain/usecases/game-usecase';
import { HapticGateway } from '../domain/gateways/haptic-gateway';
import { HAPTIC_GATEWAY } from '../domain/gateways/haptic-gateway.token';
import { Game } from '../core/entity/game';
import { TeamSide } from '../core/entity/action';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit {
  private readonly gameUsecase = inject(GameUsecase);
  private readonly hapticGateway = inject<HapticGateway>(HAPTIC_GATEWAY);

  readonly game = signal<Game | null>(null);
  readonly winner = signal<TeamSide | null>(null);
  readonly isAnimating = signal<TeamSide | null>(null);

  async ngOnInit(): Promise<void> {
    const existingGame = await this.gameUsecase.getCurrentGame();
    if (existingGame) {
      this.game.set(existingGame);
      await this.checkWinner();
    } else {
      const newGame = await this.gameUsecase.createNewGame();
      this.game.set(newGame);
    }
  }

  async addPoint(team: TeamSide): Promise<void> {
    if (this.winner()) return;

    const currentGame = this.game();
    if (!currentGame) return;

    const teamData = team === 'A' ? currentGame.teamA : currentGame.teamB;
    if (teamData.score >= 12) return;

    this.isAnimating.set(team);
    setTimeout(() => this.isAnimating.set(null), 200);

    await this.hapticGateway.vibrate();
    const updatedGame = await this.gameUsecase.addPoint(team);
    this.game.set(updatedGame);
    await this.checkWinner();
  }

  async undoPoint(): Promise<void> {
    const updatedGame = await this.gameUsecase.undoPoint();
    if (updatedGame) {
      this.game.set(updatedGame);
      this.winner.set(null);
    }
  }

  canUndo(): boolean {
    const currentGame = this.game();
    return currentGame !== null && currentGame.actions.length > 0;
  }

  isTeamDisabled(team: TeamSide): boolean {
    const currentGame = this.game();
    if (!currentGame) return true;

    const teamData = team === 'A' ? currentGame.teamA : currentGame.teamB;
    return teamData.score >= 12;
  }

  private async checkWinner(): Promise<void> {
    const winner = await this.gameUsecase.checkWinner();
    this.winner.set(winner);
    if (winner) {
      await this.hapticGateway.vibrate();
    }
  }
}
