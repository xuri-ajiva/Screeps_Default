let upgrade = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        //Memory.stats.push("begin: " + creep.name + ": " + Game.cpu.getUsed() );let c_this = Game.cpu.getUsed();
        //creep.say('⬇');
        //creep.store.energy = 0;

        if (!creep.spawning) {
            //Memory.stats.push("if 1: " + (Game.cpu.getUsed() - c_this) );c_this = Game.cpu.getUsed();
            if (creep.store[RESOURCE_ENERGY] > 0) {

                //Memory.stats.push("if 2: " + (Game.cpu.getUsed() - c_this) );c_this = Game.cpu.getUsed();
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    //Memory.stats.push("if 3: " + (Game.cpu.getUsed() - c_this) );c_this = Game.cpu.getUsed();
                    creep.moveTo(creep.room.controller/*, {visualizePathStyle: {stroke: '#ceff01'}}*/);
                    c_this = Game.cpu.getUsed();
                }
                //creep.say('🔝')
            } else {
                //Memory.stats.push("else: " + (Game.cpu.getUsed() - c_this) );c_this = Game.cpu.getUsed();
                creep.moveTo(creep.room.controller/*, {visualizePathStyle: {stroke: '#ceff01'}}*/);

                //creep.say('💤');
            }
        }

        //Memory.stats.push("end: " + creep.name + ": " + + (Game.cpu.getUsed() - c_this)  );
    },

    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        } else {
            Memory.creeps_count_by_action[creep.action]--;
        }
    }
};
module.exports = upgrade;
