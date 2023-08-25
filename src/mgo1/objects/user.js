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