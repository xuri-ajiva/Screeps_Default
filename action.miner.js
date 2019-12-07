let miner = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw, dropp) {
        function switchsource() {
            let find_sources = creep.room.find(FIND_SOURCES);
            if (find_sources.length > 1) {
                for (let s in find_sources) {
                    if (find_sources[s].id !== creep.memory.source) {
                        console.log(creep.name + ': ' + creep.memory.source + ' -> ' + find_sources[s].id);
                        creep.memory.source = find_sources[s].id;
                        return;
                    }
                }
            }
        }

        switch (creep.memory.count) {
            case  100:
                switchsource();
                creep.memory.count = 100 - (creep.pos.findPathTo(Game.getObjectById(creep.memory.source)) + 30);
                return;
            case  undefined:
                creep.memory.count = 0;
            default:
        }

        if (!creep.memory.source) {
            creep.memory.source = 'init';
            switchsource();
        }
        let source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.memory.count++;
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffe600'}});
        }else{
            creep.memory.count = 0;
        }
        //case OK:
        //creep.say('⛏');
        //    break;

        if (dropp === undefined)
            creep.drop(RESOURCE_ENERGY);
    },

    recycle: function (creep, spw) {
        if (!creep.memory._hasrep) {
            if (!spw.spawning) {
                let summoner = require('spawer');
            }
        }
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        } else {
            spw.memory.creeps_count_by_action[creep.action]--;
        }
    }
};

module.exports = miner;