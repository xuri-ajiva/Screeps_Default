let carry = {
    /**
     * @param {Creep} creep
     * @param {Spawn} spw
     **/
    run: function (creep, spw, doNotGetBackInRoom) {
        if (creep.room !== spw.room && !doNotGetBackInRoom) {
            creep.say('fail');
            creep.moveTo(spw);
            return;
        }
        switch (creep.memory.init) {
            //init
            case 0:
                creep.memory.init = 2;
                break;
            case 1:
                if (creep.store[RESOURCE_ENERGY] < creep.store.getFreeCapacity())
                    this.GetEnergy(creep, spw, false);
                else {
                    this.DeliverEnergy(creep, spw);
                }
                break;
            case 2:
                if (creep.memory.pet !== undefined && creep.memory.pet !== null) {
                    //creep.say(creep.memory.pet.substr(7));
                    creep.memory.init = 3;
                    break;
                }
                if (spw.memory.need_energy !== undefined && spw.memory.need_energy.length > 0) {
                    creep.memory.pet = spw.memory.need_energy.shift();
                    creep.memory.init = 3;
                }
                creep.memory.init = 1;
                break;
            //if has creep
            case 3:
                if (creep.memory.pet !== undefined) {
                    let _owner = Game.getObjectById(creep.memory.pet);
                    if (_owner !== undefined || _owner != null) {
                        this.TakeCareOfPet(creep, spw, creep.memory.pet);
                        break;
                    } else if (!spw.spawning) {
                        console.log("removing my dead owner: " + creep.memory.pet);
                        delete creep.memory.pet;
                    }
                    break;
                } else
                    creep.memory.init = 2;
                break;
            default:
                creep.memory.init = 0;
                break;
        }
    },

    /**
     *  @param {Creep} creep
     * **/
    MoveToWhile: function (creep, location) {
        if (creep.fatigue === 0)
            creep.moveTo(location);
    },
    /**
     * @param {Creep} creep
     * @param {Spawn} spw
     **/
    TakeCareOfPet: function (creep, spw, pet) {
        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity(RESOURCE_ENERGY) * .9) {
            if (!this.GetEnergy(creep, spw, true))
                return;
        }

        let _pet = Game.getObjectById(pet);
        if (_pet !== undefined && _pet != null) {
            if (_pet.store[RESOURCE_ENERGY] < _pet.store.getCapacity(RESOURCE_ENERGY) * .9) {
                if (creep.transfer(_pet, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.MoveToWhile(creep, _pet)
                }
            } else {
                creep.moveTo(_pet);
            }
            //else {creep.say('💚');}
        } else if (!spw.spawning) {
            if (!Game.getObjectById(pet)) {
                console.log("❌ " + creep.memory.pet);
                delete creep.memory.pet;
            }
        }
    },

    /**
     * @param {Creep} creep
     * @param {Spawn} spw
     * @param {Boolean} container The date
     * @return {boolean}
     */
    GetEnergy: function (creep, spw, container,doNotGetBackInRoom) {
        if (creep.room !== spw.room && !doNotGetBackInRoom) {
            creep.say('fail');
            creep.moveTo(spw);
            return false;
        }
        if (container) {
            let s = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_LINK)
                        && s.store[RESOURCE_ENERGY] > 0 && s.id !== creep.memory.pet;
                }
            });
            if (s) {
                if (creep.withdraw(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.MoveToWhile(creep, s);
                    return false;
                } else {
                    //creep.say('♒');
                    return true;
                }
            } else {
                this.PickupDroppedResources(creep, spw);
                return false;
            }
        } else {
            this.PickupDroppedResources(creep, spw);
        }
    },

    /**
     * @param {Creep} creep
     * @param {Spawn} spw
     **/
    PickupDroppedResources: function (creep, spw) {
        if (creep.memory._dropp === undefined) {
            let drop = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (s) => {
                    return s[RESOURCE_ENERGY] >= 50;
                }
            });

            var dropenergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (d) => d.amount >= 500
            });
            if (dropenergy && dropenergy.length > 0) {
                dropenergy.sort((a, b) => a[RESOURCE_ENERGY] - b[RESOURCE_ENERGY])
                drop = dropenergy[0];
            }
            if (drop)
                creep.memory._dropp = drop.id;
        }
        let _drop = Game.getObjectById(creep.memory._dropp);

        //drop.sort((a,b) => a[RESOURCE_ENERGY] - b[RESOURCE_ENERGY]);
        if (_drop) {
            if (creep.pickup(_drop) == ERR_NOT_IN_RANGE) {
                this.MoveToWhile(creep, _drop);
            }// else {                creep.say('🔼');            }
        } else {
            delete creep.memory._dropp;
            creep.moveTo(spw.pos.x - 5, spw.pos.y);
        }
    },

    /**
     * @param {Creep} creep
     * @param {Spawn} spw
     * @return {boolean}
     */
    DeliverEnergy: function (creep, spw) {
        creep.say('➡');
        if (creep.memory.thaget === undefined) {
            let structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 500)
                        || ((structure.structureType == STRUCTURE_SPAWN/* || structure.structureType == STRUCTURE_EXTENSION*/) && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 50);
                }
            });
            if (structures !== undefined && structures != null) {
                if (structures) {
                    //creep.say('📝');
                    creep.memory.thaget = structures.id;
                } //else
                //console.log(str);
            } else {
                creep.moveTo(spw.pos.x - 5, spw.pos.y);
                //creep.say('💦');
                return false;
            }

        }
        let struct = Game.getObjectById(creep.memory.thaget);
        switch (creep.transfer(struct, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                this.MoveToWhile(creep, struct);
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
    },

    recycle: function (creep, spw) {
        if (creep.memory.pet) {
            spw.memory.need_energy.push(creep.memory.pet);
            delete creep.memory.pet;
        }
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            this.MoveToWhile(creep, spw);
        } else {
            spw.memory.creeps_count_by_action[creep.action]--;
        }
    }
};

module.exports = carry;
