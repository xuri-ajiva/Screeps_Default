let miner = {
    /** @param {Creep} creep **/
    run: function (creep) {
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
            // else if (res == ERR_NOT_ENOUGH_EXTENSIONS) {
            //     var sources = creep.room.find(FIND_SOURCES);
            //     if (sources.length > 1) {
            //         for (let s in sources) {
            //             var so = sources[s];
            //             if (so.energy > 1000) {
            //                 if (creep.harvest(so) == ERR_NOT_IN_RANGE) {
            //                     creep.moveTo(so, {visualizePathStyle: {stroke: '#ffe600'}});
            //                 }
            //             }
            //         }
            //     }
        // }
        else {
            //console.log(res);
            //creep.say('⛏');
        }
        creep.drop(RESOURCE_ENERGY);
    }
};

module.exports = miner;