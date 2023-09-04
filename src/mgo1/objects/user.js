export class User {
    constructor(summary) {
        this._data = summary;
    }

    get createdAt() { return new Date(Date.parse(this._data.created_at)) }
    get updatedAt() { 
        if(this._data.updated_at.indexOf("0001") === -1) {
            return new Date(Date.parse(this._data.updated_at))
        }
        return new Date(Date.parse(this._data.created_at))
    }
    get deletedAt() { 
        if(this._data.deleted_at.indexOf("0001") === -1) {
            return new Date(Date.parse(this._data.deleted_at))
        }
        return null
    }
    get id() { return this._data.id; }
    get username() { return this._data.username?this._data.username:""; }
    get name() { return this._data.display_name; }
    get hasEmblem() { return this._data.has_emblem; }
    get emblem() { return this._data.has_emblem?this._data.emblem_text:""}
    get overallRank() { return this._data.overall_rank; }
    get weeklyRank() { return this._data.weekly_rank; }
}

export class UserStats {
    constructor(stats) {
        for(let i = 0; i < stats.length; i++) {
            stats[i] = correctStatNames(stats[i]);
        }

        this._data = stats
    }
    
    periodStats(period) {
        const filter = {period: period};
        return this.filteredStats(filter);
    }
    modeStats(period, mode) {
        const filter = {period: period, mode: mode};
        return this.filteredStats(filter);
    }
    mapStats(period, map) {
        const filter = {period: period, map: map};
        return this.filteredStats(filter);
    }

    rank(mode) {
        return this.modeStats("all-time", mode)['rank']
    }

    filteredStats(filters) {
        if(filters.period !== undefined) filters.period = periodToNumber(filters.period);
        if(filters.mode !== undefined) filters.mode = modeToNumber(filters.mode);
        if(filters.map !== undefined) filters.map = mapToNumber(filters.map);
        let out = {}
        for(let i = 0; i < this._data.length; i++) {
            out = mergeStatFiltered(filters, out, this._data[i]);
        }
        return out;
    }

    animalRank() {
        const stats = {
            dm: this.modeStats(undefined, "dm"),
            tdm: this.modeStats(undefined, "tdm"),
            cap: this.modeStats(undefined, "cap"),
            res: this.modeStats(undefined, "res"),
            sne: this.modeStats(undefined, "sne"),
            all: this.periodStats(undefined)
        }

        for(const mode in stats) {
            if(mode == 'all') continue;
            stats[mode]['rank'] = this.rank(mode);
        }

        const hoursPlayed = stats['all']['play_time'] / 1000000000 / 60 / 60;
        
        if(hoursPlayed >= 15) {
            if(this.isFoxhound(stats)) return "Foxhound";
            if(this.isFox(stats)) return "Fox";
        }

        if(hoursPlayed >= 10) {
            if(this.isDoberman(stats)) return "Doberman";
            if(this.isHound(stats)) return "Hound";
        }

        if(hoursPlayed >= 5) {
            if(this.isCrocodile(stats)) return "Crocodile";
            if(this.isEagle(stats)) return "Eagle";
            if(this.isScorpion(stats)) return "Scorpion";
            if(this.isJaws(stats)) return "Jaws";
            if(this.isKerotan(stats)) return "Kerotan";
            // And apparently two other ranks but they are not explicitly called out
        }

        if(hoursPlayed >= 3) {
            if(this.isChameleon(stats)) return "Chameleon";
            if(this.isPigeon(stats)) return "Pigeon";
            if(this.isTarantula(stats)) return "Tarantula";
            if(this.isFlyingSquirrel(stats)) return "Flying Squirrel";
            if(this.isSnakeEater(stats)) return "Snake Eater";
            if(this.isSloth(stats)) return "Sloth";
            if(this.isNightOwl(stats)) return "Night Owl";
            if(this.isPig(stats)) return "Pig";
            if(this.isTsuchinoko(stats)) return "Tsuchinoko";
            if(this.isChicken(stats)) return "Chicken";
        }

        return "";


    }



    isFoxhound(stats) {
        /* 
        Req.1 (The number of total team victories - number of total sneaking victories)
        divided by (the number of total capture rounds + total rescue rounds + total 
        team deathmatch rounds) = 0.65 or above
        Req. 2 (Total kills + total stuns against enemy) divided by (total deaths +
        total stuns) = 1.5 or above
        Req. 3 Total amount of sneaking mission rounds you stayed alive and total 
        amount of rescue rounds you stayed alive rounds divided by the total rounds
        = 0.65 or above
        Req. 4 You have to be ranked in the top 30 score ranking in 1 type of game 
        (sne,cap,etc.) or ranked in the top 30 total score ranking
        */

        let isSub30 = false
        for(const mode in stats) {
            if(mode == 'all') continue;
            if(stats[mode]['rank'] <= 30) isSub30 = true;
        }
        if(!isSub30) return false;

        const req1 = (stats['res']['team_wins'] + stats['sne']['team_wins']) / (stats['cap']['rounds_played'] + stats['res']['rounds_played'] + stats['tdm']['rounds_played']);
        if(req1 < 0.65) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.5) return false;

        const req3 = (stats['sne']['rounds_no_death'] + stats['res']['rounds_no_death']) / (stats['sne']['rounds_played'] + stats['res']['rounds_played']);
        if(req3 < 0.65) return false;

        return true;
    }

    isFox(stats) {
        /*
        Req. 1 (The total number of team (CAP, RES, TDM) victories - number of total 
        sneaking victories) divided by (total number of capture rounds + total rescue
        rounds + total team deathmatch rounds) = 0.625 or above
        Req. 2 (Total kills + total stuns against enemy) divided by (total deaths +
        total stuns) = 1.45 or above
        Req. 3 Total amount of sneaking mission rounds you stayed alive and total 
        amount of rescue rounds you stayed alive rounds divided by the total rounds
        = 0.5 or above
        Req. 4 You have to be ranked in the top 200 score ranking in 1 type of game 
        (sne,cap,etc.) or ranked in the top 200 total score ranking
        */
        let isSub200 = false
        for(const mode in stats) {
            if(mode == 'all') continue;
            if(stats[mode]['rank'] <= 200) isSub200 = true;
        }
        if(!isSub200) return false;

        const req1 = (stats['res']['team_wins'] + stats['sne']['team_wins']) / (stats['cap']['rounds_played'] + stats['res']['rounds_played'] + stats['tdm']['rounds_played']);
        if(req1 < 0.625) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.45) return false;

        const req3 = (stats['sne']['rounds_no_death'] + stats['res']['rounds_no_death']) / (stats['sne']['rounds_played'] + stats['res']['rounds_played']);
        if(req3 < 0.5) return false;

        return true;        
    }

    isDoberman(stats) {
        /*
        Req. 1 (The total number of team (CAP, RES, TDM) victories - number of total 
        sneaking victories) divided by (total number of capture rounds + total rescue
        rounds + total team deathmatch rounds) = 0.6 or above
        Req. 2 (Total kills + total stuns against enemy) divided by (total deaths +
        total stuns) = 1.4 or above
        */
        const req1 = (stats['res']['team_wins'] + stats['sne']['team_wins']) / (stats['cap']['rounds_played'] + stats['res']['rounds_played'] + stats['tdm']['rounds_played']);
        if(req1 < 0.6) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.4) return false;

        return true;
    }
    
    isHound(stats) {
        /*
        Req. 1 (The total number of team (CAP, RES, TDM) victories - number of total 
        sneaking victories) divided by (total number of capture rounds + total rescue
        rounds + total team deathmatch rounds) = 0.55 or above
        Req. 2 (Total kills + total stuns against enemy) divided by (total deaths +
        total stuns) = 1.3 or above
        */

        const req1 = (stats['res']['team_wins'] + stats['sne']['team_wins']) / (stats['cap']['rounds_played'] + stats['res']['rounds_played'] + stats['tdm']['rounds_played']);
        if(req1 < 0.55) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.3) return false;

        return true;
    }

    isCrocodile(stats) {
        /*
        Req. 1 (Total kills + total syuns against enemy) divided by (total deaths +
        total stuns) = 1.5 or above
        */
        const req1 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req1 < 1.5) return false;

        return true;
    }

    isEagle(stats) {
		/*
		Req. 1 Head shot ratio ratio of 30% or more
		Req. 2 (Total kills + total stuns against enemy) divided by (total deaths +
		total stuns) = 1.3 or above
		*/

        const req1 = stats['all']['head_shots'] / stats['all']['kills'];
        if(req1 < 0.3) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.3) return false;

        return true
	}

	isScorpion(stats) {
		/*
		Req. 1 kill ratio with Scorpion 50% or more
		Req. 2 (Total kills + total stuns against enemy) divided by (total deaths +
		total stuns) = 1.25 or above
		*/

        const req1 = stats['all']['kills_with_scorpion'] / stats['all']['kills'];
        if(req1 < 0.5) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.25) return false;

        return true
	}

	isJaws(stats) {
		/*
		Req. 1 kill ratio with Knife 7.5% or more
		Req. 2 (Total kills + total stuns against enemy) divided by or (total deaths +
		total stuns) = 1.25 or above
		*/

        const req1 = stats['all']['kills_with_knife'] / stats['all']['kills'];
        if(req1 < 0.075) return false;

        const req2 = (stats['all']['kills'] + stats['all']['stuns']) / (stats['all']['deaths'] + stats['all']['stuns_received']);
        if(req2 < 1.25) return false;

        return true
	}

	isChameleon(stats) {
		/*
		Req. 1 Survival ratio in sneaking mission and rescue of 50% or more
		Req. 2 Use the cardboard box a bunch (maybe deals with amount of time in box,
		or stun evades using box??)
		Req. 3 In the event of choosing between CHA and PGE, CHA comes first.
		*/

        const req1 = (stats['sne']['rounds_no_death'] + stats['res']['rounds_no_death']) / (stats['sne']['rounds_played'] + stats['res']['rounds_played']);
        if(req1 < 0.5) return false;

        return true

	}

	isPigeon(stats) {
		/*
		Req. 1 The amount of kills in capture divided by the amount of stuns you
		have in capture = 0.5 or below 
		Req. 2 The amount of kills in rescue divided by the amount of stuns you
		have in rescue = 0.5 or below
		Req. 3 Capture play time + rescue mission play time = 2 hours or more
		Req. 4 In the event of choosing between CHA and PGE, CHA comes first.
		*/

        const req1 = stats['cap']['kills'] / stats['cap']['stuns'];
        if(req1 > 0.5) return false;

        const req2 = stats['res']['kills'] / stats['res']['stuns'];
        if(req2 > 0.5) return false;

        const req3 = stats['cap']['play_time'] + stats['res']['play_time'];
        if(req3 < 2*60*60*1000000000) return false;

	}

	isTarantula(stats) {
		/*
		Req. (Total team kills + total team stuns) divided by (total amount of kills +
		total amount of stuns against enemy) = 0.05 or above (UNSURE)
		*/

        const req1 = (stats['all']['team_kills'] + stats['all']['team_stuns']) / (stats['all']['kills'] + stats['all']['stuns']);
        if(req1 < 0.05) return false;

        return true
	}

	isFlyingSquirrel(stats) {
		/*
		Req. 1 (Total number of rolls) divided by (amount of total rounds played) = 10
		or above
		*/

        const req1 = stats['all']['rolls'] / stats['all']['rounds_played'];
        if(req1 < 10) return false;

        return true
	}

	isSnakeEater(stats) {
		/*
		Req. 1 (Total play time of sneaking mission) divided by (total play time) = .75
		or above
		*/

        const req1 = stats['sne']['play_time'] / stats['all']['play_time'];
        if(req1 < 0.75) return false;

        return true
	}

	isKerotan(stats) {
		/*
		Req. 1 (Total play time of capture) divided by (total play time) = .75 or above
		*/

        const req1 = stats['cap']['play_time'] / stats['all']['play_time'];
        if(req1 < 0.75) return false;

        return true
	}


	isSloth(stats) {
		/*
		Req. 1 (The amount of headshots you have received) divided by (total amount of
		deaths you have received) = .35 or more
		*/

        const req1 = stats['all']['head_shots_received'] / stats['all']['deaths'];
        if(req1 < 0.35) return false;

        return true
	}

	isNightOwl(stats) {
		/*
		Req. 1 (Total amount of thermal goggle use) divided by (total play time) = .05
		or above
		*/

        const req1 = stats['all']['infrared_goggle_uses'] / stats['all']['play_time'];
        if(req1 < 0.05) return false;

        return true
	}

	isPig(stats) {
		/*
		Req. 1 (Total amount of food eaten) divided by (total amount of rounds played)
		= 3 or above
		*/

        const req1 = stats['all']['times_eaten'] / stats['all']['rounds_played'];
        if(req1 < 3) return false;

        return true
	}

	isTsuchinoko(stats) {
		return false
	}

	isChicken(stats) {
		/*
		Req. 1 (Total kills) divided by (total rounds) = 0.3 or below
		Req. 2 (Total stuns against enemy) divided by (total rounds) = 0.3 or below
		Req. 3 (Total stuns) divided by (total rounds) = 0.5 or below
		Req. 4 (Total deaths) divided by (total rounds) = 0.5 or below
        */

        const req1 = stats['all']['kills'] / stats['all']['rounds_played'];
        if(req1 > 0.3) return false;

        const req2 = stats['all']['stuns'] / stats['all']['rounds_played'];
        if(req2 > 0.3) return false;

        const req3 = stats['all']['stuns_received'] / stats['all']['rounds_played'];
        if(req3 > 0.5) return false;

        const req4 = stats['all']['deaths'] / stats['all']['rounds_played'];
        if(req4 > 0.5) return false;

        return true
    }


}

function mergeStatFiltered(filter, oldStat, newStat) {
    if(filter.period !== undefined) {
        if(filter.period != newStat.period) return oldStat;
    }
    if(filter.mode !== undefined) {
        if(filter.mode != newStat.mode) return oldStat;
    }
    if(filter.map !== undefined) {
        if(filter.map != newStat.map) return oldStat;
    }
    const merged = mergeStat(oldStat, newStat);
    // The rank inside the stat is only for period/mode not map, and not overall rank for a period
    if(filter.period !== undefined && filter.mode !== undefined && filter.map === undefined) {
        merged["rank"] = newStat["rank"]
    }

    return merged

}

function periodToNumber(period) {
    switch(period) {
        case "all", "all-time":
            return PeriodAllTime;
        case "weekly":
            return PeriodWeekly;
        case "archive":
            return PeriodArchive;
    }
    throw new Error("Invalid period");
}

function modeToNumber(mode) {
    switch(mode) {
        case "dm":
        case "deathmatch": 
            return 0;
        case "tdm":
        case "team deathmatch":
        case "team-deathmatch":
            return 1;
        case "res":
        case "rescue":
            return 2;
        case "cap":
        case "capture":
            return 3;
        case "sne":
        case "sneaking":
            return 4;
    }
    throw new Error(`Invalid mode: '${mode}'`);
}

function mapToNumber(map) {
    switch(map) {
        case "lost forest": return 1;
        case "ghost factory": return 2;
        case "city under siege": return 3;
        case "killhouse a": return 4;
        case "killhouse b": return 5;
        case "killhouse c": return 6;
        case "svyatogornyj east": return 7;
        case "mountaintop": return 8;
        case "graniny gorki lab": return 9;
        case "pillbox purgatory": return 10;
        case "high ice": return 11;
        case "brown town": return 12;
    }
}


const addableFields = ['kills','deaths','suicides','self_stuns','stuns','stuns_received','snake_frags','points','team_kills','team_stuns','rounds_played','rounds_no_death','kerotans_for_win','kerotans_placed','radio_uses','text_chat_uses','cqc_attacks','cqc_attacks_received','head_shots','head_shots_received','team_wins','kills_with_scorpion','kills_with_knife','times_eaten','rolls','infrared_goggle_uses','play_time','gakos_rescued', 'goals_as_snake'];
const maxFields = ['kill_streak','death_streak'];
function mergeStat(oldStat, newStat) {

    addableFields.forEach(field => {
        if(!oldStat[field]) oldStat[field] = 0;
        if(newStat[field]) {
            oldStat[field] += newStat[field];
        }
    })

    maxFields.forEach(maxField => {
        if(!oldStat[maxField]) oldStat[maxField] = 0;
        if(newStat[maxField]) {
            oldStat[maxField] = Math.max(oldStat[maxField], newStat[maxField]);
        }
        
    })

    return oldStat;
}

function correctStatNames(stats) {
    switch(stats.mode_string) {
        case "rescue":
            stats["gakos_rescued"] = stats["kerotans_for_win"]
            delete stats["kerotans_for_win"]
            delete stats["kerotans_placed"]
            break;
        case "capture":
            break;
        case "sneaking":
            stats["goals_as_snake"] = stats["kerotans_placed"]
            delete stats["kerotans_for_win"]
            delete stats["kerotans_placed"]
            break;
        default:
            delete stats["kerotans_for_win"]
            delete stats["kerotans_placed"]
    }
    return stats;
}

const PeriodAllTime = 0;
const PeriodWeekly = 1;
const PeriodArchive = 2;