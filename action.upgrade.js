let upgrade = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        //Memory.stats.push("begin: " + creep.name + ": " + Game.cpu.getUsed() );let c_this = Game.cpu.getUsed();
        //creep.say('⬇');
        //creep.store.energy = 0;
        if (creep.spawning) return;
        if(creep.room.controller.level == 8 && creep.room.controller.ticksToDowngrade >= 100000){
            creep.moveTo(spw.pos.x, spw.pos.y+5);
            return; 
        }  

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
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                    c_this = Game.cpu.getUsed();
                }
                break;


            default:
                creep.memory.init = 0;
                break;
        }
        if (creep.store[RESOURCE_ENERGY] === 0) creep.memory.init = 1;
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && creep.memory.init === 1) creep.memory.init = 2;

        //Memory.stats.push("end: " + creep.name + ": " + + (Game.cpu.getUsed() - c_this)  );
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
