import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected title = 'maps-app';

  theme = linkedSignal(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (isDarkMode) {
      return 'dark';
    }
    return 'light';
  });

  themeEffect = effect(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    console.log(isDarkMode);

    if (this.theme() === 'dark') {
      console.log('Dark mode is enabled');
      document.documentElement.setAttribute('data-theme', 'forest');
    } else {
      console.log('Dark mode is disabled');
      document.documentElement.setAttribute('data-theme', 'cupcake');
    }
  });

  darkTheme() {
    this.theme.set('dark');
  }

  lightTheme() {
    this.theme.set('light');
  }
}
