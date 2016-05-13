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
var router_1 = require('@angular/router');
var input_1 = require('@angular2-material/input');
var progress_circle_1 = require('@angular2-material/progress-circle');
var card_1 = require('@angular2-material/card');
var list_1 = require('@angular2-material/list');
var progress_bar_1 = require('@angular2-material/progress-bar');
var project_service_1 = require('../Services/project.service');
var steam_service_1 = require('../Services/steam.service');
var Util = require('../Util');
var angular_pipes_1 = require('angular-pipes');
var MainViewComponent = (function () {
    function MainViewComponent(project, steam, router) {
        this.project = project;
        this.steam = steam;
        this.router = router;
        this.isUpdatingLibrary = false;
        //private gameList:OwnedGame[];
        this.isAvatarLoading = false;
        //? this.reloadAvatarUrl(); // TODO: Take out once this is capture in the project settings
    }
    MainViewComponent.prototype.reloadAvatarUrl = function () {
        var _this = this;
        this.isAvatarLoading = true;
        // TODO: move to steamId update?
        steam_service_1.SteamService.GetPlayerSummary(this.project.SteamProfileId).then(function (r) {
            _this.project.steamPerson = r.realname ? r.realname : r.personaname;
            _this.project.steamAvatarUrl = r.avatarfull;
            _this.isAvatarLoading = false;
        }).catch(function (r) { alert(r); _this.project.steamAvatarUrl = null; _this.project.steamPerson = null; _this.isAvatarLoading = false; });
    };
    MainViewComponent.prototype.onUpdateLibraryClicked = function () {
        //this.router.navigate(['./updatelibrary'], null);
        this.fetchOwnedGames();
    };
    MainViewComponent.prototype.onSteamIdChanged = function () {
        this.reloadAvatarUrl();
    };
    MainViewComponent.prototype.fetchOwnedGames = function () {
        var _this = this;
        this.isUpdatingLibrary = true;
        // TODO: Handle case where SteamId is not set?
        this.steam.GetOwnedGames(this.project.SteamProfileId).then(function (ownedGames) {
            _this.isUpdatingLibrary = false;
            //this.gameList = r;
            var numberOfUpdates = 0;
            var numberOfAdds = 0;
            ownedGames.forEach(function (g) {
                var ret = _this.project.addUpdateEntry(g);
                if (ret.updated)
                    numberOfUpdates++;
                else if (ret.added)
                    numberOfAdds++;
            });
            if (numberOfAdds > 0 && numberOfUpdates > 0)
                Util.Info(numberOfAdds + " new item(s) added, " + numberOfUpdates + " updated");
            else if (numberOfAdds > 0)
                Util.Info(numberOfAdds + " new item(s) added");
            else if (numberOfUpdates > 0)
                Util.Info(numberOfUpdates + " item(s) updated");
            else
                Util.Info("No items found. Please check your Steam Profile Id.");
            //
            // TODO: Update existing list, determine # of new items and of updates --> include custom app ids in here?
            //Util.Info(`Owned games: ${ownedGames.length}`);
        }).catch(function (e) { _this.isUpdatingLibrary = false; alert(e.toString()); });
    };
    MainViewComponent.prototype.getGameAvatarUrl = function (game) {
        if (!game.img_icon_url || game.img_icon_url == "")
            return './images/steamdefprofile.jpg';
        return "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_icon_url + ".jpg";
    };
    MainViewComponent.prototype.onGameSelected = function (game) {
        alert(game.name);
    };
    MainViewComponent = __decorate([
        core_1.Component({
            selector: 'mainview',
            templateUrl: "./src/MainView/mainview.component.html",
            directives: [input_1.MdInput, input_1.MdHint, input_1.MdPlaceholder, card_1.MdCard, card_1.MdCardHeader, card_1.MdCardTitleGroup, progress_circle_1.MdSpinner, list_1.MdList, list_1.MdListAvatar, list_1.MdListItem, progress_bar_1.MdProgressBar],
            pipes: [angular_pipes_1.NG2_PIPES],
            styleUrls: ['./src/MainView/mainview.component.css']
        }), 
        __metadata('design:paramtypes', [project_service_1.ProjectService, steam_service_1.SteamService, router_1.Router])
    ], MainViewComponent);
    return MainViewComponent;
}());
exports.MainViewComponent = MainViewComponent;
