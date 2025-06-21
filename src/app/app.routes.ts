import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'fullscreen',
    loadComponent: () =>
      import('./pages/fullscreen-map-page/fullscreen-map-page.component').then(
        (m) => m.FullscreenMapPageComponent
      ),
    title: 'Full Screen',
  },
  {
    path: 'markers',
    loadComponent: () =>
      import('./pages/markers-page/markers-page.component').then(
        (m) => m.MarkersPageComponent
      ),
    title: 'Markers',
  },
  {
    path: 'houses',
    loadComponent: () =>
      import('./pages/houses-page/houses-page.component').then(
        (m) => m.HousesPageComponent
      ),
    title: 'Houses',
  },
  {
    path: '**',
    redirectTo: 'fullscreen',
  },
];
