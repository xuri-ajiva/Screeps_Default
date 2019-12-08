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

        //if(creep.body.includes(HEAL)){
        if (creep.hits < creep.hitsMax) {
            creep.say('🩸',true);
            creep.heal(creep);
        }
        //}

        switch (creep.memory.p) {
            case -1:
                for (let x = 0; x < 3; x++) {
                    creep.moveTo(flag);
                }

                if (creep.room === flag.room) {
                    creep.say('Yay', true);
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
                        if (Memory.target)
                            creep.memory.target = Memory.target;


                        let tanks = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType !== STRUCTURE_EXTENSION && (s.store) && s.store[RESOURCE_ENERGY] && s.store[RESOURCE_ENERGY] > 0 && !s.my});
                        creep.say(tanks.length + '🎟', true);
                        if (tanks.length) {
                            creep.memory.target = tanks[0].id;
                            creep.memory.init = 2;
                        } else {
                            creep.memory.init = 3;
                        }
                        break;
                    case 2:
                        //creep.memory.init = 5;
                        if (creep.store.getFreeCapacity() === 0 || creep.lifetime < 750) {
                            creep.memory.init = 5;
                            creep.say('full: ' + creep.store[RESOURCE_ENERGY]);
                            break;
                        }
                        if (creep.memory.target !== undefined) {
                            let r = Game.getObjectById(creep.memory.target);
                            if (r !== undefined) {
                                for (let rs in RESOURCES_ALL)
                                    switch (creep.withdraw(r, RESOURCES_ALL[rs])) {
                                        case ERR_NOT_IN_RANGE:
                                            //creep.say('',true);
                                            creep.moveTo(r.pos.x,r.pos.y);
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
                    case 5:
                        //Game.getObjectById(creep.memory.spawn).recycleCreep(creep);
                        creep.moveTo(Game.getObjectById(creep.memory.spawn));
                        if (creep.room === Game.getObjectById(creep.memory.spawn).room) {
                            creep.memory.init = 6;
                            delete creep.memory.target;
                            let renewer = require('special.renew');
                            renewer.reNewCreep(creep, Game.getObjectById(creep.memory.spawn));
                        }
                        break;
                    case 6:
                        //creep.memory.init = 5;
                        creep.say('6: ' + Game.getObjectById(creep.memory.spawn).room);
                        let carry = require('action.carry');
                        carry.DeliverEnergy(creep, Game.getObjectById(creep.memory.spawn));
                        if (creep.store[RESOURCE_ENERGY] === 0) {
                            creep.memory.p = 0;
                            creep.memory.init = 1;
                        }
                        break;
                    default:
                        creep.memory.init = 0;
                        creep.memory.p = -1;
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