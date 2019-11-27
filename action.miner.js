let miner = {
    /** @param {Creep} creep **/
    run: function (creep) {
        //creep.say(creep.store.getFreeCapacity());
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(/*Memory.SW*/sources[0]) == ERR_NOT_IN_RANGE) {
            //creep.harvest(/*Memory.SW*/sources[1]);
            creep.say('⏩');
            creep.moveTo(/*Memory.SW*/sources[0], {visualizePathStyle: {stroke: '#ffe600'}});
        } else {
            creep.say('💥');
        }
        creep.drop(RESOURCE_ENERGY);
    }
};

module.exports = miner;