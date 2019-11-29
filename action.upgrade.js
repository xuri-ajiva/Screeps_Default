let upgrade = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep,spw) {
        //creep.store.energy = 0;
        if (creep.store && creep.store[RESOURCE_ENERGY] > 0) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ceff01'}});
            }
            //creep.say('🔝')
        }else{
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ceff01'}});
            //creep.say('💤');
        }
    },

    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        }
    }
};
module.exports = upgrade;
