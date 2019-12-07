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
                creep.moveTo(creep.room.controller.x + 2,creep.room.controller.y /*, {visualizePathStyle: {stroke: '#ceff01'}}*/);


                if (!creep.memory._count) creep.memory._count = 1; else {
                    if (creep.memory._count > 100) {
                        if (!spw.memory.pets.includes(creep.id))
                            spw.memory.need_energy.push(creep.id);
                        creep.memory._count = 0;
                    }
                    creep.memory._count += 1;
                }
                //creep.say('💤');
            }
        }

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
