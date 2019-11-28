let carry = {
    run: function (creep) {
        if (creep.lifetime < 10) {
            Memory.need_energy.push(creep.memory.my_proiryty);
            creep.subscribe();
            return;
        }

        /**
         * @return {boolean}
         */
        let TransfereToSpawn = function () {
            if (creep.memory.my_proiryty !== undefined) {
                let _owner = Game.creeps[creep.memory.my_proiryty];
                if (_owner != undefined) {
                    if (_owner.store[RESOURCE_ENERGY] < Memory.Spw.store[RESOURCE_ENERGY]) {
                        return false;
                    }
                }
            }
            //console.log("TransfereSpw: "+Memory.Spw.store[RESOURCE_ENERGY]);
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else return false;
            return true;
        };
        if(creep.memory.my_proiryty !== undefined){
            creep.memory.givestorrage = undefined;
            delete creep.memory.givestorrage;
        }

        if (creep.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity()) {
            if(creep.memory.givestorrage !== undefined) {
                let s = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                         &&  structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (s) {
                    if (creep.transfer(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(s, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            if (TransfereToSpawn()) {
            } else if (creep.memory.my_proiryty !== undefined) {
                let _owner = Game.creeps[creep.memory.my_proiryty];
                if (_owner != undefined) {
                    if (_owner.store[RESOURCE_ENERGY] < _owner.store.getCapacity() / 1.5) {
                        if (creep.transfer(_owner, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(_owner/*, {visualizePathStyle: {stroke: '#02ff00'}}*/);
                        }
                    } else {
                        creep.say('💚');
                    }
                } else if (!Memory.Spw.spawning) {
                    console.log("removing: " + creep.memory.my_proiryty);
                    delete creep.memory.my_proiryty;
                }
                return;
            } else if (Memory.need_energy !== undefined && Memory.need_energy.length > 0) {
                creep.memory.my_proiryty = Memory.need_energy.shift();
                return;
            }

            if (creep.memory.givestorrage !== undefined) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                if (!TransfereToSpawn()) {
                    creep.moveTo(Memory.Spw.pos.x + 2, Memory.Spw.pos.y + 5);
                }
            }
        } else if (creep.store.getFreeCapacity() > 0) {
            var dropp = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            var s = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                      &&  structure.store[RESOURCE_ENERGY] > 50;
                }
            });
            // let res = (Math.random() > .5) s : dropp;
            if (creep.memory.my_proiryty !== undefined && s && s.store[RESOURCE_ENERGY] > 50) {
                if (creep.withdraw(s, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(s/*, {visualizePathStyle: {stroke: '#00ffd2'}}*/);
                    //creep.say('⏩');
                } else {
                    creep.say('♒');
                }
            } else {
                if (dropp) {
                    if (creep.pickup(dropp) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropp/*, {visualizePathStyle: {stroke: '#00ffd2'}}*/);
                        //creep.say('⏩');
                    } else {
                        creep.say('🔼');
                        creep.memory.givestorrage = true;
                    }
                } else {
                    creep.moveTo(Memory.Spw.pos.x + 3, Memory.Spw.pos.y + 5);
                }
            }
        } else {
            //creep.say('✔');
        }
    }
};

module.exports = carry;