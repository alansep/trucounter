# Main Game

## 1. Context
Trucounter is a truco paulista scorekeeper in early development, built with Ionic 9 + Angular 22 + Capacitor 8. The main app must allow two teams to score points during a truco paulista match, with the screen split vertically and each team occupying half of the screen. The user wants a simple experience: tap to score, button to undo.

## 2. Objective
Create the main game screen with two teams (Team A / Team B), allowing point increments by tapping each team's area, an undo button (undo last point), persistence of the current match + last score, visual (animation) and haptic (vibration) feedback, with the score limited to 12 points (standard truco paulista).

## 3. Technical Details
Simplified Clean Architecture (core → usecases → gateways → adapters → presentation), following the rules in `docs/development-rules.md`. Framework-free domain entities (Game, Team, Action); usecases to add points, undo points, and check the winner; gateway interfaces for persistence and haptic feedback, implemented via localStorage and the Capacitor Haptics API. Reactive state with Angular signals and wiring via dependency injection. Layout split vertically 50/50 (Team A on top, Team B at the bottom), central undo button, short CSS transitions for increments, and the app's own color palette. Target platform: iOS/Android via Capacitor only, portrait orientation.

## 4. Acceptance Criteria
- [ ] Screen split vertically with two visible teams (Team A / Team B)
- [ ] Tapping the top half increments Team A's score
- [ ] Tapping the bottom half increments Team B's score
- [ ] Score goes from 0 to 12 for each team
- [ ] When reaching 12 points, only that team stops receiving points (the other team continues)
- [ ] When reaching 12 points, that team's touch area stops responding
- [ ] When reaching 12 points, a victory message is shown with animation + vibration
- [ ] Central button undoes the last point of either team (add-point actions only)
- [ ] Increment animation when scoring a point
- [ ] Vibration when scoring a point (extensible to turn on/off)
- [ ] State saved in localStorage (current match + last score)
- [ ] On refresh, a new match starts automatically (last score available for reference)
- [ ] Fixed team names (Team A / Team B) — customization in the future
- [ ] Unit + integration + E2E tests written

## 5. Test Scenarios
- Happy path: user taps Team A → score A goes to 1, undo button appears
- Happy path: user taps Team B → score B goes to 1
- Happy path: user reaches 12 points → score stops, touch area disabled, victory message shown
- Happy path: user clicks undo → last point is undone
- Edge case: user clicks undo with no actions → nothing happens
- Edge case: user taps rapidly several times → each tap counts (no debounce)
- Error: localStorage full → app keeps working (no persistence)
- Error: device without vibration support → app keeps working (no vibration)

## 6. Risks
- Vibration may not work on all devices → mitigated with silent fallback
- localStorage may lose data → mitigated with loss-accepting design (new game)
- Animations may cause lag on old devices → mitigated with lightweight CSS transitions (max 200ms)

## 7. Out of Scope
- Statistics screen (to be created in the future)
- Team name customization (future)
- Vibration settings (future)
- Landscape mode
- Accessibility (future)
- Web (browser) support

## 8. Assumptions
- Stack is stable for 6+ months (Angular 22, Ionic 9, Capacitor 8, TypeScript 6)
- Personal project, solo development
- Angular signals is the standard for reactive communication between layers
- Existing code will not be migrated — rules apply to new code
- Truco paulista: maximum of 12 points
- Two teams sitting across from each other (table)
- Vibration is optional and extensible

## Compliance Checklist
- [x] All required sections are present
- [x] Acceptance criteria are verifiable
- [x] Test scenarios cover happy, edge, and error cases
- [x] Risks have mitigations
- [x] Out of scope is explicit
