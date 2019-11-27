let carry = {
    run: function (creep) {
        function TransfereToSpawn() {
            if (creep.transfer(Memory.Spw, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Memory.Spw, {visualizePathStyle: {stroke: '#0093ff'}});
                creep.say('↩ Return');
            } else {
                creep.say('⚡ transfer');
            }
        }

        if (creep.store[RESOURCE_ENERGY] > 0) {
            if (creep.memory._owner != undefined) {
                let _owner = Game.creeps[creep.memory._owner];
                if (_owner) {
                    if (_owner.store[RESOURCE_ENERGY] < _owner.store.getCapacity() / 2) {
                        if (creep.transfer(_owner, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(_owner, {visualizePathStyle: {stroke: '#02ff00'}});
                        }
                    }
                    return;
                }
            }
        }
        if (creep.store.getFreeCapacity() > 0) {
            var dropps = creep.room.find(FIND_DROPPED_RESOURCES);
            if (dropps.length == 0) {
                creep.say('✔ Ready');
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    TransfereToSpawn();
                }
            } else {
                if (creep.pickup(dropps[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropps[0], {visualizePathStyle: {stroke: '#00ffd2'}});
                    creep.say('⏩ Moving');
                } else {
                    creep.say('🔼 Pickup');
                }
            }
        } else {
            TransfereToSpawn();
        }
    }


};

module.exports = carry;