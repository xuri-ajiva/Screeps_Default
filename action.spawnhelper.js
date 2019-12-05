const size = 10;
const min = 5;
const max = 50 - min;

module.exports = {
    /** @param {Creep} creep
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
                            //creep.say(_t.pos.x + '|' + _t.pos.y);

                            switch (creep.transfer(_t, RESOURCE_ENERGY)) {
                                case ERR_NOT_IN_RANGE:
                                    creep.room.visual.text('⭕',_t.pos.x,_t.pos.y);
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
                    creep.say('🔀');
                    creep.memory.targets = [];
                    let structs = spw.room.find(FIND_STRUCTURES);
                    structs.sort((a, b) =>( a.pos.x - b.pos.x)/* * (a.pos.y - b.pos.y)*/);
                    //_.sortBy(structs, s => creep.pos.getRangeTo(s));

                    let x = 0;
                    for (let s in  structs){
                        let struct = structs[s];

                        if(struct.structureType === STRUCTURE_EXTENSION){
                            creep.room.visual.text(''+(x++),struct.pos.x,struct.pos.y ,{font: 0.2});
                            creep.memory.targets.push({struct: struct.id, energy: struct.store[RESOURCE_ENERGY]});
                        }
                    }



                    //let structs = spw.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
                    //_.sortBy(structs, s => creep.pos.getRangeTo(s));
                    //for (let s in structs) {
                    //    creep.memory.targets.push({struct: structs[s].id, energy: structs[s].store[RESOURCE_ENERGY]})
                    //}
                    creep.memory.init = 1;
                    break;

                default:
                    break;
            }
        else {
            if (spw.memory._extentions !== undefined) {
                switch (spw.memory._extentions[0]) {
                    case 0:
                        spw.memory._extentions[1] = spw.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_EXTENSION});
                        spw.memory._extentions[0] = 1;

                        break;
                    case 1:
                        this.detectPos(creep, spw);
                        //let t = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                        //for (const i in t) {
                        //    t[i].remove();
                        //}
                        spw.memory._extentions[0] = 2;
                        break;
                    case 2:
                        let x = spw.memory._extentions[1]['x'];
                        let y = spw.memory._extentions[1]['y'];
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
                        spw.memory._extentions[0] = 3;

                        //spw.memory._extentions[0] = 1;
                        break;
                    case 3:
                        //for (let i = 0; i <= 2 + size; i++)
                        this.Build(creep, spw, false);
                        spw.memory._extentions[0] = 4;
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
                    //     spw.memory._extentions[0] = 0;
                    //     break
                }


            } else {
                spw.memory._extentions = [];
                spw.memory._extentions.push(0);
                spw.memory._extentions.push(0);
                spw.memory._extentions.push(0);
            }
        }
    },

    /** @param {Creep} creep
     **/
    detectPos: function (creep, spw) {
        const iGameDistCheck = false;

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
                //const weight = tile === TERRAIN_MASK_WALL ? 255 : tile === TERRAIN_MASK_SWAMP ? 5 : 1;
                //console.log(weight);

                if (tile !== TERRAIN_MASK_WALL && x + size < max && y + size < max) {
                    if (terrain.get(x + size - 1, y) !== TERRAIN_MASK_WALL)
                        if (terrain.get(x + size - 1, y + size - 1) !== TERRAIN_MASK_WALL)
                            if (terrain.get(x, y + size - 1) !== TERRAIN_MASK_WALL) {
                                let _break = false;
                                for (let i = x; i < x + size + 1; i++) {
                                    for (let j = y; j < y + size + 1; j++) {
                                        if (i === x && j === y) {
                                        }//visual.text(x+' | '+y, i, j, {font: 0.2});
                                        if (terrain.get(i, j) === TERRAIN_MASK_WALL) {
                                            _break = true;
                                            visual.text('-', i, j);
                                        }
                                        //else {visual.text('#',i,j);}
                                    }
                                    if (_break) break;
                                }
                                if (!_break) {
                                    //console.log('range: ' + spw.pos.getRangeTo(x + t_size, y + t_size) + '   my: ' + Math.sqrt(Math.pow(spw.pos.y - (y + t_size), 2) + Math.pow((spw.pos.x - (x + t_size)), 2)));

                                    let dist_n = iGameDistCheck ? spw.pos.getRangeTo(x + t_size, y + t_size) : Math.sqrt(Math.pow(spw.pos.y - (y + t_size), 2) + Math.pow((spw.pos.x - (x + t_size)), 2));
                                    let s = spw.room.find(FIND_SOURCES);
                                    for (let t in s) {
                                        let dts = iGameDistCheck ? s[t].pos.getRangeTo(x + t_size, y + t_size) : Math.sqrt(Math.pow(s[t].pos.y - (y + t_size), 2) + Math.pow((s[t].pos.x - (x + t_size)), 2));
                                        dist_n = dts < dist_n ? dts : dist_n;
                                    }
                                    let sm = spw.room.find(FIND_MINERALS);
                                    for (let g in sm) {
                                        let dts2 = iGameDistCheck ? sm[g].pos.getRangeTo(x + t_size, y + t_size) : Math.sqrt(Math.pow(sm[g].pos.y - (y + t_size), 2) + Math.pow((sm[g].pos.x - (x + t_size)), 2));
                                        dist_n = dts2 < dist_n ? dts2 : dist_n;
                                    }
                                    let dist_2 = iGameDistCheck ? spw.room.controller.pos.getRangeTo(x + t_size, y + t_size) : Math.sqrt(Math.pow(spw.room.controller.y - (y + t_size), 2) + Math.pow((spw.room.controller.x - (x + t_size)), 2));
                                    dist_n = dist_2 < dist_n ? dist_2 : dist_n;

                                    //visual.text(dist_n.toFixed(0), (x+h_size), (y+h_size) );

                                    //visual.rect(px, py, size, size, {
                                    //    strokeWidth: .1,
                                    //    fill: 'transparent',
                                    //    stroke: '#000000'
                                    //});

                                    if (dist_n.toFixed(0) == 8) {
                                        spw.memory._extentions[1] = {x: px, y: py};

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

                                        console.log('placing spawnHelp at [' + px + '/' + py + ']');
                                        return;
                                    }
                                    if (dist_n > 8 && dist_n < dist && dist_n < 18) {
                                        spw.memory._extentions[1] = {x: px, y: py};
                                        dist = dist_n;
                                        px = x;
                                        py = y;

                                        //visual.rect(px, py, size, size, {
                                        //    strokeWidth: .8,
                                        //    fill: '#ffdb00',
                                        //    stroke: '#000000'
                                        //});
                                        //visual.rect(px - 1, py - 1, size + 2, size + 2, {
                                        //    strokeWidth: .5,
                                        //    fill: 'transparent',
                                        //    stroke: '#00ff1e'
                                        //});
                                    }
                                }

                            }
                }

                //matrix.set(x, y, weight);
            }
        }
    },

    /** @param {Creep} creep
     *  @param {Boolean} prew
     **/
    Build: function (creep, spw, prew, x_start, x_stop) {
        let _start = 0;
        let _stop = size;

        if (x_start !== undefined) {
            _start = x_start;
            if (_start > size) return;
        }
        if (x_stop !== undefined) {
            _stop = x_stop > size ? size : x_stop;
        }

        let h_size = (size / 2);
        let q_size = Math.floor(size / 4);
        let x = spw.memory._extentions[1]['x'];
        let y = spw.memory._extentions[1]['y'];
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