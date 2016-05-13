/// <reference path="../../all.d.ts" />

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SteamService } from './steam.service'
import { SteamStoreAppDetail } from '../ObjectModel/SteamAPI'
import 'rxjs/Rx';

import * as Util from '../Util'
import * as Collections from 'typescript-collections';


/* 
    This service keeps track of all current and queued downloads.
         Donwnloads include:
            * Big Picture metadata
            * Header images
            * Background images
            * SteamDB info
            * Videos

*/
@Injectable()
export class DownloaderService {
    // TODO: Max number of downloads at a time?
    
    private static MAX_NUMBER_OF_CONCURRENT_DOWNLOADS:number = 10;  
    
    private queue : Collections.Queue<DownloadRequest>;
    private workQueue : Collections.LinkedList<Worker>;

    constructor(private http:Http, private steam:SteamService)
    {
        this.queue = new Collections.Queue<DownloadRequest>();
        this.workQueue = new Collections.LinkedList<Worker>();
      
        
        this.processQueue(); 
    } 
 
    private processQueue() {
        try {
            // check for work to do and for open slots to do them in
            while (this.queue.size() > 0 && this.workQueue.size() < DownloaderService.MAX_NUMBER_OF_CONCURRENT_DOWNLOADS)
            {
                let req = this.queue.dequeue();       
                let worker = new Worker("./src/services/downloader.ww.js");
                
                // kick off the download process
                worker.postMessage({ type: 0/*init*/, request: req });

                worker.onmessage = (event:MessageEvent) => {
                    worker.terminate();
                    this.workQueue.remove(worker);

                    this.processRequestResult(req, event.data);
                };

                this.workQueue.add(worker);
            }

            setTimeout(() => { this.processQueue(); }, 30);
        } catch (e) {
            // TODO: handle exception
            console.error(e);
        }
    }
    
    private processRequestResult(request: DownloadRequest, response: any) {
        if (response) {
            if (typeof (response.done) !== "undefined" && response.done) {
                if (response.success && response.data) {
                    
                    if (request.type == DownloadRequestType.Metadata)
                    {
                        let appData: SteamStoreAppDetail = response.data[request.appId];

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
                        var dst = window.jetpack.dir(`./projects/cache/${request.appId}`, { empty: false });
                        console.log("Writing %s...", request.appId);
                        dst.write('bp.json', bpJson);
                    }

                }
                else { // some are current failing because of REGION -- e.g. 333930
                    console.error("some issue??");
                    console.dir(response);

                }

            }
        }
    }

    public queueRequest(request:DownloadRequest) : void
    {
        // TODO: Handle updates?
        //this.queue.contains() 
        this.queue.add(request);
        //console.log("Queued: %s", request.appId);     
    }
 
 
}

export class DownloadRequest
{
    appId: string;
    type: DownloadRequestType;    
}

export enum DownloadRequestType
{
    Metadata = 100,
    HeaderImage = 200,
    BackgroundImage = 300,
    Video = 400,
    SteamDbInfo = 500 
}
