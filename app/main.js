"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var main_component_1 = require('./main.component');
var router_1 = require('@angular/router');
platform_browser_dynamic_1.bootstrap(main_component_1.MainComponent, [core_1.provide(common_1.APP_BASE_HREF, { useValue: '/mainview' }), router_1.ROUTER_PROVIDERS, core_1.provide(common_1.LocationStrategy, { useClass: common_1.HashLocationStrategy })]);
