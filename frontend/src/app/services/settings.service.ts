import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'app_settings';

  saveSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  getSettings(): any | null {
    const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
    return storedSettings ? JSON.parse(storedSettings) : null;
  }

  clearSettings(): void {
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}