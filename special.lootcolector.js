let looter = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function(creep,spw) {

        switch (creep.memory.init) {
            case 0:
                creep.memory.init = 1;
                break;

            case 1:
                let ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: (structure) => {
                        return structure.store[RESOURCE_ENERGY] > 0;
                    }
                });

                if (ruin === undefined|| ruin === null) {
                    creep.memory.init = 3;
                }

                creep.memory.target = ruin.id;
                creep.memory.init = 2;
                break;
            case 2:
                if (creep.memory.target !== undefined) {
                    let r = Game.getObjectById(creep.memory.target);
                    if (r !== undefined) {
                        creep.drop(RESOURCE_ENERGY);
                        switch (creep.withdraw(r, RESOURCE_ENERGY)) {
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(r);
                                break;
                            case OK:
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                creep.memory.init = 1;
                                delete creep.memory.target;
                                break;
                            default:
                                if (r.store[RESOURCE_ENERGY] === 0) {
                                    creep.memory.init = 1;
                                    delete creep.memory.target;
                                }
                                break;
                        }
                    } else {
                        creep.memory.init = 1;
                    }
                } else {
                    creep.memory.init = 1;
                }
                break;
            case 3:
                if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spw);
                }

                break;
            default:
                creep.memory.init = 0;
                break;

        }
    },


    recycle: function(creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        }
    }


};

module.exports = looter;
