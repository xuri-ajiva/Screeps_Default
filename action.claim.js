module.exports = {
    run: function (creep) {
        if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            return ERR_NOT_IN_RANGE;
        }
        return OK;
    },
};