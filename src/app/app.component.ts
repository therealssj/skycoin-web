import { Component, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';

import { config } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  current: number;
  highest: number;
  otcEnabled: boolean;
  version: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  isElectron: boolean;

  constructor(
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.otcEnabled = config.otcEnabled;
    this.appStoreUrl = config.appStoreUrl;
    this.googlePlayUrl = config.googlePlayUrl;
    this.isElectron = window['isElectron'];
    this.languageService.loadLanguageSettings();
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }
}
