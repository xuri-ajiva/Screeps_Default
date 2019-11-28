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
                }
                else return  false;
                return  true;
            };

            if (creep.store[RESOURCE_ENERGY] > 0) {
                if (TransfereToSpawn()) {
                    return;
                }
                if (creep.memory.my_proiryty !== undefined) {
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
                } else {
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
                    
                    TransfereToSpawn();
                    return;
                }
            }
            if (creep.store.getFreeCapacity() > 0) {
                var dropp = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (dropp) {
                    if (creep.pickup(dropp) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropp/*, {visualizePathStyle: {stroke: '#00ffd2'}}*/);
                        //creep.say('⏩');
                    } else {
                        creep.say('🔼');
                    }
                } else {
                    let s = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }});
                    if (s[0].transfer(creep,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(s/*, {visualizePathStyle: {stroke: '#00ffd2'}}*/);
                        //creep.say('⏩');
                    } else {
                        creep.say('⚛');
                    }
                    //creep.say('✔');
                }
            }
        }


    }
;

module.exports = carry;