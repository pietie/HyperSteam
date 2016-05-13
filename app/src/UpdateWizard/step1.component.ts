import { Component } from '@angular/core';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { MdProgressCircle, MdSpinner } from '@angular2-material/progress-circle';
import { MdList, MdListAvatar, MdListItem } from '@angular2-material/list';

import { ProjectService } from '../Services/project.service'
import { SteamService } from '../Services/steam.service'

import { OwnedGame } from '../ObjectModel/SteamAPI'

import { NG2_PIPES } from 'angular-pipes';

import * as Util from '../Util'

@Component({
    selector: 'step1',
    directives: [ MdProgressBar, MdSpinner, MdProgressCircle, MdList, MdListAvatar, MdListItem ],
    pipes: [ NG2_PIPES ],
    templateUrl: "./src/UpdateWizard/step1.component.html",
    styles: [
        `
            .gameList
            {
                cursor: pointer;                
            }
            
            * /deep/ md-list-item::shadow div.md-list-item:hover {
                 background-color: #5EABFF;
                -webkit-transition: all 0.15s ease-in-out;
                -moz-transition: all 0.15s ease-in-out;
                -o-transition: all 0.15s ease-in-out;
                transition: all 0.15s ease-in-out;
            }
            
             * /deep/ md-list-item::shadow div.md-list-item:hover img {
                transition: scale 1.5s ease-in-out;
                transform: scale(1.5); 
              
             } 
             
               * /deep/ md-list-item::shadow > h3
                {
                    font-weight: bold;
                }
         
       
        `  
    ]  
})
export class UpdateWizardStep1Component {
    private isLoading:boolean = false;
    private gameList:OwnedGame[];

    constructor(private project:ProjectService, private steam: SteamService) {
        try {
           // !this.fetchOwnedGames();
            
            steam.GetBigPictureData("362410");
        }
        catch (e) {
            alert(e.toString());
        }
    }
    
    fetchOwnedGames()
    { 
        this.isLoading = true;
        
        // TODO: Handle case where SteamId is not set?
        this.steam.GetOwnedGames(this.project.SteamProfileId).then(r=>{
            this.isLoading = false;
            this.gameList = r;
            // TODO: Update existing list, determine # of new items and of updates --> include custom app ids in here?
            Util.Info(`Owned games: ${r.length}`);
                              
        }).catch(e=>{ this.isLoading = false; alert(e.toString()); });
        
        
    }
    
    getGameAvatarUrl(game:OwnedGame)
    {
        if (!game.img_icon_url || game.img_icon_url == "") return './images/steamdefprofile.jpg' ;
        return `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
    }
    
    onGameSelected(game:OwnedGame)
    {
        alert(game.name);
    }
}

