const max_hp = 2000;

let renew = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    reNewCreep(creep, spw) {
        if (creep.ticksToLive <= 5){
            creep.memory.renew = 6;
        }

        switch (creep.memory.renew) {
            case 0:
                //creep.memory._beg = creep.ticksToLive;
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
                //creep.say('✳',true);
                switch (spw.renewCreep(creep)) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(spw);
                        break;
                    case ERR_FULL:
                        creep.memory.renew = 3;
                        break;
                    case  ERR_BUSY:
                        creep.moveTo(spw.pos.x - 5, spw.pos.y + 5);
                    case ERR_NOT_ENOUGH_ENERGY:
                        if(creep.store[RESOURCE_ENERGY] > 0)
                            creep.transfer(spw,RESOURCE_ENERGY);
                        break;
                    default:
                        break;
                }
                break;
            case 3:
            case 4:
            case 5:
                creep.moveTo(spw.pos.x - 5, spw.pos.y + 5);
                creep.memory.renew++
                break;
            case  6:
                delete creep.memory._beg;
                delete creep.memory.renew;
                delete creep.memory.path_to_spawn;
                delete creep.memory.renew;
                break
            default:
                creep.memory.renew = 0;
                break;
        }
    }


};
module.exports = renew;