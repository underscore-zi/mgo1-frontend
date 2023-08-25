export class AdminUser {
    constructor(user) {
        this._data = user;
    }

    get id() { return this._data.id; }
    get name() { return this._data.display_name; }
    get role() { return this._data.role }
    hasPrivilege(privilege) {
        if(this.role.all_privileges) { return true; }
        return this.role[privilege]?this.role[privilege]:false;
    }

}