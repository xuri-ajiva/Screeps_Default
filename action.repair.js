const max_hits = 100000;
let repair = {
    /** @param {Creep} creep
     **/
    run: function (creep, spw) {
        //creep.say('⬇');

        // creep.memory.init = 0;
        // delete creep.memory.targets
        // delete creep.memory.target;

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
                if (creep.memory.target === undefined) {
                    let need_repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: object => ((object.hits < max_hits) && (object.hits < object.hitsMax))});

                    if (need_repair)
                        creep.memory.target = need_repair.id;
                    else
                        creep.moveTo(spw.pos.x - 5, spw.pos.y - 5);
                } else {
                    delete creep.memory.target;
                }
                creep.memory.init = 3;
                break;
            case 3:
                let target = Game.getObjectById(creep.memory.target);
                if (target !== undefined && target !== null && (target.hits !== target.hitsMax && target.hits < max_hits)) {
                    if (creep.repair(target) === ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                    else {
                        creep.moveTo(target.x + 2, target.y);
                        //creep.say('🔧: ' + target.hits);
                    }
                } else {
                    delete creep.memory.target;
                    creep.memory.init = 2;
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
module.exports = repair;
