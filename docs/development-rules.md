# Development Rules

> **This is a living document — expand as the project evolves.**
> **Last reviewed:** 2026-09-07

This document defines the architecture rules, code conventions, and development standards for Trucounter. All AI agents contributing to this project MUST follow these rules.

## Before You Start

Before writing any code for a new feature, validate these three questions:

1. Do the rules in this document cover the type of feature you are building?
2. Do the code rules apply to the current stack (Angular 22, Ionic 9, Capacitor 8, TypeScript 6)?
3. Does the spec template in `specs/` fit the feature's scope?

If any answer is "no", stop and ask for clarification before proceeding.

---

## Table of Contents

- [Code Rules](#code-rules)
- [Structure Rules](#structure-rules)
- [Naming Conventions](#naming-conventions)
- [Documentation Rules](#documentation-rules)
- [Test Rules](#test-rules)
- [Clean Architecture](#clean-architecture)
- [Spec Template](#spec-template)

---

## Code Rules

### Typing

**DO:** Always use explicit types. Never use `any`.

```typescript
// ✅ Do this
function calculateScore(cards: Card[]): number {
  return cards.length;
}

// ❌ Don't do this
function calculateScore(cards: any[]): any {
  return cards.length;
}
```

**DO:** Prefer `interface` over `type` for object shapes.

```typescript
// ✅ Do this
interface Player {
  name: string;
  score: number;
}

// ❌ Don't do this
type Player = {
  name: string;
  score: number;
};
```

**DO:** Use `unknown` instead of `any` when the type is truly uncertain.

```typescript
// ✅ Do this
function parseInput(input: unknown): string {
  return String(input);
}

// ❌ Don't do this
function parseInput(input: any): string {
  return String(input);
}
```

### Methods and Functions

**DO:** Keep methods short and focused. One method = one responsibility.

```typescript
// ✅ Do this
function getActivePlayers(players: Player[]): Player[] {
  return players.filter(p => p.isActive);
}

function calculateWinner(players: Player[]): Player {
  return players.reduce((a, b) => a.score > b.score ? a : b);
}

// ❌ Don't do this
function processPlayers(players: Player[]): Player {
  const active = players.filter(p => p.isActive);
  const winner = active.reduce((a, b) => a.score > b.score ? a : b);
  // ... 50 more lines of logic
  return winner;
}
```

**DO:** Maximum 20 lines per method. If longer, split into smaller methods.

**DO:** Use descriptive names. Avoid abbreviations.

```typescript
// ✅ Do this
function calculateTotalScore(cards: Card[]): number { ... }

// ❌ Don't do this
function calc(c: Card[]): number { ... }
```

### SOLID Principles

**DO:** Follow SOLID principles.

- **S**ingle Responsibility: Each class/method does one thing.
- **O**pen/Closed: Extend behavior through composition, not modification.
- **L**iskov Substitution: Subtypes must be substitutable for their base types.
- **I**nterface Segregation: Prefer small, specific interfaces.
- **D**ependency Inversion: Depend on abstractions, not concretions.

```typescript
// ✅ Do this — Single Responsibility
class ScoreTracker {
  addPoint(playerId: string): void { ... }
}

class ScorePresenter {
  formatScore(score: number): string { ... }
}

// ❌ Don't do this — multiple responsibilities
class ScoreManager {
  addPoint(playerId: string): void { ... }
  formatScore(score: number): string { ... }
  saveToDatabase(): void { ... }
  sendNotification(): void { ... }
}
```

### Angular Specific

**DO:** Use NgModules (not standalone components). This is enforced by ESLint.

```typescript
// ✅ Do this
@NgModule({
  declarations: [ScorePage],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ScorePageModule {}

// ❌ Don't do this
@Component({
  standalone: true,
  ...
})
export class ScoreComponent {}
```

**DO:** Lazy-load all feature modules via the router.

```typescript
// ✅ Do this
{
  path: 'score',
  loadChildren: () => import('./score/score.module').then(m => m.ScorePageModule)
}
```

**DO:** Use Angular signals for reactive state when appropriate.

```typescript
// ✅ Do this
protected readonly score = signal(0);

// ❌ Don't do this
score = 0;
```

### TypeScript Strict Mode

The project has strict mode enabled. All of these are enforced:

- `noImplicitAny` — no implicit `any` types
- `noImplicitOverride` — must use `override` keyword
- `noPropertyAccessFromIndexSignature` — must use bracket notation for dynamic keys
- `noImplicitReturns` — all code paths must return
- `noFallthroughCasesInSwitch` — no fallthrough in switch cases

---

## Structure Rules

### Folder Organization

```
src/
  app/
    {feature-name}/          # One folder per feature
      {feature-name}.module.ts
      {feature-name}-routing.module.ts
      {feature-name}.page.ts
      {feature-name}.page.html
      {feature-name}.page.scss
      {feature-name}.page.spec.ts
  assets/                    # Static assets
  environments/              # Environment configs
  theme/                     # Global SCSS variables
```

**DO:** One feature = one folder under `src/app/`.

**DO:** Keep all source code under `src/`. Never create files outside `src/` except for configuration.

**DO:** Shared components go in `src/app/shared/` (create if needed).

### File Naming

**DO:** Use kebab-case for all file names.

```
✅ score-page.ts
✅ score-page.module.ts
✅ score-tracking.service.ts

❌ ScorePage.ts
❌ score_page.ts
❌ scoreTracking.service.ts
```

---

## Naming Conventions

### Components and Pages

**DO:** Suffix component classes with `Page` or `Component`.

```typescript
// ✅ Do this
export class ScorePage { ... }
export class ScoreButtonComponent { ... }

// ❌ Don't do this
export class Score { ... }
export class ScoreWidget { ... }
```

**DO:** Use `app-` prefix with kebab-case for component selectors.

```typescript
// ✅ Do this
@Component({ selector: 'app-score-display' })

// ❌ Don't do this
@Component({ selector: 'scoreDisplay' })
@Component({ selector: 'score_display' })
```

### Directives

**DO:** Use `app` prefix with camelCase for directive selectors.

```typescript
// ✅ Do this
@Directive({ selector: '[appHighlight]' })

// ❌ Don't do this
@Directive({ selector: '[highlight]' })
```

### Services

**DO:** suffix service classes with `Service`.

```typescript
// ✅ Do this
export class ScoreService { ... }

// ❌ Don't do this
export class Score { ... }
export class ScoreManager { ... }
```

### Variables and Functions

**DO:** Use camelCase for variables and functions.

```typescript
// ✅ Do this
const playerScore = 0;
function calculateTotal() { ... }

// ❌ Don't do this
const player_score = 0;
function calculate_total() { ... }
```

**DO:** Use descriptive boolean names with `is`, `has`, `should`, `can`.

```typescript
// ✅ Do this
const isActive = true;
const hasCards = false;

// ❌ Don't do this
const active = true;
const cards = false;
```

---

## Documentation Rules

### Feature Specs

Every new feature MUST have a spec file before implementation begins.

**Location:** `specs/{001-feature-name}/spec.md`

**Naming:** Use 3-digit numeric prefix (001, 002, 003...) for ordering.

**Required Sections:**

1. **Context** — Why this feature exists. What problem it solves.
2. **Objective** — What the feature does. Clear, measurable goal.
3. **Technical Details** — High-level approach. No code snippets.
4. **Acceptance Criteria** — Checklist of verifiable conditions.
5. **Test Scenarios** — Happy path, edge cases, error cases.
6. **Risks** — What could go wrong and how to mitigate.
7. **Out of Scope** — What this feature explicitly does NOT cover.
8. **Assumptions** — What we assume to be true.

### Compliance Checklist

Every spec MUST include this checklist at the bottom:

```markdown
## Compliance Checklist
- [ ] All required sections are present
- [ ] Acceptance criteria are verifiable
- [ ] Test scenarios cover happy, edge, and error cases
- [ ] Risks have mitigations
- [ ] Out of scope is explicit
```

### In-Code Documentation

**DO:** Add JSDoc comments to public methods.

```typescript
/**
 * Calculates the total score for a player based on their cards.
 * @param cards - The cards played by the player
 * @returns The total score
 */
function calculateScore(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.value, 0);
}
```

**DO:** Add comments for complex logic. Don't comment obvious code.

```typescript
// ✅ Do this
// Truco rules: if both players play the same value, the winner is determined by suit
if (player1.card.value === player2.card.value) {
  return compareSuits(player1.card.suit, player2.card.suit);
}

// ❌ Don't do this
// Increment score by 1
score += 1;
```

---

## Test Rules

### General

**DO:** Write unit tests for EVERY feature. No exceptions.

**DO:** Test file must be co-located with the feature file.

```
src/app/score/
  score.page.ts
  score.page.spec.ts    ← Test file
```

**DO:** Use Vitest (configured in `angular.json`).

**DO:** Run `ng test` before committing.

### Test Structure

**DO:** Follow the Arrange-Act-Assert pattern.

```typescript
describe('ScoreService', () => {
  it('should calculate total score correctly', () => {
    // Arrange
    const cards = [{ value: 1 }, { value: 2 }, { value: 3 }];

    // Act
    const result = calculateScore(cards);

    // Assert
    expect(result).toBe(6);
  });
});
```

**DO:** Test edge cases and error cases, not just happy path.

```typescript
// ✅ Do this
describe('calculateScore', () => {
  it('should return 0 for empty array', () => {
    expect(calculateScore([])).toBe(0);
  });

  it('should handle negative values', () => {
    expect(calculateScore([{ value: -1 }])).toBe(-1);
  });

  it('should throw for null input', () => {
    expect(() => calculateScore(null)).toThrow();
  });
});
```

### Coverage

**DO:** Aim for 80%+ code coverage on business logic.

**DO:** 100% coverage on critical paths (scoring, game state).

---

## Clean Architecture

This project follows a **Simplified Clean Architecture** pattern to ensure clear separation of concerns, testability, and maintainable code.

### Layers

```
src/app/
  core/                    # Domain entities, value objects, business rules
  domain/
    usecases/              # Application logic, orchestration
    gateways/              # Interfaces for external communication
  infrastructure/
    adapters/              # Implementations of gateways (API, storage, etc.)
  presentation/
    shared/                # Shared Angular components
  {feature}/               # Feature-specific components and pages
```

#### Layer Responsibilities

| Layer | Location | Dependencies | Responsibility |
|-------|----------|--------------|----------------|
| **Core** | `src/app/core/` | None (zero dependencies) | Domain entities, value objects, business rules, gateway interfaces |
| **Domain/Usecases** | `src/app/domain/usecases/` | Core only | Application logic, orchestration, use case implementations |
| **Domain/Gateways** | `src/app/domain/gateways/` | Core only | Interfaces defining how external systems communicate |
| **Infrastructure/Adapters** | `src/app/infrastructure/adapters/` | Core | Implementations of gateways (API clients, storage, etc.) |
| **Presentation** | `src/app/presentation/shared/` + `src/app/{feature}/` | Domain, Infrastructure | Angular components, pages, UI logic |

### Dependency Rule

Dependencies ALWAYS point inward toward the core. Never the reverse.

```
Presentation → Domain (Usecases) → Core
Presentation → Infrastructure (Adapters) → Core
Usecases → Core
Adapters → Core
```

**DO:** Core is a plain TypeScript folder with zero framework dependencies.

```typescript
// ✅ Do this — core/entity/player.ts
export interface Player {
  id: string;
  name: string;
  score: number;
}
```

**DON'T:** Never import Angular, Ionic, or any framework module in core.

```typescript
// ❌ Don't do this — core/entity/player.ts
import { signal } from '@angular/core';

export interface Player {
  id: string;
  name: string;
  score: signal<number>;  // Angular dependency in core!
}
```

**DO:** Gateway interfaces live in core (domain/gateways/).

```typescript
// ✅ Do this — domain/gateways/score-gateway.ts
import { Player } from '../../core/entity/player';

export interface ScoreGateway {
  getPlayers(): Promise<Player[]>;
  updateScore(playerId: string, score: number): Promise<void>;
}
```

**DO:** Adapters implement gateways and live in infrastructure.

```typescript
// ✅ Do this — infrastructure/adapters/api-score-gateway.ts
import { Player } from '../../core/entity/player';
import { ScoreGateway } from '../../domain/gateways/score-gateway';

export class ApiScoreGateway implements ScoreGateway {
  async getPlayers(): Promise<Player[]> {
    return fetch('/api/players').then(r => r.json());
  }

  async updateScore(playerId: string, score: number): Promise<void> {
    await fetch(`/api/players/${playerId}/score`, {
      method: 'PATCH',
      body: JSON.stringify({ score }),
    });
  }
}
```

### Communication Pattern

Data flows unidirectionally: **Presentation → Usecases → Gateways → Adapters → External World**

**DO:** Use Angular signals for reactive state in presentation.

```typescript
// ✅ Do this — presentation/score-page.ts
export class ScorePage {
  private readonly scoreUsecase = inject(ScoreUsecase);
  protected readonly players = signal<Player[]>([]);

  async loadPlayers(): Promise<void> {
    const players = await this.scoreUsecase.getActivePlayers();
    this.players.set(players);
  }
}
```

**DO:** Use dependency injection for wiring.

```typescript
// ✅ Do this — score.module.ts
@NgModule({
  providers: [
    { provide: ScoreGateway, useClass: ApiScoreGateway },
    ScoreUsecase,
  ],
})
export class ScorePageModule {}
```

### Lightweight Variant

For simple features (CRUD operations only, no multi-step business logic, no external API calls), usecases and gateway implementations can be merged into a single service.

**When to use:**
- Simple CRUD (Create, Read, Update, Delete)
- No multi-step business logic
- No external API calls (or single API endpoint)

**When NOT to use:**
- Multiple steps or business rules
- External API integration
- Complex data transformations

```typescript
// ✅ Lightweight variant — feature/score-simple.service.ts
// Gateway interface still in core, but implementation merged with usecase
import { Player } from '../../core/entity/player';

@Injectable({ providedIn: 'root' })
export class ScoreSimpleService {
  private readonly api = inject(HttpClient);

  async getPlayers(): Promise<Player[]> {
    return this.api.get<Player[]>('/api/players').toPromise();
  }

  async addPoint(playerId: string): Promise<void> {
    const players = await this.getPlayers();
    const player = players.find(p => p.id === playerId);
    if (player) {
      await this.api.patch(`/api/players/${playerId}`, {
        score: player.score + 1,
      }).toPromise();
    }
  }
}
```

### Anti-Patterns

These are common mistakes. Avoid them.

**1. Importing Angular modules in core**

```typescript
// ❌ Don't do this
// core/entity/score.ts
import { signal } from '@angular/core';

export class Score {
  value = signal(0);
}
```

```typescript
// ✅ Do this
// core/entity/score.ts
export class Score {
  value = 0;
}
```

**2. Putting HTTP calls directly in components**

```typescript
// ❌ Don't do this
// presentation/score.page.ts
export class ScorePage {
  async loadPlayers() {
    const response = await fetch('/api/players');
    this.players = await response.json();
  }
}
```

```typescript
// ✅ Do this
// presentation/score.page.ts
export class ScorePage {
  private readonly scoreUsecase = inject(ScoreUsecase);

  async loadPlayers() {
    const players = await this.scoreUsecase.getActivePlayers();
    this.players.set(players);
  }
}
```

**3. Putting business logic in components**

```typescript
// ❌ Don't do this
// presentation/score.page.ts
export class ScorePage {
  calculateWinner(players: Player[]): Player {
    return players.reduce((a, b) => a.score > b.score ? a : b);
  }
}
```

```typescript
// ✅ Do this
// domain/usecases/score-usecase.ts
export class ScoreUsecase {
  calculateWinner(players: Player[]): Player {
    return players.reduce((a, b) => a.score > b.score ? a : b);
  }
}
```

**4. Making core depend on infrastructure**

```typescript
// ❌ Don't do this
// core/entity/player.ts
import { ApiPlayerService } from '../../infrastructure/api-player-service';

export class Player {
  constructor(private api: ApiPlayerService) {}
}
```

```typescript
// ✅ Do this
// core/entity/player.ts
export interface Player {
  id: string;
  name: string;
  score: number;
}
```

### Feature Example: Score Tracking

Here's how a complete feature is structured across all layers:

```
src/app/
  core/
    entity/
      player.ts                    # Player interface
      card.ts                      # Card interface
  domain/
    usecases/
      score-usecase.ts             # Score calculation logic
      game-usecase.ts              # Game flow orchestration
    gateways/
      score-gateway.ts             # ScoreGateway interface
      game-gateway.ts              # GameGateway interface
  infrastructure/
    adapters/
      api-score-gateway.ts         # HTTP implementation of ScoreGateway
      local-game-gateway.ts        # Local storage implementation
  presentation/
    shared/
      score-display/               # Shared score display component
  score/
    score.module.ts                # Feature module with DI
    score-routing.module.ts        # Lazy-loaded routing
    score.page.ts                  # Main page component
    score.page.html                # Template
    score.page.scss                # Styles
    score.page.spec.ts             # Tests
```

### Clean Architecture Checklist

Before implementing any feature, verify:

- [ ] Core entities have zero framework dependencies (no Angular, no Ionic)
- [ ] Gateway interfaces live in `domain/gateways/`, implementations in `infrastructure/adapters/`
- [ ] Usecases depend only on core (entities + gateway interfaces)
- [ ] Presentation depends on usecases and adapters, never on core directly
- [ ] Dependency injection wires adapters to gateway interfaces
- [ ] Business logic is in usecases, not in components
- [ ] HTTP/fetch calls are in adapters, not in components
- [ ] Lightweight variant used only for simple CRUD (no complex logic)

---

## Spec Template

Use this template when creating a new feature spec:

```markdown
# {Feature Name}

## 1. Context
{Why this feature exists. What problem it solves.}

## 2. Objective
{What the feature does. Clear, measurable goal.}

## 3. Technical Details
{High-level approach. No code snippets. What technologies/patterns are used.}

## 4. Acceptance Criteria
- [ ] {Verifiable condition 1}
- [ ] {Verifiable condition 2}
- [ ] {Verifiable condition 3}

## 5. Test Scenarios
- Happy path: {description}
- Edge case: {description}
- Error: {description}

## 6. Risks
- {Risk 1}: {mitigation}
- {Risk 2}: {mitigation}

## 7. Out of Scope
- {What this feature does NOT cover}

## 8. Assumptions
- {Assumption 1}
- {Assumption 2}

## Compliance Checklist
- [ ] All required sections are present
- [ ] Acceptance criteria are verifiable
- [ ] Test scenarios cover happy, edge, and error cases
- [ ] Risks have mitigations
- [ ] Out of scope is explicit
```

---

*This document is reviewed before every new feature. If any rule is outdated or incomplete, update it before proceeding.*
