let upgrade = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        //creep.say('⬇');
        let construct = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (construct !== undefined && construct !== null) {
            let ret = creep.build(construct);
            if (ret === ERR_NOT_IN_RANGE) {
                creep.moveTo(construct);
            } else {
                creep.moveTo(construct.pos.x + 2, construct.pos.y);
            }
        } else {
            if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spw);
            }else{
                console.log("resycle: " + creep.name);
            }
        }
    },
    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        }else{
            spw.memory.creeps_count_by_action[creep.action] --;
        }
    }
};

module.exports = upgrade;