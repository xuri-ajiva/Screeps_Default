const max_hits = 100000;
let repair = {

    repairRoads: function (spw, room) {
        let road = room.find(FIND_STRUCTURES, {filter: o => (o.hits * 1.2 < o.hitsMax * .9 && o.hits * 1.2 < max_hits) && o.structureType === STRUCTURE_ROAD});

        //if (spw.memory.paths) {
        //    if (road.length > 0) {
        //        for (let ro in road) {
        //            if (spw.memory.paths.includes(road[ro].pos)) {
        //                return road[ro].id;
        //            }
        //        }
        //    } else
        //        return undefined;
        //} else
        return road[0].id;
    },

    /** @param {Creep} creep
     **/
    run: function (creep, spw) {
        //creep.say('⬇');

        // creep.memory.init = 0;
        // delete creep.memory.target_rs
        // delete creep.memory.target_r;

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
                if (creep.memory.target_r === undefined) {
                    let need_repair = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: o => (o.hits * 1.2 < o.hitsMax * .9 && o.hits * 1.2 < max_hits) && o.structureType !== STRUCTURE_ROAD});
                    //creep.say(1)
                    if (need_repair) {
                        //console.log(need_repair.hitsMax + ' : ' + need_repair.hits + ' : ' + );
                        //creep.say(need_repair.pos.x +' : '+ need_repair.pos.y);
                        creep.memory.target_r = need_repair.id;
                    } else {
                        let rep = this.repairRoads(spw, creep.room);
                        if (rep !== undefined) {
                            creep.memory.target_r = rep.id;
                        } else {
                            require('action.upgrade').run(creep, spw);
                            //creep.moveTo(spw.pos.x - 5, spw.pos.y - 5);
                            break;
                        }
                    }
                } else {
                    delete creep.memory.target_r;
                }
                creep.memory.init = 3;
                break;
            case 3:
                let target_r = Game.getObjectById(creep.memory.target_r);
                if (target_r !== undefined && target_r !== null && (target_r.hits !== target_r.hitsMax && target_r.hits < max_hits)) {
                    if (creep.repair(target_r) === ERR_NOT_IN_RANGE)
                        creep.moveTo(target_r);
                    else {
                        creep.moveTo(target_r.x + 2, target_r.y);
                        //creep.say('🔧: ' + target_r.hits);
                    }
                } else {
                    delete creep.memory.target_r;
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
