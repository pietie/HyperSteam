/// <reference path="../../typings/main.d.ts" />
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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/Rx');
var Util = require('../Util');
var SteamService = (function () {
    function SteamService(http) {
        this.http = http;
    }
    SteamService.GetPlayerSummary = function (steamId) {
        return Util.fetchJson("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + SteamService.STEAM_API_KEY + "&steamids=" + steamId).then(function (r) {
            var playerSummaryResponse = r.response;
            return new Promise(function (resolve, reject) {
                if (playerSummaryResponse.players.length > 0)
                    resolve(playerSummaryResponse.players[0]);
                else
                    reject("Profile not found");
            });
        });
    };
    SteamService.prototype.GetOwnedGames = function (steamId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + SteamService.STEAM_API_KEY + "&steamid=" + steamId + "&format=json&include_appinfo=1&include_played_free_games=1")
                .map(function (res) { return res.json(); })
                .subscribe(function (data) { resolve(data.response.games); }, function (err) { reject(err); }, function () { });
        });
        // return Util.fetchJson(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${SteamService.STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`).then(r=>
        // {
        // 	let ownedGames:OwnedGamesResponse = r.response;
        //     return new Promise<OwnedGame[]>((resolve, reject) => {
        //         if (ownedGames) resolve(ownedGames.games);
        //         else reject("No games found");
        //     });
        // }); 
    };
    SteamService.prototype.downloadBigPictureMetadata = function (appId) {
        //return new Promise<SteamStoreAppDetail>((resolve, reject) => {
        return this.http.get("https://store.steampowered.com/api/appdetails/?appids=" + appId).map(function (res) { return res.json(); });
        /*
        .subscribe(
        data => {
            console.dir(data);
            
            let appData:SteamStoreAppDetail = data[appId];
            
            alert(appData.data.about_the_game);
            //appData.data.movies[0].webm["sadf"]
            
            resolve(data);
        
        },
        err => { reject(err); },
        () => {  }
        );*/
        //}); 
    };
    SteamService.STEAM_API_KEY = "FE7FE7527FEAD4225BE172702C8C71A0";
    SteamService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SteamService);
    return SteamService;
}());
exports.SteamService = SteamService;
