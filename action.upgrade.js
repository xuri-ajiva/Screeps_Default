let upgrade = {
    run: function (creep) {
        //creep.store.energy = 0;
        if (creep.store[RESOURCE_ENERGY] > 0) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ceff01'}});
            }
        }else{
            creep.say('💤');
        }
    }
};
module.exports = upgrade;
