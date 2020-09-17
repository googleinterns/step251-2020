/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // if theme is true, then the dark mode is on
  theme: boolean;
  readonly BLACK_BACKGROUND = '#121212';

  constructor() {
    this.getTheme();
  }

  getTheme(): void {
    if (window.localStorage.getItem('theme') === 'black') {
      this.theme = true;
    } else {
      this.theme = false;
    }
  }

  setSVGText(): void {
    const svgs = document.getElementsByTagName('text');
    Array.from(svgs).forEach(element => {
      if (this.theme) {
        element.style.fill = 'white';
      } else {
        element.style.fill = 'black';
      }
    });
  }

  setTheme(): void {
    if (this.theme) {
      document.body.style.backgroundColor = this.BLACK_BACKGROUND;
      document.body.style.color = 'white';
      window.localStorage.setItem('theme', 'black');
      this.setSVGText();
    } else {
      document.body.style.backgroundColor = 'white';
      window.localStorage.setItem('theme', 'white');
      document.body.style.color = 'black';
      this.setSVGText();
    }
  }
}
