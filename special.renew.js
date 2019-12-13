const max_hp = 2000;
const rey_rec = 'rec';
const rey_ren = 'ren';


let renew = {
    /** @param {Creep} creep
     **/
    reNewCreep(creep, spw) {
        if (creep.ticksToLive <= 5) {
            creep.memory.renew = 6;
        }

        switch (creep.memory.renew) {
            case 0:
                if (creep.memory.action === 'attack') {
                    if (creep.room.find(FIND_HOSTILE_CREEPS).length === 0) {
                        creep.memory.rey = rey_rec;
                        spw.memory.creeps_count_by_action[creep.memory.action]--;
                    }
                } else if (creep.body.length < 6 && spw.room.energyAvailable > 500 && spw.room.energyAvailable > spw.room.energyCapacityAvailable * .7) {
                    creep.memory.rey = rey_rec;
                    spw.memory.creeps_count_by_action[creep.memory.action]--;
                } else {
                    creep.memory.rey = rey_ren;
                }
                creep.memory.renew = 1;
                creep.memory.path_to_spawn = creep.pos.findPathTo(spw.pos).length;
                break;
            case  1:
                //creep.say('⏩',true);
                creep.memory.path_to_spawn--;
                creep.moveTo(spw);
                if (creep.memory.path_to_spawn === -3)
                    creep.memory.renew = 2;
                break;
            case 2:
                if (spw.room.energyAvailable < 500) {
                    creep.transfer(spw, RESOURCE_ENERGY);
                }
                //let res = spw.room.energyCapacityAvailable < 500 ? spw.recycleCreep(creep) : spw.renewCreep(creep);
                let res = creep.memory.rey === rey_ren ? spw.renewCreep(creep) : spw.recycleCreep(creep);
                //creep.say('✳',true);
                switch (res) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(spw);
                        break;
                    case ERR_FULL:
                        creep.memory.renew = 3;
                        break;
                    case  ERR_BUSY:
                        creep.moveTo(spw.pos.x + 4, spw.pos.y - 4);
                    case ERR_NOT_ENOUGH_ENERGY:
                        if (creep.store[RESOURCE_ENERGY] > 0)
                            creep.transfer(spw, RESOURCE_ENERGY);
                        break;
                    default:
                        break;
                }
                break;
            case 3:
            case 4:
            case 5:
                creep.moveTo(spw.pos.x - 5, spw.pos.y + 5);
                creep.memory.renew++;
                break;
            case  6:
                delete creep.memory.rey;
                delete creep.memory.renew;
                delete creep.memory.path_to_spawn;
                delete creep.memory.renew;
                break;
            default:
                creep.memory.renew = 0;
                break;
        }
    },
    recycle: function (creep, spawn) {
        if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        } else {
            console.log("resycle: " + creep.name);
        }
    }


};
module.exports = renew;