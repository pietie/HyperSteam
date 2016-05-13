/// <reference path="../../all.d.ts" />
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
var steam_service_1 = require('./steam.service');
require('rxjs/Rx');
var Collections = require('typescript-collections');
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
    function DownloaderService(http, steam) {
        this.http = http;
        this.steam = steam;
        this.queue = new Collections.Queue();
        this.workQueue = new Collections.LinkedList();
        this.processQueue();
    }
    DownloaderService.prototype.processQueue = function () {
        var _this = this;
        try {
            // check for work to do and for open slots to do them in
            var _loop_1 = function() {
                var req = this_1.queue.dequeue();
                var worker = new Worker("./src/services/downloader.ww.js");
                // kick off the download process
                worker.postMessage({ type: 0 /*init*/, request: req });
                worker.onmessage = function (event) {
                    worker.terminate();
                    _this.workQueue.remove(worker);
                    _this.processRequestResult(req, event.data);
                };
                this_1.workQueue.add(worker);
            };
            var this_1 = this;
            while (this.queue.size() > 0 && this.workQueue.size() < DownloaderService.MAX_NUMBER_OF_CONCURRENT_DOWNLOADS) {
                _loop_1();
            }
            setTimeout(function () { _this.processQueue(); }, 30);
        }
        catch (e) {
            // TODO: handle exception
            console.error(e);
        }
    };
    DownloaderService.prototype.processRequestResult = function (request, response) {
        if (response) {
            if (typeof (response.done) !== "undefined" && response.done) {
                if (response.success && response.data) {
                    if (request.type == DownloadRequestType.Metadata) {
                        var appData = response.data[request.appId];
                        if (appData && appData.success) {
                            if (typeof (appData.data) === "undefined" || appData.data == null) {
                                // TODO: sometimes we get back empty data result even if the request says success=true (e.g. appId = 458320)
                                console.error("appID:" + request.appId);
                            }
                        }
                        else {
                            appData = { "success": false };
                        }
                        var bpJson = JSON.stringify(appData);
                        var dst = window.jetpack.dir("./projects/cache/" + request.appId, { empty: false });
                        console.log("Writing %s...", request.appId);
                        dst.write('bp.json', bpJson);
                    }
                }
                else {
                    console.error("some issue??");
                    console.dir(response);
                }
            }
        }
    };
    DownloaderService.prototype.queueRequest = function (request) {
        // TODO: Handle updates?
        //this.queue.contains() 
        this.queue.add(request);
        //console.log("Queued: %s", request.appId);     
    };
    // TODO: Max number of downloads at a time?
    DownloaderService.MAX_NUMBER_OF_CONCURRENT_DOWNLOADS = 10;
    DownloaderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, steam_service_1.SteamService])
    ], DownloaderService);
    return DownloaderService;
}());
exports.DownloaderService = DownloaderService;
var DownloadRequest = (function () {
    function DownloadRequest() {
    }
    return DownloadRequest;
}());
exports.DownloadRequest = DownloadRequest;
(function (DownloadRequestType) {
    DownloadRequestType[DownloadRequestType["Metadata"] = 100] = "Metadata";
    DownloadRequestType[DownloadRequestType["HeaderImage"] = 200] = "HeaderImage";
    DownloadRequestType[DownloadRequestType["BackgroundImage"] = 300] = "BackgroundImage";
    DownloadRequestType[DownloadRequestType["Video"] = 400] = "Video";
    DownloadRequestType[DownloadRequestType["SteamDbInfo"] = 500] = "SteamDbInfo";
})(exports.DownloadRequestType || (exports.DownloadRequestType = {}));
var DownloadRequestType = exports.DownloadRequestType;
