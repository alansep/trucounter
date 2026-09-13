import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { GamePage } from './game.page';
import { GameUsecase } from '../domain/usecases/game-usecase';
import { DisplayPreferenceUsecase } from '../domain/usecases/display-preference-usecase';
import { HapticGateway } from '../domain/gateways/haptic-gateway';
import { OrientationGateway } from '../domain/gateways/orientation-gateway';
import { GAME_GATEWAY } from '../domain/gateways/game-gateway.token';
import { HAPTIC_GATEWAY } from '../domain/gateways/haptic-gateway.token';
import { DISPLAY_PREFERENCE_GATEWAY } from '../domain/gateways/display-preference-gateway.token';
import { ORIENTATION_GATEWAY } from '../domain/gateways/orientation-gateway.token';
import { GameGateway } from '../domain/gateways/game-gateway';
import { DisplayPreferenceGateway } from '../domain/gateways/display-preference-gateway';
import { Game } from '../core/entity/game';
import { DisplayPreference } from '../core/entity/display-preference';

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

class MockDisplayPreferenceGateway implements DisplayPreferenceGateway {
  private preference: DisplayPreference | null = null;

  async getDisplayPreference(): Promise<DisplayPreference | null> {
    return this.preference;
  }

  async saveDisplayPreference(preference: DisplayPreference): Promise<void> {
    this.preference = preference;
  }

  setPreference(preference: DisplayPreference | null): void {
    this.preference = preference;
  }
}

class MockOrientationGateway implements OrientationGateway {
  lastLock: string | null = null;

  async lock(orientation: 'portrait' | 'landscape'): Promise<void> {
    this.lastLock = orientation;
  }

  async unlock(): Promise<void> {
    this.lastLock = null;
  }
}

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;
  let mockGameGateway: MockGameGateway;
  let mockDisplayGateway: MockDisplayPreferenceGateway;
  let mockOrientationGateway: MockOrientationGateway;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [GamePage],
      imports: [IonicModule.forRoot()],
      providers: [
        GameUsecase,
        DisplayPreferenceUsecase,
        { provide: GAME_GATEWAY, useClass: MockGameGateway },
        { provide: HAPTIC_GATEWAY, useClass: MockHapticGateway },
        { provide: DISPLAY_PREFERENCE_GATEWAY, useClass: MockDisplayPreferenceGateway },
        { provide: ORIENTATION_GATEWAY, useClass: MockOrientationGateway },
      ],
    });

    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;
    mockGameGateway = TestBed.inject(GAME_GATEWAY) as unknown as MockGameGateway;
    mockDisplayGateway = TestBed.inject(DISPLAY_PREFERENCE_GATEWAY) as unknown as MockDisplayPreferenceGateway;
    mockOrientationGateway = TestBed.inject(ORIENTATION_GATEWAY) as unknown as MockOrientationGateway;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a new game', async () => {
    await component.ionViewWillEnter();
    const game = component.game();
    expect(game).toBeTruthy();
    expect(game?.teamA.score).toBe(0);
    expect(game?.teamB.score).toBe(0);
  });

  it('should default to vertical view', async () => {
    await component.ionViewWillEnter();
    expect(component.isHorizontal()).toBe(false);
  });

  it('should switch to horizontal view when preference is saved', async () => {
    await mockDisplayGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ionViewWillEnter();
    expect(component.isHorizontal()).toBe(true);
  });

  it('should add point to team A', async () => {
    await component.ionViewWillEnter();
    await component.addPoint('A');
    const game = component.game();
    expect(game?.teamA.score).toBe(1);
  });

  it('should add point to team B', async () => {
    await component.ionViewWillEnter();
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
    mockGameGateway.setGame(game12);
    await component.ionViewWillEnter();

    await component.addPoint('A');
    const game = component.game();
    expect(game?.teamA.score).toBe(12);
  });

  it('should undo last point', async () => {
    await component.ionViewWillEnter();
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
    mockGameGateway.setGame(game12);
    await component.ionViewWillEnter();

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
    mockGameGateway.setGame(game12);
    await component.ionViewWillEnter();

    expect(component.isTeamDisabled('A')).toBe(true);
    expect(component.isTeamDisabled('B')).toBe(false);
  });

  it('should enable undo when there are actions', async () => {
    await component.ionViewWillEnter();
    expect(component.canUndo()).toBe(false);

    await component.addPoint('A');
    expect(component.canUndo()).toBe(true);
  });

  it('should preserve score when switching view', async () => {
    await component.ionViewWillEnter();
    await component.addPoint('A');
    await component.addPoint('B');
    await component.addPoint('A');

    // Switch to horizontal
    await mockDisplayGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ionViewWillEnter();

    const game = component.game();
    expect(game?.teamA.score).toBe(2);
    expect(game?.teamB.score).toBe(1);
    expect(component.isHorizontal()).toBe(true);
  });

  it('should preserve winner when switching view', async () => {
    const game12: Game = {
      id: 'test',
      teamA: { name: 'Time A', score: 12 },
      teamB: { name: 'Time B', score: 5 },
      actions: [],
      createdAt: Date.now(),
    };
    mockGameGateway.setGame(game12);
    await component.ionViewWillEnter();
    expect(component.winner()).toBe('A');

    // Switch to horizontal
    await mockDisplayGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ionViewWillEnter();

    expect(component.winner()).toBe('A');
    expect(component.isHorizontal()).toBe(true);
  });

  it('should lock orientation to portrait when view is vertical', async () => {
    await component.ionViewWillEnter();
    expect(mockOrientationGateway.lastLock).toBe('portrait');
  });

  it('should lock orientation to landscape when view is horizontal', async () => {
    await mockDisplayGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ionViewWillEnter();
    expect(mockOrientationGateway.lastLock).toBe('landscape');
  });

  it('should switch orientation lock when view changes', async () => {
    await component.ionViewWillEnter();
    expect(mockOrientationGateway.lastLock).toBe('portrait');

    await mockDisplayGateway.saveDisplayPreference({ view: 'horizontal' });
    await component.ionViewWillEnter();
    expect(mockOrientationGateway.lastLock).toBe('landscape');

    await mockDisplayGateway.saveDisplayPreference({ view: 'vertical' });
    await component.ionViewWillEnter();
    expect(mockOrientationGateway.lastLock).toBe('portrait');
  });
});
