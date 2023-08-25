import { GamePlayer } from './game-player.js';

export class Game {
    constructor(game) {
        this.id = game.id;
        this._data = game

        this.rules = [];
        game.options.rules.forEach(rule => {
            this.rules.push({
                mode: rule.mode_string,
                map: rule.map_string,
            });
        });

        this.players = [];
        this.playerCount = 0;
        game.players.forEach(player => {
            const p = new GamePlayer(player);
            if (p.isAlive) this.playerCount++;
            this.players.push(p);
        });
        if(this.isHostOnly) this.playerCount--;
        if(!this.isAlive) this.playerCount = 0;
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

    get name() { return this._data.options.name; }
    get description() { return this._data.options.description; }
    get currentRound() { return (this.isAlive?this._data.current_round:-1)}
    get maxPlayers() { return this.isHostOnly?this._data.options.max_players-1:this._data.options.max_players }
    get currentRules() { return this.rules[this.currentRound]; }
    get host() { return this.players[0]; }

    get isAlive() { return this.deletedAt == null  }
    get isLocked() {  return this._data.options.has_password }
    get isHostOnly() { return this._data.options.is_host_only; }
    
}