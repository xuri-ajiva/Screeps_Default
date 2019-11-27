let carry = {
        run: function (creep) {
            if (creep.lifetime < 10) {
                Memory.need_energy.push(my_proiryty);
                creep.subscribe();
                return;
            }

            function TransfereToSpawn() {
                //console.log("TransfereSpw: "+Memory.Spw.store[RESOURCE_ENERGY]);
                if (Memory.Spw.store[RESOURCE_ENERGY] < 250) {
                    if (creep.transfer(Memory.Spw, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Memory.Spw, {visualizePathStyle: {stroke: '#0093ff'}});
                        creep.say('↩');
                    } else {
                        creep.say('⚡');
                    }
                }
            }

            if (creep.store[RESOURCE_ENERGY] > 0) {
                if (creep.memory.my_proiryty != undefined) {
                    let _owner = Game.creeps[creep.my_proiryty];
                    if (_owner != undefined) {
                        if (_owner.store[RESOURCE_ENERGY] < _owner.store.getCapacity() / 2) {
                            if (creep.transfer(_owner, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(_owner, {visualizePathStyle: {stroke: '#02ff00'}});
                            }
                        }
                    } else if(Memory.Spw.spawning){
                        delete creep.memory.my_proiryty;
                    }
                    return;
                } else if (Memory.need_energy.length > 0) {
                    creep.memory.my_proiryty = Memory.need_energy.shift();
                } else {
                    TransfereToSpawn();
                    return;
                }
            }
            if (creep.store.getFreeCapacity() > 0) {
                var dropps = creep.room.find(FIND_DROPPED_RESOURCES);
                if (dropps.length == 0) {
                    creep.say('✔');
                } else {
                    if (creep.pickup(dropps[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropps[0], {visualizePathStyle: {stroke: '#00ffd2'}});
                        creep.say('⏩');
                    } else {
                        creep.say('🔼');
                    }
                }
            }
        }


    }
;

module.exports = carry;