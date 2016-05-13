/// <reference path="../../typings/main.d.ts" />

import { Injectable } from '@angular/core';
import { Http, HTTP_PROVIDERS, Response } from '@angular/http';
import 'rxjs/Rx';


import * as Util from '../Util'
import { PlayerSummaryResponse, PlayerSummaryPlayer, OwnedGamesResponse, OwnedGame, SteamStoreAppDetail } from '../ObjectModel/SteamAPI'

@Injectable()
export class SteamService {

    private static STEAM_API_KEY:string = "FE7FE7527FEAD4225BE172702C8C71A0";
    
    constructor(private http:Http)
    {
        
    }

    public static GetPlayerSummary(steamId:string) : Promise<PlayerSummaryPlayer>
    { // TODO: Add exception handling?
        return Util.fetchJson(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SteamService.STEAM_API_KEY}&steamids=${steamId}`).then(r=>
        {
            let playerSummaryResponse: PlayerSummaryResponse = r.response;

            return new Promise<PlayerSummaryPlayer>((resolve, reject) => {
                
                if (playerSummaryResponse.players.length > 0) resolve(playerSummaryResponse.players[0]);
                else reject("Profile not found");
            });
        });
    }
    
    public GetOwnedGames(steamId:string) : Promise<OwnedGame[]>
    {
        
            return new Promise<OwnedGame[]>((resolve, reject) => {

                this.http.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${SteamService.STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`)
                    .map((res: Response) => res.json())
                    .subscribe(
                    data => { resolve(data.response.games); },
                    err => { reject(err); },
                    () => {  }
                    );

        }); 

        
 
        
		// return Util.fetchJson(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${SteamService.STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`).then(r=>
		// {
		// 	let ownedGames:OwnedGamesResponse = r.response;
		
        //     return new Promise<OwnedGame[]>((resolve, reject) => {
                
        //         if (ownedGames) resolve(ownedGames.games);
        //         else reject("No games found");
        //     });
		// }); 
    }
     
    public downloadBigPictureMetadata(appId:string) : Promise<SteamStoreAppDetail>
    {
           return new Promise<SteamStoreAppDetail>((resolve, reject) => {
                this.http.get(`https://store.steampowered.com/api/appdetails/?appids=${appId}`)
                    .map((res: Response) => res.json())
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
                    );

        }); 
    }
    
}
