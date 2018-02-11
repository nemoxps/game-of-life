let ALIVE = Symbol('GameOfLife~ALIVE');
let DEAD = Symbol('GameOfLife~DEAD');

class GameOfLife {
    /**
     * @param {Object} options
     * @param {Array<boolean[]|number[]>} options.matrix
     * @param {Object} options.rules
     * @param {int[]} options.rules.born
     * @param {int[]} options.rules.survive
     */
    constructor({ matrix, rules }) {
        this.state = GameOfLife.matrixToAliveOrDead(matrix);
        this.rules = rules;
    }
    
    static get ALIVE() {
        return ALIVE;
    }
    static get DEAD() {
        return DEAD;
    }
    
    /**
     * @param {Array[]} matrix
     * @param {function} [isAlive=Boolean]
     * @param {Object} [aliveDead]
     * @param {*} aliveDead.ALIVE
     * @param {*} aliveDead.DEAD
     * @returns {Array[]}
     */
    static matrixToAliveOrDead(matrix, isAlive = Boolean, { ALIVE: alive, DEAD: dead } = { ALIVE, DEAD }) {
        return matrix.map((row) => {
            return row.map((cell) => (isAlive(cell)) ? alive : dead);
        });
    }
    
    /**
     * @param {Array[]} state
     * @param {Object} rules
     * @param {int} iterations
     * @returns {Array[]}
     */
    static runAutomaton(state, rules, iterations) {
        if (iterations <= 0)
          return state;
        
        return GameOfLife.runAutomaton(GameOfLife.evolve(state, rules), rules, iterations - 1);
    }
    /**
     * @param {Array[]} state
     * @param {Object} rules
     * @returns {Array[]}
     */
    static evolve(state, rules) {
        return state.map((row, rowIndex) => {
            return row.map((cell, colIndex) => {
                return GameOfLife.evolveCell(state, rules, cell, rowIndex, colIndex);
            });
        });
    }
    /**
     * @param {Array[]} state
     * @param {Object} rules
     * @param {Symbol} cell
     * @param {int} row
     * @param {int} col
     * @returns {Symbol}
     */
    static evolveCell(state, rules, cell, row, col) {
        let numAliveNeighbors = GameOfLife.getAliveNeighbors(state, row, col);
        return (
          cell === DEAD && rules.born.includes(numAliveNeighbors) ||
          cell === ALIVE && rules.survive.includes(numAliveNeighbors)
        ) ? ALIVE : DEAD;
    }
    /**
     * @param {Array[]} state
     * @param {int} row
     * @param {int} col
     * @returns {int}
     */
    static getAliveNeighbors(state, row, col) {
        return GameOfLife.neighbors.reduce((sum, [xrow, xcol]) => {
            if (state[row + xrow] && state[row + xrow][col + xcol] === ALIVE)
              return sum + 1;
            return sum;
        }, 0);
    }
    
    /**
     * @param {int} [iterations=1]
     * @returns {this}
     */
    run(iterations = 1) {
        this.state = GameOfLife.runAutomaton(this.state, this.rules, iterations);
        return this;
    }
}
GameOfLife.neighbors = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];


module.exports = GameOfLife;