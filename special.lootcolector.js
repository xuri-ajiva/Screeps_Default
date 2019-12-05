let looter = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        switch (creep.memory.init) {
            case 0:
                creep.memory.init = 1;
                break;

            case 1:
                let ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: (structure) => {
                        return structure.store.getUsedCapacity() > 0;
                    }
                });


                if (ruin === undefined) {
                    ruin = spw.room.find(FIND_TOMBSTONES, {
                        filter: (structure) => {
                            return structure.owner !== spw.owner && structure.store.getUsedCapacity() > 0;
                        }
                    });
                    if (ruin === undefined || ruin === null || ruin.length === 0) {
                        creep.memory.init = 3;
                        return;
                    }
                }

                if (ruin)
                    creep.memory.target = ruin[0].id;
                else
                    creep.memory.init = 3;
                creep.memory.init = 2;
                break;
            case 2:
                if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.init = 4;
                }
                if (creep.memory.target !== undefined) {
                    let r = Game.getObjectById(creep.memory.target);
                    if (r !== undefined) {
                        creep.drop(RESOURCE_ENERGY);
                        for (let rs in RESOURCES_ALL)
                            switch (creep.withdraw(r, RESOURCES_ALL[rs])) {
                                case ERR_NOT_IN_RANGE:
                                    creep.moveTo(r);
                                    return;
                                case OK:
                                    return;
                                case ERR_NOT_ENOUGH_RESOURCES:
                                    continue;
                                default:
                                    delete creep.memory.target;
                                    break;
                            }
                    }
                }
                creep.memory.init = 1;
                break;
            case 3:
                if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spw);
                } else {
                    console.log('resycle: ' + creep.name);
                }
                break;
            case 4:
                let t = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => ((s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER) && s.store.getFreeCapacity() > creep.store.getUsedCapacity())});
                creep.memory.tar = t.id;
                creep.memory.init = 5;
                break;
            case 5:
                let _s = Game.getObjectById(creep.memory.tar);
                if (_s) {
                    if (creep.transfer(_s) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(_s);
                    } else {
                        creep.memory.init = 2;
                    }
                } else {
                    creep.memory.init = 4;
                }
                break;
            default:
                creep.memory.init = 0;
                break;

        }
    },


    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        }
    }


};

module.exports = looter;
