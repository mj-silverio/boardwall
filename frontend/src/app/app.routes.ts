import { Routes } from '@angular/router';
import { MainMenuComponent } from './components/presentation/main-menu/main-menu.component';
import { CanvasEditorComponent } from './components/presentation/canvas-editor/canvas-editor.component';
import { SettingsComponent } from './components/presentation/settings/settings.component';
import { ImportExportComponent } from './utils/import-export/import-export.component';
import { NotFoundComponent } from './components/presentation/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainMenuComponent },
    { path: 'canvas-editor', component: CanvasEditorComponent },

    { path: 'settings', component: SettingsComponent },
    { path: 'import-export', component: ImportExportComponent },

    { path: '**', component: NotFoundComponent }
];
