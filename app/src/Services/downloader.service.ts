/// <reference path="../../typings/main.d.ts" />
import { Injectable } from '@angular/core';
import { Http, HTTP_PROVIDERS, Response } from '@angular/http';
import { SteamService } from './steam.service'
import 'rxjs/Rx';

import * as Util from '../Util'

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

    constructor(private http:Http, private steam:SteamService)
    {
    }

    
     
 
    
}
