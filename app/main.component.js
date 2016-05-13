/// <reference path="./typings/main.d.ts" />
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
var http_1 = require('@angular/http');
var Util = require('./src/Util');
var mainview_component_1 = require('./src/MainView/mainview.component');
var step1_component_1 = require('./src/UpdateWizard/step1.component');
var project_service_1 = require('./src/Services/project.service');
var steam_service_1 = require('./src/Services/steam.service');
var toolbar_1 = require('@angular2-material/toolbar');
var button_1 = require('@angular2-material/button');
// import * as jetpack from 'fs-jetpack'
var MainComponent = (function () {
    function MainComponent(router, project) {
        this.router = router;
        this.project = project;
        this.showProjectDialog = false;
        this.noProjectsFound = false;
        //this.project.setSteamId("76561197960435530");
        this.router.navigate(["./mainview"], null);
    }
    MainComponent.prototype.onLoadProjectClicked = function () {
        var _this = this;
        try {
            var jetpack = window.jetpack;
            var path_1 = window.path;
            var projectsDir = jetpack.dir('./projects');
            var projectFiles = jetpack.find("./projects", { files: true, matching: "*.json" });
            this.noProjectsFound = !(projectFiles && projectFiles.length > 0);
            this.projectFileList = [];
            projectFiles.forEach(function (filePath) {
                var parsedPath = path_1.parse(filePath);
                _this.projectFileList.push(parsedPath.base);
            });
            this.showProjectDialog = true;
        }
        catch (e) {
            this.showProjectDialog = false;
            alert(e.toString()); // TODO: Handle exception
        }
    };
    MainComponent.prototype.onSaveProjectClicked = function () {
        this.project.save();
        Util.Success("Project saved successfully");
    };
    MainComponent.prototype.loadProject = function (path) {
        this.showProjectDialog = false;
        var projectData = jetpack.read("./projects/" + path, "json");
        this.project.load(projectData);
        Util.Success("Project succesfully loaded");
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            directives: [router_1.ROUTER_DIRECTIVES, toolbar_1.MdToolbar, button_1.MdButton, button_1.MdAnchor],
            providers: [project_service_1.ProjectService, steam_service_1.SteamService, http_1.HTTP_PROVIDERS],
            styleUrls: ['./main.component.css'],
            template: "\n\t\t<div id=\"appheader\">HyperSteam</div>\n\t\t\n\t<md-toolbar color2=\"primary\">\n  \t\t<button md-button color=\"primary\" (click)=\"onSaveProjectClicked()\">Save project</button>\n\t\t  <button md-button color=\"primary\" (click)=\"onLoadProjectClicked()\">Load project</button>\n\t</md-toolbar>\n\t\t\n\t\t<a [routerLink]=\"['/mainview']\">Main view</a>\n\t\t  <a [routerLink]=\"['/updatelibrary']\">Update wizard</a>\n\t\t<div class=\"content\" style=\"padding: 10px;\">\n\t\t\t<router-outlet></router-outlet>\n\t\t</div>\n\n<div id=\"loadProjectDialog\" *ngIf=\"showProjectDialog\">\n\n  <div class=\"dlg\">\n    <h3>Load project</h3>\n    \n\t<div class=\"content\">\n\t\t<p *ngIf=\"noProjectsFound\">\n\t\t\tNo project files found in the ./projects directory.\n\t\t</p>\n\t\t\n\t\t<ul *ngIf=\"!noProjectsFound\">\n\t\t\t<div *ngFor=\"let path of projectFileList\">\n\t\t\t\t<a href=\"javascript:void(0)\" (click)=\"loadProject(path);\">{{ path }}</a>\n\t\t\t</div>\n\t\t</ul>\n\t\n\t</div>\n    \n    <div class=\"cmd\">\n        <button md-button (click)=\"showProjectDialog=false\">Cancel</button>      \n    </div> \n  </div>\n  \n</div>\n\n\t"
        }),
        router_1.Routes([
            { path: '/mainview', component: mainview_component_1.MainViewComponent },
            { path: '/updatelibrary', component: step1_component_1.UpdateWizardStep1Component },
        ]), 
        __metadata('design:paramtypes', [router_1.Router, project_service_1.ProjectService])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
