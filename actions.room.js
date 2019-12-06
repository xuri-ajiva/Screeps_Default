module.exports = {
    move_in_room: function (creep, room_name, pos) {
        if (creep.room.name !== room_name) {
            //console.log(JSON.stringify(pos));
            creep.moveTo(Game.flags['spawn']);
            //creep.moveTo(creep.room.findExitTo(room_name));
            return ERR_NOT_IN_RANGE;
        }
        return OK;
    },

    claim_controller: function (creep) {
        if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            return ERR_NOT_IN_RANGE;
        }
        return OK;
    },
    create_construction_site(constructionSite, pos,creep) {
        //creep.say(Game.flags['spawn'].pos.createConstructionSite(constructionSite));
        if (Game.flags['spawn'].pos.createConstructionSite(constructionSite) === OK) return OK; else return ERR_NOT_IN_RANGE;
    }
};