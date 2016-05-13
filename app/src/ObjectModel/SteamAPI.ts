export class OwnedGamesResponse {
	public game_count: number;
	public games: OwnedGame[];
}

export class OwnedGame {
	public appid: number;
	public img_icon_url: string;
	public img_logo_url: string;
	public name: string;
	public playtime_forever: number;
}

export class PlayerSummaryResponse {
	public players: PlayerSummaryPlayer[];

}

export class PlayerSummaryPlayer {
	public steamid: string;
	public communityvisibilitystate: number;
	public profilestate: number;
	public personaname: string;
	public realname: string;
	public lastlogoff: number;
	public commentpermission: number;
	public profileurl: string;
	public avatar: string;
	public avatarmedium: string;
	public avatarfull: string;
	public personastate: number;
	public primaryclanid: string;
	public timecreated: number;
	public personastateflags: number;
}


export class SteamStoreAppDetail {
	public success: boolean;

	public data: SteamStoreAppDetailData;



}

export class SteamStoreAppDetailData {
	public type: string;
	public name: string;
	public steam_appid: string;

	public required_age: number;
	public dlc: string[];
	public detailed_description: string;
	public about_the_game: string;
	public supported_languages: string;
	public header_image: string;
	public background: string;

	public website: string;

	public pc_requirements: PcRequirements;
	public mac_requirements: PcRequirements;

	public legal_notice: string;
	public developers: string[];
	public publishers: string[];

	public price_overview: PriceOverview;

	public packages: string[];

	public categories: IdDescription[]
	public genres: IdDescription[];

	public screenshots: Screenshot[];
	public movies: Movie[];

	public recommendations: Recommendation;
	public achievements: Achievement;

	public release_date: ReleaseDate;

}//!

export class ReleaseDate {
	public coming_soon: boolean;
	public date: string;
}

export class Achievement {
	public total: number;
	public highlighted: Highlighted[];
}

export class Highlighted {
	public name: string;
	public path: string;
}

export class Recommendation {
	public total: number;
}

export class Movie {
	public id: number;
	public name: string;
	public thumbnail: string;
	public webm: {[id: string] : string};
	public webmSizeInBytes : [string,number]; /*quality key (e.g. 480 or max)*/ /*sizeInBytes*/
	public highlight: boolean;
}

export class Screenshot {
	public id: number;
	public path_thumbnail: string;
	public path_full: string;
}

export class IdDescription {
	public id: number;
	public description: string;
}


export class PcRequirements {
	public minimum: string;
	public recommended: string;
}

export class PriceOverview {
	public currency: string;
	public initial: number;
	public final: number;
	public discount_percent: number;
}	