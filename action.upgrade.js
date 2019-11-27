let upgrade = {
    run: function (creep) {
        //creep.store.energy = 0;
        if (creep.store[RESOURCE_ENERGY] > 0) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ceff01'}});
            }
        } else {
            if (creep.memory.has_worker == false || creep.memory.has_worker == undefined) {
                if (Memory.ftee_carry.length > 0) {
                    let t = Memory.ftee_carry[0];
                    t.memory._owner = creep.name;
                    creep.memory.has_worker = true;
                    creep.memory.worker = t.name;
                    creep.say("found on ❤");
                }
            }else{
               creep.say('💤 Waiting');
            }
        }
    }
};
module.exports = upgrade;
