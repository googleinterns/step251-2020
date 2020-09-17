/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../services/themeService';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.setTheme();
  }

  onToggle(): void {
    this.themeService.theme = !this.themeService.theme;
    this.themeService.setTheme();
  }

  getCheck(): boolean {
    return this.themeService.theme;
  }
}
