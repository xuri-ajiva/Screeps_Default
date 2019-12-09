let upgrade = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        if (creep.spawning) return;

        switch (creep.memory.init) {
            case 0:
                if (creep.store[RESOURCE_ENERGY] === 0) creep.memory.init = 1;
                else creep.memory.init = 2;
                break;
            case 1:
                let carry = require('action.carry');
                carry.GetEnergy(creep, spw, true);
                break;
            case 2:
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
                    } else {
                        console.log("resycle: " + creep.name);
                    }
                }
                break;

            default:
                creep.memory.init = 0;
                break;
        }

        if (creep.store[RESOURCE_ENERGY] === 0) creep.memory.init = 1;
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && creep.memory.init === 1) creep.memory.init = 2;
    },
    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        } else {
            spw.memory.creeps_count_by_action[creep.action]--;
        }
    }
};

module.exports = upgrade;