class Pattern {
    /**
     * Constructor
     * @param {Number} pos Pattern position in track (in ticks)
     * @param {Number} width Pattern width in track (in ticks)
     */
    constructor(pos, width) {
        this.pos = pos;
        this.id = patternID();
        this.width = width;
        /**@type {Partition[]} */
        this.partitions = []
    }

    /**
     * Update the Partitions in the pattern
     * @param {Number} position position to update (in ticks)
     */
    update(position) {
        this.partitions.forEach(p => {
            p.update(position-this.pos);
        })
    }
}

class Partition {
    /**
     * Constructor
     * @param {Number} VstID Vst's ID
     */
    constructor(VstID) {
        this.VstID = VstID;
        this.id = partitionID();
        /**@type {Note[]} */
        this.notes = []
    }

    /**
     * Adds a note to the partition
     * @param {Note} note The note to add
     */
    addNote(note) {
        this.notes.push(note);
    }
}

class Note {
    /**
     * Constructor
     * @param {Number} NoteID Note's ID code
     * @param {Number} length Note's length
     * @param {Number} pos Note's position
     */
    constructor(partitionID, length, pos) {
        this.partitionID = partitionID;
        this.id = noteID();
        this.length = length;
        this.pos = pos;

        this.playing = false;
    }

    play() {
        if (this.playing) return;
        this.playing = true;
        engine.playNote(this.PartitionID, this.NoteID);
    }

    stop() {
        if (!this.playing) return;
        this.playing = false;
        engine.stopNote(this.PartitionID, this.NoteID);
    }
}

let pattern_id_counter = 0;
let partition_id_counter = 0;
let note_id_counter = 0;
function patternID() { return pattern_id_counter++; }
function partitionID() { return partition_id_counter++; }
function noteID() { return note_id_counter++; }