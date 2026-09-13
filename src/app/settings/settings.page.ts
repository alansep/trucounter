import { Component, inject, signal, OnInit } from '@angular/core';
import { DisplayView } from '../core/entity/display-preference';
import { DisplayPreferenceUsecase } from '../domain/usecases/display-preference-usecase';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  private readonly displayPreferenceUsecase = inject(DisplayPreferenceUsecase);

  readonly isHorizontal = signal(false);

  async ngOnInit(): Promise<void> {
    const view = await this.displayPreferenceUsecase.getView();
    this.isHorizontal.set(view === 'horizontal');
  }

  async onToggleChanged(event: CustomEvent): Promise<void> {
    const checked: boolean = event.detail.checked;
    this.isHorizontal.set(checked);
    const view: DisplayView = checked ? 'horizontal' : 'vertical';
    await this.displayPreferenceUsecase.setView(view);
  }
}
