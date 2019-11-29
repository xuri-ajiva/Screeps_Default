let carry = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        let TakeCareOfPet = function (pet) {
            if (creep.store[RESOURCE_ENERGY] < creep.store.getFreeCapacity() * 0.5) {
                if (!GetEnergy(true))
                    return;
            }

            let _pet = Game.creeps[pet];
            if (_pet !== undefined) {
                if (_pet.store[RESOURCE_ENERGY] < _pet.store.getFreeCapacity(RESOURCE_ENERGY)) {
                    if (creep.transfer(_pet, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(_pet);
                    }
                }// else {
                    //creep.say('💚');
                //}
            } else if (!spw.spawning) {
                console.log("removing: " + creep.memory.pet);
                delete creep.memory.pet;
            }
        };

        /**
         * @param {Boolean} container The date
         * @return {boolean}
         */
        let GetEnergy = function (container) {
            if (container) {
                var s = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE)
                            && structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
                if (s) {
                    if (creep.withdraw(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(s);
                        return false;
                    } else {
                        //creep.say('♒');
                        return true;
                    }
                } else {
                    PickupDroppedResources();
                    return false;
                }
            } else {
                PickupDroppedResources();
            }
        };

        let PickupDroppedResources = function () {
            let drop = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (s) => {
                    return s[RESOURCE_ENERGY] >= 30;
                }
            });
            //drop.sort((a,b) => a[RESOURCE_ENERGY] - b[RESOURCE_ENERGY]);
            if (drop) {
                if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(drop);
                }// else {
                    //creep.say('🔼');
                //}
            } else {
                creep.moveTo(spw.pos.x + 3, spw.pos.y + 5);
            }
        };

        /**
         * @return {boolean}
         */
        let DeliverEnergy = function () {
            if (creep.memory.thaget === undefined) {
                let structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 500)
                            || ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 50);
                    }
                });
                if (structures !== undefined && structures !== null) {
                    if (structures) {
                        creep.say('📝');
                        creep.memory.thaget = structures.id;
                    } //else
                        //console.log(str);
                } else {
                    creep.moveTo(spw.pos.x - 7, spw.pos.y + 1);
                    //creep.say('💦');
                    return false;
                }

            }
            let struct = Game.getObjectById(creep.memory.thaget);
            switch (creep.transfer(struct, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(struct);
                    break;
                case OK:
                    //creep.say('💱');
                    delete creep.memory.thaget;
                    break;
                default:
                    //console.log('🚫: ' + creep.transfer(struct, RESOURCE_ENERGY));
                    delete creep.memory.thaget;
                //console.log("switch err: " + creep.transfer(struct, RESOURCE_ENERGY));
            }
            return true;
        };

        switch (creep.memory.init) {
            //init
            case 0:
                creep.memory.init = 2;
                break;
            case 1:
                if (creep.store[RESOURCE_ENERGY] < creep.store.getFreeCapacity())
                    GetEnergy(false);
                else {
                    DeliverEnergy();
                }
            case 2:
                if (creep.memory.pet !== undefined && creep.memory.pet !== null) {
                    creep.say(creep.memory.pet.substr(6));
                    creep.memory.init = 3;
                    break;
                }
                if (Memory.need_energy !== undefined && Memory.need_energy.length > 0) {
                    creep.memory.pet = Memory.need_energy.shift();
                    creep.memory.init = 3;
                }
                creep.memory.init = 1;
                break;
            //if has creep
            case 3:
                if (creep.memory.pet !== undefined) {
                    let _owner = Game.creeps[creep.memory.pet];
                    if (_owner !== undefined) {
                        TakeCareOfPet(creep.memory.pet);
                        break;
                    } else if (!spw.spawning) {
                        console.log("removing my dead owner: " + creep.memory.pet);
                        delete creep.memory.pet;
                    }
                    break;
                } else
                    creep.memory.init = 2;
                break;
            //get creep
            case 4:
                break;
            default:
                creep.memory.init = 0;
                break;
        }
    },

    recycle: function (creep, spw) {
        if (creep.memory.pet) {
            Memory.need_energy.push(creep.memory.pet);
            delete creep.memory.pet;
        }
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        }
    }
};

module.exports = carry;
