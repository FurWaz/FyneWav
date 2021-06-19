class Position {
    /**
     * Position's constructor
     * @param {Number} x The X coordonate of the Position
     * @param {Number} y The Y coordonate of the Position
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Returns the absolute distance between [this] and [p]
     * @param {Position} p The targeted Position
     * @returns {Number} The absolute distance between [this] and [p]
     */
    dist(p) {
        return Math.sqrt( Math.pow(this.x-p.x, 2) + Math.pow(this.y-p.y, 2) );
    }
}