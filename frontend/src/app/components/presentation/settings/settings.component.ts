import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  settings = {
    deleteModeEnabled: false,
  };

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.load();
  }

  onToggleChange() {
    // console.log('Switch is now: ', this.settings.deleteModeEnabled);
    this.settingsService.saveSettings({ deleteModeEnabled: this.settings.deleteModeEnabled });
  }

  load() {
    const storedSettings = this.settingsService.getSettings();
    if (storedSettings) {
      this.settings = storedSettings;
      // console.log('Loaded settings:', this.settings);
    }
  }

}
