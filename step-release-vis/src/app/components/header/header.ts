import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../services/themeService';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})

// TODO(#299): Move to new parent component so that timeline
//  choosing and dark mode button are on the same line.
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
