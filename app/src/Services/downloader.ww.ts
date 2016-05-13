//import { DownloadRequest, DownloadRequestType } from './downloader.service'
//import { Http, Response } from '@angular/http';
//import { SteamService } from './steam.service'
//import { SteamStoreAppDetail } from '../ObjectModel/SteamAPI'

// Downloads a single resource?

declare type DownloadRequest; 

// var i = 0;

// function timedCount() {
//     i = i + 1;
//     postMessage(i);
//     setTimeout("timedCount()", 500);
// }

// timedCount();

self.onmessage = function (e: MessageEvent) {


    if (e.data.type == 0/*init*/) {
        new WorkerObj(e.data.request).run();
    }
}

self.onerror = function () {
    close();
}

class WorkerObj {
    private request: DownloadRequest;

    constructor(request: DownloadRequest) {
        this.request = request;
    }

    public run() {
        switch (this.request.type) {
            case 100/*DownloadRequestType.Metadata*/:
                this.downloadMetadata();
                break;
        }

        //postMessage({ done: true }, null);
        //close(); // terminate this worker thread

        //  setTimeout(()=>{ 
        //      postMessage({ done: true }, null);
        //      close(); // terminate this worker thread
        //  }, 1000);

    }

    private done(success: boolean, data?: any) {
        postMessage({ done: true, success: success, data: data }, null);
        close(); // terminate this worker thread from this side to make sure it gets killed
    }

    private downloadMetadata() {

        var url:string = `https://store.steampowered.com/api/appdetails/?appids=${this.request.appId}`;

        fetch(url).then(r => { return r.json(); }).then(r => {
            this.done(true, r);
            
        }).catch(e => {
            this.done(false);
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
    }



}
