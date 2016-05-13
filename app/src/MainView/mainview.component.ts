import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { MdInput, MdHint, MdPlaceholder } from '@angular2-material/input';
import { MdSpinner } from '@angular2-material/progress-circle';
import { MdCard, MdCardHeader, MdCardTitleGroup } from '@angular2-material/card';
import { MdList, MdListAvatar, MdListItem } from '@angular2-material/list';
import { MdProgressBar } from '@angular2-material/progress-bar';

import { ProjectService } from '../Services/project.service'
import { SteamService } from '../Services/steam.service'
import { PlayerSummaryPlayer, OwnedGame  } from '../ObjectModel/SteamAPI'
import * as Util from '../Util'

import { NG2_PIPES } from 'angular-pipes';
 
@Component({
    selector: 'mainview',
    templateUrl: "./src/MainView/mainview.component.html",
    directives: [ MdInput, MdHint, MdPlaceholder, MdCard, MdCardHeader, MdCardTitleGroup, MdSpinner, MdList, MdListAvatar, MdListItem, MdProgressBar ],
    pipes: [ NG2_PIPES ],
    styleUrls: [ './src/MainView/mainview.component.css' ] 
})
export class MainViewComponent {
    private isUpdatingLibrary:boolean = false;
    //private gameList:OwnedGame[];
    
    private isAvatarLoading:boolean = false;
   
    constructor(private project:ProjectService, private steam:SteamService, private router:Router) {
       //? this.reloadAvatarUrl(); // TODO: Take out once this is capture in the project settings
    }
    
    private reloadAvatarUrl()
    {
        this.isAvatarLoading = true; 
        // TODO: move to steamId update?
        SteamService.GetPlayerSummary(this.project.SteamProfileId).then(r=>
        {
            this.project.steamPerson = r.realname ? r.realname : r.personaname;
            this.project.steamAvatarUrl = r.avatarfull;
            this.isAvatarLoading = false;
        }).catch(r=>{ alert(r); this.project.steamAvatarUrl = null; this.project.steamPerson = null; this.isAvatarLoading = false;  } );
        
    }
    
    onUpdateLibraryClicked()
    {
        //this.router.navigate(['./updatelibrary'], null);
        this.fetchOwnedGames();
        
    }
    
    onSteamIdChanged()
    {
        this.reloadAvatarUrl();
    }
    
       
    fetchOwnedGames() // TODO: Also fetch detail for Additional AppIds 
    { 
        this.isUpdatingLibrary = true;
        
        // TODO: Handle case where SteamId is not set?
        this.steam.GetOwnedGames(this.project.SteamProfileId).then(ownedGames=>{
            this.isUpdatingLibrary = false;
            //this.gameList = r;
            
            let numberOfUpdates:number = 0; 
            let numberOfAdds:number = 0;
            
            ownedGames.forEach(g=>{
                var ret = this.project.addUpdateEntry(g);
                
                if (ret.updated) numberOfUpdates ++;
                else if (ret.added) numberOfAdds ++;
                
            });
            
            if (numberOfAdds > 0 && numberOfUpdates > 0) Util.Info(`${numberOfAdds} new item(s) added, ${numberOfUpdates} updated`);
            else if (numberOfAdds > 0) Util.Info(`${numberOfAdds} new item(s) added`);
            else if (numberOfUpdates > 0) Util.Info(`${numberOfUpdates} item(s) updated`);
            else Util.Info(`No items found. Please check your Steam Profile Id.`);
            
            //
            
            // TODO: Update existing list, determine # of new items and of updates --> include custom app ids in here?
            //Util.Info(`Owned games: ${ownedGames.length}`);
                              
        }).catch(e=>{ this.isUpdatingLibrary = false; alert(e.toString()); });
        
        
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