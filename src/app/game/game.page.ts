import { Component, inject, signal } from '@angular/core';
import { GameUsecase } from '../domain/usecases/game-usecase';
import { HapticGateway } from '../domain/gateways/haptic-gateway';
import { HAPTIC_GATEWAY } from '../domain/gateways/haptic-gateway.token';
import { DisplayPreferenceUsecase } from '../domain/usecases/display-preference-usecase';
import { OrientationGateway } from '../domain/gateways/orientation-gateway';
import { ORIENTATION_GATEWAY } from '../domain/gateways/orientation-gateway.token';
import { Game } from '../core/entity/game';
import { TeamSide } from '../core/entity/action';
import { DisplayView } from '../core/entity/display-preference';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage {
  private readonly gameUsecase = inject(GameUsecase);
  private readonly hapticGateway = inject<HapticGateway>(HAPTIC_GATEWAY);
  private readonly displayPreferenceUsecase = inject(DisplayPreferenceUsecase);
  private readonly orientationGateway = inject<OrientationGateway>(ORIENTATION_GATEWAY);

  readonly game = signal<Game | null>(null);
  readonly winner = signal<TeamSide | null>(null);
  readonly isAnimating = signal<TeamSide | null>(null);
  readonly isHorizontal = signal(false);

  async ionViewWillEnter(): Promise<void> {
    await this.loadDisplayPreference();
    await this.loadGame();
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

  private async loadDisplayPreference(): Promise<void> {
    const view: DisplayView = await this.displayPreferenceUsecase.getView();
    this.isHorizontal.set(view === 'horizontal');
    await this.lockOrientation(view);
  }

  private async lockOrientation(view: DisplayView): Promise<void> {
    try {
      if (view === 'horizontal') {
        await this.orientationGateway.lock('landscape');
      } else {
        await this.orientationGateway.lock('portrait');
      }
    } catch {
      // Orientation lock not supported on this platform — silently ignore
    }
  }

  private async loadGame(): Promise<void> {
    const existingGame = await this.gameUsecase.getCurrentGame();
    if (existingGame) {
      this.game.set(existingGame);
      await this.checkWinner();
    } else {
      const newGame = await this.gameUsecase.createNewGame();
      this.game.set(newGame);
    }
  }

  private async checkWinner(): Promise<void> {
    const winner = await this.gameUsecase.checkWinner();
    this.winner.set(winner);
    if (winner) {
      await this.hapticGateway.vibrate();
    }
  }
}
