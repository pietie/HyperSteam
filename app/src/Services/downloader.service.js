"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../../typings/main.d.ts" />
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var steam_service_1 = require('./steam.service');
require('rxjs/Rx');
/*
    This service keeps track of all current and queued downloads.
         Donwnloads include:
            * Big Picture metadata
            * Header images
            * Background images
            * SteamDB info
            * Videos

*/
var DownloaderService = (function () {
    // TODO: Max number of downloads at a time?
    function DownloaderService(http, steam) {
        this.http = http;
        this.steam = steam;
    }
    DownloaderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, steam_service_1.SteamService])
    ], DownloaderService);
    return DownloaderService;
}());
exports.DownloaderService = DownloaderService;
