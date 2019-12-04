const size = 10;
const min = 5;
const max = 50 - min;

module.exports = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        creep.say('💚');

        if (creep.memory.init !== undefined)
            switch (creep.memory.init) {
                case 0:
                    creep.memory.init = 1;
                    break;

                case 1:
                    //creep.say('lila');
                    if (spw.room.energyAvailable < spw.room.energyCapacityAvailable) {
                        if (creep.store.getFreeCapacity() !== 0) {
                            creep.memory.init = 2;
                        } else {
                            creep.memory.init = 3;
                        }
                        //creep.memory.init = 10;
                    }
                    break;
                case 2:
                    //creep.say('blue');
                    if (creep.store.getFreeCapacity() === 0) {
                        creep.memory.init = 3;
                    }
                    let carry = require('action.carry');
                    if (carry.GetEnergy(creep, spw, true)) {
                        return;
                    }
                    break;

                case 3:
                    //creep.say('brown');
                    if (creep.store[RESOURCE_ENERGY] === 0) {
                        creep.memory.init = 2;
                        return;
                    }
                    if (spw.room.energyAvailable < spw.room.energyCapacityAvailable) {
                        if (creep.memory.targets && creep.memory.targets.length > 0) {
                            if (creep.memory.target === undefined) {
                                creep.memory.target = creep.memory.targets.pop();
                            }
                            //while (creep.memory.target['energy'] === 50) {
                            //    if (creep.memory.targets.length > 0)
                            //        creep.memory.target = creep.memory.targets.pop();
                            //    else {
                            //        creep.memory.init = 10;
                            //        return;
                            //    }
                            //}
                            let _t = Game.getObjectById(creep.memory.target['struct']);
                            creep.say(_t.pos.x + '|' + _t.pos.y);

                            switch (creep.transfer(_t, RESOURCE_ENERGY)) {
                                case ERR_NOT_IN_RANGE:
                                    creep.moveTo(_t);
                                    break;
                                case ERR_FULL:
                                    delete creep.memory.target;
                                    break;
                            }
                        } else {
                            creep.memory.init = 10;
                            return;
                        }
                    } else {
                        creep.memory.init = 1;
                    }

                    break;

                case 10:
                    //creep.say('🔀');
                    creep.memory.targets = [];
                    let structs = spw.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
                    _.sortBy(structs, s => creep.pos.getRangeTo(s));
                    for (let s in structs) {
                        creep.memory.targets.push({struct: structs[s].id, energy: structs[s].store[RESOURCE_ENERGY]})
                    }
                    creep.memory.init = 1;
                    break;

                default:
                    break;
            }
        else {

            if (Memory._extentions !== undefined) {
                switch (Memory._extentions[0]) {
                    case 0:
                        Memory._extentions[1] = spw.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_EXTENSION});
                        Memory._extentions[0] = 1;

                        break;
                    case 1:
                        this.detectPos(creep, spw);
                        //let t = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                        //for (const i in t) {
                        //    t[i].remove();
                        //}
                        Memory._extentions[0] = 2;
                        break;
                    case 2:
                        let x = Memory._extentions[1]['x'];
                        let y = Memory._extentions[1]['y'];
                        for (let i = x; i <= x + size; i++) {
                            for (let j = y; j <= y + size; j++) {
                                let rp = spw.room.getPositionAt(i, j);
                                if (rp.lookFor(LOOK_STRUCTURES)[0]) {
                                    creep.say('💢');
                                    spw.room.visual.text('💥', rp.x, rp.y);
                                    console.log(rp)
                                    if (creep.dismantle(rp.lookFor(LOOK_STRUCTURES)[0]) === ERR_NOT_IN_RANGE) {
                                        creep.moveTo(rp);
                                    }
                                    return;
                                }
                            }
                        }
                        Memory._extentions[0] = 3;

                        //Memory._extentions[0] = 1;
                        break;
                    case 3:
                        //for (let i = 0; i <= 2 + size; i++)
                        this.Build(creep, spw, false);
                        Memory._extentions[0] = 4;
                        break;
                    case 4:
                    case 5:
                        //let t = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                        //for (const i in t) {
                        //    t[i].remove();
                        //}
                        creep.memory.init = 0;
                        break;

                    // default:
                    //     Memory._extentions[0] = 0;
                    //     break
                }


            } else {
                Memory._extentions = [];
                Memory._extentions.push(0);
                Memory._extentions.push(0);
                Memory._extentions.push(0);
            }
        }
    },

    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    detectPos: function (creep, spw) {
        let t_size = size / 2;
        let h_size = (size / 2);
        const terrain = spw.room.getTerrain();
        const matrix = new PathFinder.CostMatrix;
        const visual = spw.room.visual;
        visual.text(' test ', 1, 0);

        let px = 0;
        let py = 0;
        let dist = 1000;


        for (let y = min; y < max; y++) {
            for (let x = min; x < max; x++) {
                const tile = terrain.get(x, y);
                const weight =
                    tile === TERRAIN_MASK_WALL ? 255 : // wall  => unwalkable
                        tile === TERRAIN_MASK_SWAMP ? 5 : // swamp => weight:  5
                            1; // plain => weight:  1
                //console.log(weight);

                if (tile !== TERRAIN_MASK_WALL && x + size < max && y + size < max) {

                    if (terrain.get(x + size, y) !== TERRAIN_MASK_WALL)
                        if (terrain.get(x + size, y + size) !== TERRAIN_MASK_WALL)
                            if (terrain.get(x, y + size) !== TERRAIN_MASK_WALL) {
                                let _break = false;
                                for (let i = x; i < x + size; i++) {
                                    for (let j = y; j < y + size; j++) {
                                        if (terrain.get(i, j) === TERRAIN_MASK_WALL) {
                                            _break = true;
                                            visual.text('-', i, j);
                                        }
                                        //else {visual.text('#',i,j);}
                                    }
                                    if (_break) break;
                                }
                                if (!_break) {
                                    let dist_n = Math.sqrt(Math.pow(spw.pos.y - (y + t_size), 2) + Math.pow((spw.pos.x - (x + t_size)), 2));
                                    let s = spw.room.find(FIND_SOURCES);
                                    for (let t in s) {
                                        let dts = Math.sqrt(Math.pow(s[t].pos.y - (y + t_size), 2) + Math.pow((s[t].pos.x - (x + t_size)), 2));
                                        dist_n = dts < dist_n ? dts : dist_n;
                                    }
                                    //visual.text(dist_n.toFixed(0), (x+h_size), (y+h_size) );


                                    if (dist_n.toFixed(0) == 8) {
                                        Memory._extentions[1] = {x: px, y: py};
                                        console.log('placing spawnHelp at [' + px + '/' + py + ']');

                                        visual.rect(px, py, size, size, {
                                            strokeWidth: .8,
                                            fill: '#ffdb00',
                                            stroke: '#000000'
                                        });
                                        visual.rect(px - 1, py - 1, size + 2, size + 2, {
                                            strokeWidth: .5,
                                            fill: 'transparent',
                                            stroke: '#00ff1e'
                                        });

                                        visual.text('x', px + size, py);
                                        visual.text('x', px + size, py + size);
                                        visual.text('x', px, py + size);
                                        visual.text('H' + px + ':' + py + ":" + dist_n.toFixed(0), px, py);

                                        //console.log('ret');
                                        return;
                                    } else if (dist_n > 8 && dist_n < dist && dist_n < 20) {
                                        dist = dist_n;
                                        px = x;
                                        py = y;
                                    }
                                }

                            }
                }

                matrix.set(x, y, weight);
            }
        }
    },

    /** @param {Creep} creep
     *  @param {Spawn} spw
     *  @param {Boolean} prew
     **/
    Build: function (creep, spw, prew, x_start, x_stop) {
        let _start = 0;
        let _stop = size;

        if (x_start !== undefined) {
            _start = x_start;
            if(_start > size)return;
        }
        if (x_stop !== undefined) {
            _stop = x_stop  > size ? size:x_stop;
        }

        let h_size = (size / 2);
        let q_size = Math.floor(size / 4);
        let x = Memory._extentions[1]['x'];
        let y = Memory._extentions[1]['y'];
        //creep.say(q_size);
        //creep.moveTo(x, y);
        for (let i = x + _start; i <= x + _stop; i++) {
            for (let j = y; j <= y + size; j++) {
                if (i == x + size || j == y + size || i == x || j == y) {
                    if (i === x + q_size || i === x + q_size * 2 + 1 || i === x + q_size * 4) if (prew)
                        spw.room.visual.text('🟩', i, j);
                    else spw.room.createConstructionSite(i, j, STRUCTURE_RAMPART);
                    else if (prew)
                        spw.room.visual.text('⬛', i, j);
                    else
                        spw.room.createConstructionSite(i, j, STRUCTURE_WALL);
                } else if ((x + 1 == i && y + 1 == j) || (x + size - 1 == i && y + size - 1 == j) || (x + size - 1 == i && y + 1 == j) || (x + 1 == i && y + size - 1 == j)) {
                    if (prew) spw.room.visual.text('🔲', i, j); else spw.room.createConstructionSite(i, j, STRUCTURE_CONTAINER);
                } else if (i > x + 2 && i < x + size - 2 && j == y + h_size) {
                    if (prew)
                        spw.room.visual.text('🔸', i, j);
                    else spw.room.createConstructionSite(i, j, STRUCTURE_ROAD);
                } else {
                    if (i === x + q_size || i === x + q_size * 2 + 1 || i === x + q_size * 4 || i === x + q_size * 5)
                        if (prew)
                            spw.room.visual.text('🔸', i, j);
                        else spw.room.createConstructionSite(i, j, STRUCTURE_ROAD);
                    else {
                        if (prew)
                            spw.room.visual.text('🟡', i, j);
                        else
                            spw.room.createConstructionSite(i, j, STRUCTURE_EXTENSION);
                    }
                }
            }
        }
        spw.room.visual.text('🔰', x, y);
    },

};