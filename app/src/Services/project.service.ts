/// <reference path="../../all.d.ts" />

import { Injectable } from '@angular/core';

import { OwnedGame }  from '../ObjectModel/SteamAPI'

@Injectable()
export class ProjectService {

    private steamProfileId: string;
    public steamPerson: string;
    public steamAvatarUrl: string;
    private entries:ProjectGameEntry[];

    private Name: string;

    public get SteamProfileId(): string {
        return this.steamProfileId;
    }

    public set SteamProfileId(v: string) {
        this.steamProfileId = v;
    }

    

    public load(from : ProjectService) {
        
        this.steamProfileId = from.steamProfileId;
        this.steamPerson = from.steamPerson;
        this.steamAvatarUrl = from.steamAvatarUrl;
        this.entries = from.entries;
        this.Name = from.Name;
    }

    public save() {
        try {
            var jetpack = window.jetpack;

            var data = JSON.stringify(this);

            var dst = jetpack.dir('./projects', { empty: false });

            dst.write('test.json', data);
            //alert(jetpack.cwd());
        }
        catch (e) {
            alert(e.toString());
            console.error(e);
        }
    }

    public setSteamId(steamProfileId: string) {
        // TODO: Add some validation ?
        this.steamProfileId = steamProfileId;

    } 
    
    
    public addUpdateEntry(game:OwnedGame) : { updated?:boolean, added?:boolean }
    { 
        if (this.entries == null) this.entries = [];
        
        let existing = this.entries.find(e=>e.appid == game.appid);

        if (existing != null)
        {
            existing.initFrom(game);   
            return { updated: true };
        }
        else
        {
            var newEntry = new ProjectGameEntry();
            
            newEntry.initFrom(game);
            
            this.entries.push(newEntry);
            
            return { added: true };
        }
        
    } 
}

export class ProjectGameEntry extends OwnedGame {
   
    public CustomAdded: boolean;
    public Deleted: boolean;
    public Description: string;
    public ExeName: string;
    
    
    initFrom(copy: OwnedGame) {
        this.appid = copy.appid;
        this.img_icon_url = copy.img_icon_url;
        this.img_logo_url = copy.img_logo_url;
        this.name = copy.name;
        this.playtime_forever = copy.playtime_forever;
    }

    public ValidateDownloadedItems(): void {

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

    }

    // [JsonIgnore]
    // public bool IsBPMetadataDownloaded { get; private set; }

    // [JsonIgnore]
    // public bool IsHeaderImageDownloaded { get; private set; }

    // [JsonIgnore]
    // public bool IsBackgroundImageDownloaded { get; private set; }

    // [JsonIgnore]
    // public bool IsSteamDbMetadataDownloaded { get; private set; }


    // [JsonIgnore]
    // public List<AvailableVideoResource> AvailableVideos { get; private set; }

    // [JsonIgnore]
    // private bool HasBeenValidated { get; set; }


}
