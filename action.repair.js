const max_hits = 100000;
let repair = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        //creep.say('⬇');

        if (!creep.spawning && creep.store[RESOURCE_ENERGY] === 0) {
            if (!creep.memory._count)
                creep.memory._count = 1; else {
                if (creep.memory._count > 100) {
                    if (!Memory.pets.includes(creep.id))
                        Memory.need_energy.push(creep.id);
                    creep.memory._count = 0;
                }
                creep.memory._count += 1;
            }

            return;
        }
        // creep.memory.init = 0;
        // delete creep.memory.targets
        // delete creep.memory.target;
        switch (creep.memory.init) {
            case  0:
                creep.memory.init = 1;
                break;
            case  1:
                creep.memory.init = 2;
                creep.moveTo(spw.x - 8, spw.y + 3);
            //break;
            case  2:
                //if (creep.memory.targets.length > 0) {
                if (creep.memory.target === undefined) {
                    let need_repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: object => ((object.hits < max_hits) && (object.hits < object.hitsMax))});

                    if (need_repair)
                        creep.memory.target = need_repair.id;
                    else
                        creep.moveTo(spw.pos.x - 4, spw.pos.y - 4);
                } else {
                    delete creep.memory.target;
                }
                creep.memory.init = 3;
                //} else {
                //creep.memory.init = 1;
                break;
            //}
            case  3:
                let target = Game.getObjectById(creep.memory.target);
                if (target !== undefined && target !== null && (target.hits !== target.hitsMax && target.hits < max_hits)) {
                    if (creep.repair(target) === ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                    else {
                        creep.moveTo(target.x - 2, target.y - 2);
                        //creep.say('🔧: ' + target.hits);
                    }
                } else {
                    delete creep.memory.target;
                    creep.memory.init = 2;
                }
                break;
            default:
                creep.memory.init = 0;
                break
        }
    },

    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        } else {
            Memory.creeps_count_by_action[creep.action]--;
        }
    }
};
module.exports = repair;
