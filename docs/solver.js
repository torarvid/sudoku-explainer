import * as algs from './algorithms/index.js'
import { globalQ } from './message-queue.js'

export function validate(puzzle) {
    const { helper } = puzzle
    const grid = puzzle.getValues()
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = grid[i][j]
            if (num === 0 && helper.get(i, j).length < 1) {
                return false
            }
            if (num === 0) {
                continue
            }
            for (let k = 0; k < 9; k++) {
                if (k != i && grid[k][j] === num) {
                    return false
                }
                if (k != j && grid[i][k] === num) {
                    return false
                }
            }
            const icorner = 3 * Math.floor(i / 3)
            const jcorner = 3 * Math.floor(j / 3)
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const r = icorner + k
                    const c = jcorner + l
                    if (!(r === i && c === j) && grid[r][c] === num) {
                        return false
                    }
                }
            }
        }
    }
    return true
}

function isDone(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return false
            }
        }
    }
    return true
}

export function solve(puzzle) {
    if (!validate(puzzle)) {
        alert('ERROR IN INPUTDATA!')
        return
    }
    const algorithms = [
        new algs.AlgEasyUpdate(),
        new algs.AlgSectorUpdate(),
        new algs.AlgCheckOwning(),
        new algs.AlgCheckNakedTuple(),
        new algs.AlgCheckHiddenTuple(),
    ]

    if (isDone(puzzle.getValues())) {
        if (validate(puzzle)) {
            globalQ.emit('updated', { reason: 'Solved!' })
        } else {
            alert('Invalid puzzle')
        }
    } else {
        const state = {}
        puzzle.updateHelper()
        algorithms.some(alg => {
            alg.run(state, puzzle)
            if (state.updated) {
                if (!validate(puzzle)) {
                    alert(`ERROR IN ALGORITHM ${alg.constructor.name}`)
                    state.error = true
                }
                return true
            }
            return false
        })
        if (!state.error && state.updated) {
            globalQ.emit('updated', state)
            if (state.hasOwnProperty('row') && state.hasOwnProperty('col') && state.value) {
                puzzle.setValueAndFocus(state.row, state.col, state.value)
            }
        } else if (!state.error) {
            globalQ.emit('updated', { reason: `Can't update more` })
        }
    }
    if (state.error) {
        alert('Something wrong with this puzzle (or this solver..)')
    } else {
        globalQ.emit('updated', { reason: `I'm either too dumb to solve this or it is unsolvable` })
    }
}
