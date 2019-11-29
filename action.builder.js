let upgrade = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        let construct = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (construct !== undefined && construct !== null) {
            let ret = creep.build(construct);
            if (ret === ERR_NOT_IN_RANGE) {
                creep.moveTo(construct);
            } else {
                creep.moveTo(construct.pos.x - 3, construct.pos.y + 1);
            }
        } else {
            console.log("Resycle");
            if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spw);
            }
        }

    }
};

module.exports = upgrade;