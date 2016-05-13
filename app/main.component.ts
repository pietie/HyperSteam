/// <reference path="./typings/main.d.ts" />
 

import {Component} from '@angular/core';
import {Routes, Route, ROUTER_DIRECTIVES, Router } from '@angular/router';

import { Http, HTTP_PROVIDERS, Response } from '@angular/http';

import * as Util from './src/Util'
import { OwnedGamesResponse } from './src/ObjectModel/SteamAPI'

import { MainViewComponent } from './src/MainView/mainview.component'
import { UpdateWizardStep1Component } from './src/UpdateWizard/step1.component'

import { ProjectService } from './src/Services/project.service'
import { SteamService } from './src/Services/steam.service'
import { DownloaderService } from './src/Services/downloader.service'

import {MdToolbar } from '@angular2-material/toolbar';
import {MdButton, MdAnchor} from '@angular2-material/button';


// import * as jetpack from 'fs-jetpack'


  
@Component({
	selector: 'my-app',
	directives: [ ROUTER_DIRECTIVES, MdToolbar, MdButton, MdAnchor ],
	providers: [ProjectService, SteamService, DownloaderService, HTTP_PROVIDERS],
	styleUrls: [ './main.component.css' ],
	template: `
		<div id="appheader">HyperSteam</div>
		
	<md-toolbar color2="primary">
  		<button md-button color="primary" (click)="onSaveProjectClicked()">Save project</button>
		  <button md-button color="primary" (click)="onLoadProjectClicked()">Load project</button>
	</md-toolbar>
		
		<a [routerLink]="['/mainview']">Main view</a>
		  <a [routerLink]="['/updatelibrary']">Update wizard</a>
		<div class="content" style="padding: 10px;">
			<router-outlet></router-outlet>
		</div>

<div id="loadProjectDialog" *ngIf="showProjectDialog">

  <div class="dlg">
    <h3>Load project</h3>
    
	<div class="content">
		<p *ngIf="noProjectsFound">
			No project files found in the ./projects directory.
		</p>
		
		<ul *ngIf="!noProjectsFound">
			<div *ngFor="let path of projectFileList">
				<a href="javascript:void(0)" (click)="loadProject(path);">{{ path }}</a>
			</div>
		</ul>
	
	</div>
    
    <div class="cmd">
        <button md-button (click)="showProjectDialog=false">Cancel</button>      
    </div> 
  </div>
  
</div>

	`
})
@Routes([
	{ path: '/mainview', component: MainViewComponent },
    { path: '/updatelibrary', component: UpdateWizardStep1Component },
]) 
export class MainComponent { 
	private showProjectDialog:boolean = false;
	private noProjectsFound:boolean = false;
	private projectFileList:string[];
	
	constructor(private router:Router, private project:ProjectService, private downloader: DownloaderService)
	{ 
        //this.project.setSteamId("76561197960435530");
		this.router.navigate(["./mainview"], null);
	}
	
	onLoadProjectClicked()
	{
		try	
		{
			let jetpack = window.jetpack;
			let path = window.path;
			
			var projectsDir = jetpack.dir('./projects');
			 
			
			var projectFiles = jetpack.find("./projects", { files: true, matching: "*.json" });
			
			this.noProjectsFound = !(projectFiles && projectFiles.length > 0); 
			
			this.projectFileList = [];
			
			projectFiles.forEach(filePath => {
				
				var parsedPath = path.parse(filePath);
				
				this.projectFileList.push(parsedPath.base);
			 
			});
			
			this.showProjectDialog = true;
		}	
		catch(e)
		{
			this.showProjectDialog = false;
			alert(e.toString()); // TODO: Handle exception
		}
	}
	
	onSaveProjectClicked()
	{
		this.project.save();		
		Util.Success("Project saved successfully");
		
	}
	
	loadProject(path:string)
	{
		this.showProjectDialog = false;
		
		var projectData = jetpack.read(`./projects/${path}`, "json");
		
		this.project.load(projectData);
				
		Util.Success("Project succesfully loaded");
	}
	
}