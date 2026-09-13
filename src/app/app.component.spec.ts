import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
  template: '',
  standalone: false,
})
class StubGameComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Declaração direta (em vez de importar o SharedModule) porque o
      // TestBed com Vitest não resolve o componente exportado pelo módulo
      // importado — ver DebugApp vs DebugApp2. O wiring via SharedModule
      // no AppModule real é validado pelo `ng build`.
      declarations: [AppComponent, MenuComponent, StubGameComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([{ path: 'game', component: StubGameComponent }]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    // Arrange + Act
    const fixture = TestBed.createComponent(AppComponent);

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render menu as sibling of the main outlet', async () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    const menu = fixture.nativeElement.querySelector('app-menu');
    expect(menu).toBeTruthy();

    const outlet = fixture.nativeElement.querySelector('ion-router-outlet#main-content');
    expect(outlet).toBeTruthy();
  });

  it('should render menu header and Jogo item linked to /game', async () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert — Stencil remove o textContent do light DOM no jsdom,
    // então verifica via innerHTML (comportamento documentado FW-6264).
    const menu = fixture.nativeElement.querySelector('app-menu') as HTMLElement;
    expect(menu).toBeTruthy();
    expect(menu.innerHTML).toContain('Trucounter');
    expect(menu.innerHTML).toContain('Jogo');

    // Assert — item navega para /game (atributo lowercase no jsdom)
    const item = menu.querySelector('ion-item') as HTMLElement;
    expect(item).toBeTruthy();
    const routerLink = item.getAttribute('routerLink') ?? item.getAttribute('routerlink');
    expect(routerLink).toEqual('/game');
  });

  it('should auto-close the menu via ion-menu-toggle', async () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert — ion-menu-toggle fecha o menu automaticamente após o clique
    const toggle = fixture.nativeElement.querySelector('app-menu ion-menu-toggle');
    expect(toggle).toBeTruthy();
    expect(toggle.querySelector('ion-item')).toBeTruthy();
  });
});
