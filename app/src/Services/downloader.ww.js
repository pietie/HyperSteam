//import { DownloadRequest, DownloadRequestType } from './downloader.service'
//import { Http, Response } from '@angular/http';
//import { SteamService } from './steam.service'
//import { SteamStoreAppDetail } from '../ObjectModel/SteamAPI'
// var i = 0;
// function timedCount() {
//     i = i + 1;
//     postMessage(i);
//     setTimeout("timedCount()", 500);
// }
// timedCount();
self.onmessage = function (e) {
    if (e.data.type == 0 /*init*/) {
        new WorkerObj(e.data.request).run();
    }
};
self.onerror = function () {
    close();
};
var WorkerObj = (function () {
    function WorkerObj(request) {
        this.request = request;
    }
    WorkerObj.prototype.run = function () {
        switch (this.request.type) {
            case 100 /*DownloadRequestType.Metadata*/:
                this.downloadMetadata();
                break;
        }
        //postMessage({ done: true }, null);
        //close(); // terminate this worker thread
        //  setTimeout(()=>{ 
        //      postMessage({ done: true }, null);
        //      close(); // terminate this worker thread
        //  }, 1000);
    };
    WorkerObj.prototype.done = function (success, data) {
        postMessage({ done: true, success: success, data: data }, null);
        close(); // terminate this worker thread from this side to make sure it gets killed
    };
    WorkerObj.prototype.downloadMetadata = function () {
        var _this = this;
        var url = "https://store.steampowered.com/api/appdetails/?appids=" + this.request.appId;
        fetch(url).then(function (r) { return r.json(); }).then(function (r) {
            _this.done(true, r);
        }).catch(function (e) {
            _this.done(false);
        });
        // this.http.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${SteamService.STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`)
        //     .map((res: Response) => res.json())
        //     .subscribe(
        //     data => { 
        //                 console.dir(data);
        //          },
        //     err => {  },
        //     () => { this.done(); }
        //     );
    };
    return WorkerObj;
}());
