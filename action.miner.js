let miner = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep,spw) {
        //creep.say(creep.store.getFreeCapacity());
        //var sources = creep.room.find(FIND_SOURCES);
        if (creep.memory.count === -1) {
            console.log("suicide");
            creep.suicide();
        } else if (creep.memory.count > 100) {
            let find_sources = creep.room.find(FIND_SOURCES);
            if (find_sources.length > 1)
                for (let s in find_sources)
                    if (find_sources[s].id !== creep.memory.source)
                        creep.memory.source = find_sources[s].id;


            creep.memory.count = -100;
        }

        var source = Game.getObjectById(creep.memory.source);
        var res = creep.harvest(source);
        if (res == ERR_NOT_IN_RANGE) {
            creep.memory.count++;
            //creep.say('⏩');
            creep.moveTo(source/*, {visualizePathStyle: {stroke: '#ffe600'}}*/);
        }
        else {
            //console.log(res);
            //creep.say('⛏');
        }
        creep.drop(RESOURCE_ENERGY);
    }
};

module.exports = miner;