

import { bootstrap  }    from '@angular/platform-browser-dynamic';
import { bind, provide }    from '@angular/core';
import { HashLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';
import { MainComponent } from './main.component';
import { ROUTER_PROVIDERS } from '@angular/router';

bootstrap(MainComponent,  [provide(APP_BASE_HREF, { useValue: '/mainview' }),ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
 