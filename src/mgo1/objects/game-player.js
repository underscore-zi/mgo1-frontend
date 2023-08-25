export class GamePlayer {
    constructor(player) {
        this._data = player
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
    get id() { return this._data.user?this._data.user.id:-1; }
    get name() { return this._data.user?this._data.user.display_name:"[unknown]"; }
    get team() { return this._data.team_string; }
    get kills() { return this._data.kills; }
    get deaths() { return this._data.deaths; }
    get score() { return this._data.score; }
    get ping() { return this._data.ping; }
    get duration() { return this.isAlive?(new Date() - this.createdAt):(this.deletedAt - this.createdAt); }

    get wasKicked() { return this._data.was_kicked; }
    get isAlive() { return this.deletedAt == null; }
}