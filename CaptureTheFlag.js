module.exports = {
    setPath: function (flag, spw) {
        let goals = _.map(Game.flags[flag], function (f) {
            // We can't actually walk on sources-- set `range` to 1
            // so we path next to it.
            return {pos: f.pos, range: 1};
        });

        let ret = PathFinder.search(
            spw.pos, goals,
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 2,
                swampCost: 10,

                roomCallback: function (roomName) {

                    let room = Game.rooms[roomName];
                    // In this example `room` will always exist, but since
                    // PathFinder supports searches which span multiple rooms
                    // you should be careful!
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;

                    room.find(FIND_STRUCTURES).forEach(function (struct) {
                        if (struct.structureType === STRUCTURE_ROAD) {
                            // Favor roads over plain tiles
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)) {
                            // Can't walk through non-walkable buildings
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        } else if (struct.structureType === STRUCTURE_WALL) {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });

                    return costs;
                },
            }
        );
        Memory.pathw = ret;
    },

    move(creep) {
        let flag = Game.flags['Flag1'];

        switch (creep.memory.p) {
            case -1:
                for (let x = 0; x < 10; x++) {
                    creep.moveTo(flag);
                }
                creep.say('Yay', true);
                if (creep.room === flag.room) {
                    creep.memory.p = 1;
                }

                break;
            case  1:
                switch (creep.memory.init) {
                    case 0:
                        creep.memory.init = 1;
                        break;
                    case 1:
                        if (creep.memory.target === undefined) {
                            creep.memory.target = '';
                        }
                        creep.memory.target = Memory.target;
                        let ruin = creep.room.find(FIND_RUINS, {filter: (s) => s.store.getUsedCapacity() > 0});
                        if (!ruin)
                            ruin = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.store.getUsedCapacity() > 0});
                        creep.say(ruin.length + '🎗', true);
                        if (ruin === undefined) {

                        }
                        ruin = flag.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType !== STRUCTURE_SPAWN && structure.owner !== Game.spawns['Spawn1'].owner;
                            }
                        });
                        creep.say(ruin.length + '🎟', true);
                        if (ruin === undefined || ruin === null || ruin.length === 0) {
                            return;
                        }

                        if (ruin[0])
                            creep.memory.target = ruin[0].id;
                        else
                            creep.memory.init = 3;
                        creep.memory.init = 2;
                        break;
                    case 2:
                        if (creep.store.getFreeCapacity() == 0) {
                            creep.drop(RESOURCE_ENERGY);
                        }
                        if (creep.memory.target !== undefined) {
                            let r = Game.getObjectById(creep.memory.target);
                            if (r !== undefined) {
                                for (let rs in RESOURCES_ALL)
                                    switch (creep.withdraw(r, RESOURCES_ALL[rs])) {
                                        case ERR_NOT_IN_RANGE:
                                            creep.moveTo(r);
                                            return;
                                        case OK:
                                            creep.attack(r);
                                            return;
                                        case ERR_NOT_ENOUGH_RESOURCES:
                                            continue;
                                        default:
                                            creep.moveTo(r);
                                            creep.say(creep.withdraw(r, RESOURCES_ALL[rs]), true);
                                            //delete creep.memory.target;
                                            break;
                                    }
                            }
                        } else {
                            creep.say('🎞')
                        }
                        creep.memory.init = 1;
                        break;
                    case 4:
                        creep.drop(RESOURCE_ENERGY);
                        break;
                    default:
                        creep.memory.init = 0;
                        break;

                }

                break;
            default:
                creep.memory.ps = 0;
                creep.memory.p = -1;
                break;
        }

    }


};