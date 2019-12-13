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
                    let need_repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: o => (o.hits*1.2  < o.hitsMax*.9 && o.hits*1.2  < max_hits)});
                    //creep.say(1)
                    if (need_repair){
                        //console.log(need_repair.hitsMax + ' : ' + need_repair.hits + ' : ' + );
                        //creep.say(need_repair.pos.x +' : '+ need_repair.pos.y);
                        creep.memory.target = need_repair.id;}
                    else {
                        require('action.upgrade').run(creep,spw);
                        //creep.moveTo(spw.pos.x - 5, spw.pos.y - 5);
                        break;
                    }
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
