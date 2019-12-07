module.exports = {
    check: function (room) {
        let _target = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_LINK});
        _target.sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
        _target.reverse();

        for (let x in _target) {
            let _a = Game.getObjectById('e3ae6c371216c79');
            if (_a.id !== _target[x].id)
                this.send(_a, _target[x]);
        }

    },
    checkSend: function (link) {
        if (link.store[RESOURCE_ENERGY] > 0) {
            let _target = link.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_LINK && s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY)});
            console.log(_target.length);
            if (_target.length) {
                this.send(link, _target[0]);
            }
        }
    },
    send: function (link, target) {
        return link.transferEnergy(target)
    },


};