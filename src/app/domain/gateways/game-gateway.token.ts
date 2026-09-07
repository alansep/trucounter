import { InjectionToken } from '@angular/core';
import { GameGateway } from './game-gateway';

export const GAME_GATEWAY = new InjectionToken<GameGateway>('GameGateway');
