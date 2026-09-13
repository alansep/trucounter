import { Component } from '@angular/core';

/**
 * Menu lateral base do Trucounter.
 *
 * Abre por gesto de arrastar da borda esquerda (swipeGesture),
 * fecha ao tocar fora (comportamento padrão do ion-menu).
 * Estrutura extensível: novos itens/seções entram como
 * novos `<ion-item>` dentro do `<ion-list>` existente.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent {}
