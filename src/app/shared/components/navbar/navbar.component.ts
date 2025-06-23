import {
  ChangeDetectionStrategy,
  Component,
  effect,
  linkedSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  theme = linkedSignal(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (isDarkMode) return 'dark';

    return 'light';
  });

  themeEffect = effect(() => {
    if (this.theme() === 'dark')
      document.documentElement.setAttribute('data-theme', 'forest');
    else document.documentElement.setAttribute('data-theme', 'cupcake');
  });

  darkTheme() {
    this.theme.set('dark');
    const data = environment.mapsApp;
  }

  lightTheme() {
    this.theme.set('light');
  }

  routes = routes
    .map((route) => {
      return {
        route: route.path,
        title: ` ${route.title}`,
      };
    })
    .filter((map) => map.route !== '**'); // Exclude the redirect route
}
