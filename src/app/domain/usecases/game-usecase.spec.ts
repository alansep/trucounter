import { TestBed } from '@angular/core/testing';
import { GameUsecase } from './game-usecase';
import { GameGateway } from '../gateways/game-gateway';
import { GAME_GATEWAY } from '../gateways/game-gateway.token';
import { Game } from '../../core/entity/game';

class MockGameGateway implements GameGateway {
  private game: Game | null = null;

  async getCurrentGame(): Promise<Game | null> {
    return this.game;
  }

  async saveGame(game: Game): Promise<void> {
    this.game = game;
  }

  async createNewGame(): Promise<Game> {
    const newGame: Game = {
      id: 'test-id',
      teamA: { name: 'Time A', score: 0 },
      teamB: { name: 'Time B', score: 0 },
      actions: [],
      createdAt: Date.now(),
    };
    this.game = newGame;
    return newGame;
  }

  setGame(game: Game | null): void {
    this.game = game;
  }
}

describe('GameUsecase', () => {
  let usecase: GameUsecase;
  let mockGateway: MockGameGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameUsecase,
        { provide: GAME_GATEWAY, useClass: MockGameGateway },
      ],
    });

    usecase = TestBed.inject(GameUsecase);
    mockGateway = TestBed.inject(GAME_GATEWAY) as unknown as MockGameGateway;
  });

  it('should be created', () => {
    expect(usecase).toBeTruthy();
  });

  describe('addPoint', () => {
    it('should create a new game if none exists', async () => {
      const game = await usecase.addPoint('A');
      expect(game).toBeTruthy();
      expect(game.teamA.score).toBe(1);
      expect(game.teamB.score).toBe(0);
    });

    it('should increment team A score', async () => {
      await usecase.addPoint('A');
      const game = await usecase.getCurrentGame();
      expect(game?.teamA.score).toBe(1);
    });

    it('should increment team B score', async () => {
      await usecase.addPoint('B');
      const game = await usecase.getCurrentGame();
      expect(game?.teamB.score).toBe(1);
    });

    it('should not increment beyond 12 points', async () => {
      const game12: Game = {
        id: 'test',
        teamA: { name: 'Time A', score: 12 },
        teamB: { name: 'Time B', score: 0 },
        actions: [],
        createdAt: Date.now(),
      };
      mockGateway.setGame(game12);

      const result = await usecase.addPoint('A');
      expect(result.teamA.score).toBe(12);
    });

    it('should add action to actions array', async () => {
      await usecase.addPoint('A');
      const game = await usecase.getCurrentGame();
      expect(game?.actions.length).toBe(1);
      expect(game?.actions[0].type).toBe('addPoint');
      expect(game?.actions[0].team).toBe('A');
    });
  });

  describe('undoPoint', () => {
    it('should undo last point', async () => {
      await usecase.addPoint('A');
      await usecase.addPoint('B');
      const result = await usecase.undoPoint();
      expect(result?.teamA.score).toBe(1);
      expect(result?.teamB.score).toBe(0);
    });

    it('should return null if no actions', async () => {
      const result = await usecase.undoPoint();
      expect(result).toBeNull();
    });

    it('should remove last action', async () => {
      await usecase.addPoint('A');
      await usecase.undoPoint();
      const game = await usecase.getCurrentGame();
      expect(game?.actions.length).toBe(0);
    });
  });

  describe('checkWinner', () => {
    it('should return null if no winner', async () => {
      await usecase.addPoint('A');
      const winner = await usecase.checkWinner();
      expect(winner).toBeNull();
    });

    it('should return A if team A reaches 12', async () => {
      const game12: Game = {
        id: 'test',
        teamA: { name: 'Time A', score: 12 },
        teamB: { name: 'Time B', score: 5 },
        actions: [],
        createdAt: Date.now(),
      };
      mockGateway.setGame(game12);

      const winner = await usecase.checkWinner();
      expect(winner).toBe('A');
    });

    it('should return B if team B reaches 12', async () => {
      const game12: Game = {
        id: 'test',
        teamA: { name: 'Time A', score: 5 },
        teamB: { name: 'Time B', score: 12 },
        actions: [],
        createdAt: Date.now(),
      };
      mockGateway.setGame(game12);

      const winner = await usecase.checkWinner();
      expect(winner).toBe('B');
    });
  });
});
