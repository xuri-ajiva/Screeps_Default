let miner = {
        /** @param {Creep} creep
         *  @param {Spawn} spw
         **/
        run: function (creep, spw) {
            function switchsource() {
                let find_sources = creep.room.find(FIND_SOURCES);
                if (find_sources.length > 1) {
                    for (let s in find_sources) {
                        if (find_sources[s].id !== creep.memory.source) {
                            console.log(creep.memory.source + ' -> ' + find_sources[s].id);
                            creep.memory.source = find_sources[s].id;
                        }
                    }
                }
            }

            switch (creep.memory.count) {
                case  100:
                    switchsource();
                    creep.memory.count = -1000 - (creep.pos.findPathTo(Game.getObjectById(creep.memory.source)) + 10);
                    break;
                case  -1000:
                    switchsource();
                    creep.memory.count = -(creep.pos.findPathTo(Game.getObjectById(creep.memory.source)) + 10);
                    break;
                case  -1:
                    //delete Memory.need_energy[Memory.need_energy.findIndex(creep.memory.pet)];
                    if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spw);
                    }
                    return;
                case  undefined:
                    creep.memory.count = 0;
                default:
            }

            let source = Game.getObjectById(creep.memory.source);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.memory.count++;
                creep.moveTo(source/*, {visualizePathStyle: {stroke: '#ffe600'}}*/);
            }
            //case OK:
            //creep.say('⛏');
            //    break;

            creep.drop(RESOURCE_ENERGY);
        },

        recycle: function (creep, spw) {
            if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spw);
            }
        }
    }
;

module.exports = miner;