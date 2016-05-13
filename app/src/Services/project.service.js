/// <reference path="../../all.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var SteamAPI_1 = require('../ObjectModel/SteamAPI');
var downloader_service_1 = require('./downloader.service');
var ProjectService = (function () {
    function ProjectService(downloader) {
        this.downloader = downloader;
    }
    Object.defineProperty(ProjectService.prototype, "SteamProfileId", {
        get: function () {
            return this.steamProfileId;
        },
        set: function (v) {
            this.steamProfileId = v;
        },
        enumerable: true,
        configurable: true
    });
    ProjectService.prototype.load = function (from) {
        this.steamProfileId = from.steamProfileId;
        this.steamPerson = from.steamPerson;
        this.steamAvatarUrl = from.steamAvatarUrl;
        this.entries = from.entries;
        this.Name = from.Name;
    };
    ProjectService.prototype.save = function () {
        try {
            var jetpack = window.jetpack;
            var data = JSON.stringify(this);
            var dst = jetpack.dir('./projects', { empty: false });
            dst.write('test.json', data);
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
        }
    };
    ProjectService.prototype.setSteamId = function (steamProfileId) {
        // TODO: Add some validation ?
        this.steamProfileId = steamProfileId;
    };
    ProjectService.prototype.addUpdateEntry = function (game) {
        if (this.entries == null)
            this.entries = [];
        var existing = this.entries.find(function (e) { return e.appid == game.appid; });
        if (existing != null) {
            console.dir(existing);
            existing.initFrom(game);
            return { updated: true };
        }
        else {
            var newEntry = new ProjectGameEntry();
            newEntry.initFrom(game);
            this.entries.push(newEntry);
            newEntry.queueMetadataForDownload(this.downloader);
            return { added: true };
        }
    };
    ProjectService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [downloader_service_1.DownloaderService])
    ], ProjectService);
    return ProjectService;
}());
exports.ProjectService = ProjectService;
var ProjectGameEntry = (function (_super) {
    __extends(ProjectGameEntry, _super);
    function ProjectGameEntry() {
        _super.apply(this, arguments);
    }
    ProjectGameEntry.prototype.initFrom = function (copy) {
        this.appid = copy.appid;
        this.img_icon_url = copy.img_icon_url;
        this.img_logo_url = copy.img_logo_url;
        this.name = copy.name;
        this.playtime_forever = copy.playtime_forever;
    };
    ProjectGameEntry.prototype.queueMetadataForDownload = function (downloader) {
        var info = window.jetpack.inspect("./projects/cache/" + this.appid + "/bp.json");
        if (info & info.size > 0) {
            return;
        }
        var request = new downloader_service_1.DownloadRequest();
        request.appId = this.appid;
        request.type = downloader_service_1.DownloadRequestType.Metadata;
        downloader.queueRequest(request);
    };
    ProjectGameEntry.prototype.ValidateDownloadedItems = function () {
        /***
                if (this.HasBeenValidated) return;
        
                this.IsComplete = false;
                this.HasBeenValidated = true;
        
                var cachePath = Util.CachePath(this.SteamAppId);
        
                var bpJsonPath = Path.Combine(cachePath, "bp.json");
        
                this.IsBPMetadataDownloaded = this.IsHeaderImageDownloaded = this.IsBackgroundImageDownloaded = this.IsSteamDbMetadataDownloaded = false;
        
                this.IsBPMetadataDownloaded = File.Exists(bpJsonPath) && new FileInfo(bpJsonPath).Length > 0;
        
                if (this.IsBPMetadataDownloaded) {
                    try {
                        var bpJson = File.ReadAllText(bpJsonPath);
                        var bigPictureData = JsonConvert.DeserializeObject<SteamStoreAppDetail>(bpJson);
        
                        bool hasAtLeastOneVideoDownloaded = false;
        
                        if (bigPictureData.success) {
        
                            var headerPath = Path.Combine(cachePath, new System.IO.FileInfo(new Uri(bigPictureData.data.header_image).LocalPath).Name);
                            var bgPath = Path.Combine(cachePath, new System.IO.FileInfo(new Uri(bigPictureData.data.background).LocalPath).Name);
        
                            this.IsHeaderImageDownloaded = File.Exists(headerPath) && new FileInfo(headerPath).Length > 0;
                            this.IsBackgroundImageDownloaded = File.Exists(bgPath) && new FileInfo(bgPath).Length > 0;
        
        
                            var videoList = new List<AvailableVideoResource>();
        
                            if (bigPictureData.data ?.movies != null)
                            {
                                foreach(var m in bigPictureData.data.movies)
                                {
                                    var q = (from k in m.webm.Keys
                                    select new AvailableVideoResource()
                                    {
                                        Name = m.name,
                                            Quality = k,
                                            Url = m.webm[k],
                                            SizeInBytes = m.webmSizeInBytes != null && m.webmSizeInBytes.ContainsKey(k) ? (int ?)m.webmSizeInBytes[k] : null,
                                                IsDownloaded = false
                                    }).ToList();
        
                                    foreach(var v in q)
                                    {
                                        var ext = new FileInfo(new System.Uri(v.Url).LocalPath).Extension.TrimStart('.');
                                        var expectedFilename = Util.MakeValidFileName(string.Format("{0}.{1}.{2}", v.Name, v.Quality, ext));
                                        var expectedVideoPath = Path.Combine(cachePath, expectedFilename);
                                        //var expectedVideoPath = Path.Combine(cachePath, new System.IO.FileInfo(new Uri(v.Url).LocalPath).Name);
        
                                        if (File.Exists(expectedVideoPath) && new FileInfo(expectedVideoPath).Length > 0) {
                                            v.IsDownloaded = true;
                                            hasAtLeastOneVideoDownloaded = true;
        
                                        }
                                    }
        
                                    videoList.AddRange(q.ToArray());
        
                                }
                            }
        
                            this.AvailableVideos = videoList;
        
                        }
                        else {
                            // re-download BP.json
                            this.IsBPMetadataDownloaded = false;
                        }
        
        
        
                        this.IsComplete = this.IsBPMetadataDownloaded && this.IsHeaderImageDownloaded && this.IsBackgroundImageDownloaded && hasAtLeastOneVideoDownloaded;
                    }
                    catch (Exception ex) {
                        // TODO: Log exception? or just ignore and carry on to download BP.json from scratch
                    }
        
        
                }
        
                this.IsSteamDbMetadataDownloaded = !string.IsNullOrWhiteSpace(this.ExeName);
         */
    };
    return ProjectGameEntry;
}(SteamAPI_1.OwnedGame));
exports.ProjectGameEntry = ProjectGameEntry;
