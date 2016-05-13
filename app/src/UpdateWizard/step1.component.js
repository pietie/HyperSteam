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
var progress_bar_1 = require('@angular2-material/progress-bar');
var progress_circle_1 = require('@angular2-material/progress-circle');
var list_1 = require('@angular2-material/list');
var project_service_1 = require('../Services/project.service');
var steam_service_1 = require('../Services/steam.service');
var angular_pipes_1 = require('angular-pipes');
var Util = require('../Util');
var UpdateWizardStep1Component = (function () {
    function UpdateWizardStep1Component(project, steam) {
        this.project = project;
        this.steam = steam;
        this.isLoading = false;
        try {
            // !this.fetchOwnedGames();
            steam.GetBigPictureData("362410");
        }
        catch (e) {
            alert(e.toString());
        }
    }
    UpdateWizardStep1Component.prototype.fetchOwnedGames = function () {
        var _this = this;
        this.isLoading = true;
        // TODO: Handle case where SteamId is not set?
        this.steam.GetOwnedGames(this.project.SteamProfileId).then(function (r) {
            _this.isLoading = false;
            _this.gameList = r;
            // TODO: Update existing list, determine # of new items and of updates --> include custom app ids in here?
            Util.Info("Owned games: " + r.length);
        }).catch(function (e) { _this.isLoading = false; alert(e.toString()); });
    };
    UpdateWizardStep1Component.prototype.getGameAvatarUrl = function (game) {
        if (!game.img_icon_url || game.img_icon_url == "")
            return './images/steamdefprofile.jpg';
        return "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_icon_url + ".jpg";
    };
    UpdateWizardStep1Component.prototype.onGameSelected = function (game) {
        alert(game.name);
    };
    UpdateWizardStep1Component = __decorate([
        core_1.Component({
            selector: 'step1',
            directives: [progress_bar_1.MdProgressBar, progress_circle_1.MdSpinner, progress_circle_1.MdProgressCircle, list_1.MdList, list_1.MdListAvatar, list_1.MdListItem],
            pipes: [angular_pipes_1.NG2_PIPES],
            templateUrl: "./src/UpdateWizard/step1.component.html",
            styles: [
                "\n            .gameList\n            {\n                cursor: pointer;                \n            }\n            \n            * /deep/ md-list-item::shadow div.md-list-item:hover {\n                 background-color: #5EABFF;\n                -webkit-transition: all 0.15s ease-in-out;\n                -moz-transition: all 0.15s ease-in-out;\n                -o-transition: all 0.15s ease-in-out;\n                transition: all 0.15s ease-in-out;\n            }\n            \n             * /deep/ md-list-item::shadow div.md-list-item:hover img {\n                transition: scale 1.5s ease-in-out;\n                transform: scale(1.5); \n              \n             } \n             \n               * /deep/ md-list-item::shadow > h3\n                {\n                    font-weight: bold;\n                }\n         \n       \n        "
            ]
        }), 
        __metadata('design:paramtypes', [project_service_1.ProjectService, steam_service_1.SteamService])
    ], UpdateWizardStep1Component);
    return UpdateWizardStep1Component;
}());
exports.UpdateWizardStep1Component = UpdateWizardStep1Component;
