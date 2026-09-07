import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { GamePage } from './game.page';
import { GameUsecase } from '../domain/usecases/game-usecase';
import { HapticGateway } from '../domain/gateways/haptic-gateway';
import { GAME_GATEWAY } from '../domain/gateways/game-gateway.token';
import { HAPTIC_GATEWAY } from '../domain/gateways/haptic-gateway.token';
import { GameGateway } from '../domain/gateways/game-gateway';
import { Game } from '../core/entity/game';

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

class MockHapticGateway implements HapticGateway {
  async vibrate(): Promise<void> {}
  async isEnabled(): Promise<boolean> {
    return true;
  }
  async setEnabled(_enabled: boolean): Promise<void> {}
}

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;
  let mockGateway: MockGameGateway;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [GamePage],
      imports: [IonicModule.forRoot()],
      providers: [
        GameUsecase,
        { provide: GAME_GATEWAY, useClass: MockGameGateway },
        { provide: HAPTIC_GATEWAY, useClass: MockHapticGateway },
      ],
    });

    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;
    mockGateway = TestBed.inject(GAME_GATEWAY) as unknown as MockGameGateway;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a new game', async () => {
    await component.ngOnInit();
    const game = component.game();
    expect(game).toBeTruthy();
    expect(game?.teamA.score).toBe(0);
    expect(game?.teamB.score).toBe(0);
  });

  it('should add point to team A', async () => {
    await component.ngOnInit();
    await component.addPoint('A');
    const game = component.game();
    expect(game?.teamA.score).toBe(1);
  });

  it('should add point to team B', async () => {
    await component.ngOnInit();
    await component.addPoint('B');
    const game = component.game();
    expect(game?.teamB.score).toBe(1);
  });

  it('should not add point if team has 12 points', async () => {
    const game12: Game = {
      id: 'test',
      teamA: { name: 'Time A', score: 12 },
      teamB: { name: 'Time B', score: 0 },
      actions: [],
      createdAt: Date.now(),
    };
    mockGateway.setGame(game12);
    await component.ngOnInit();

    await component.addPoint('A');
    const game = component.game();
    expect(game?.teamA.score).toBe(12);
  });

  it('should undo last point', async () => {
    await component.ngOnInit();
    await component.addPoint('A');
    await component.undoPoint();
    const game = component.game();
    expect(game?.teamA.score).toBe(0);
  });

  it('should detect winner', async () => {
    const game12: Game = {
      id: 'test',
      teamA: { name: 'Time A', score: 12 },
      teamB: { name: 'Time B', score: 0 },
      actions: [],
      createdAt: Date.now(),
    };
    mockGateway.setGame(game12);
    await component.ngOnInit();

    expect(component.winner()).toBe('A');
  });

  it('should disable team when at 12 points', async () => {
    const game12: Game = {
      id: 'test',
      teamA: { name: 'Time A', score: 12 },
      teamB: { name: 'Time B', score: 0 },
      actions: [],
      createdAt: Date.now(),
    };
    mockGateway.setGame(game12);
    await component.ngOnInit();

    expect(component.isTeamDisabled('A')).toBe(true);
    expect(component.isTeamDisabled('B')).toBe(false);
  });

  it('should enable undo when there are actions', async () => {
    await component.ngOnInit();
    expect(component.canUndo()).toBe(false);

    await component.addPoint('A');
    expect(component.canUndo()).toBe(true);
  });
});
