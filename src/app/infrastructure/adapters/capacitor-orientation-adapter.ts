import { Injectable } from '@angular/core';
import { OrientationGateway, OrientationLock } from '../../domain/gateways/orientation-gateway';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Injectable({ providedIn: 'root' })
export class CapacitorOrientationAdapter implements OrientationGateway {
  async lock(orientation: OrientationLock): Promise<void> {
    await ScreenOrientation.lock({ orientation });
  }

  async unlock(): Promise<void> {
    await ScreenOrientation.unlock();
  }
}
