import * as algs from './algorithms/index.js'

export function validate(grid, helper) {
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

function updateHelper(grid, helper) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                continue
            }
            for (let k = 0; k < 9; k++) {
                helper.delete(i, k, grid[i][j])
                helper.delete(k, j, grid[i][j])
            }
            const icorner = 3 * Math.floor(i/3)
            const jcorner = 3 * Math.floor(j/3)
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const [hx, hy] = [icorner + k, jcorner + l]
                    helper.delete(hx, hy, grid[i][j])
                }
            }
            helper.clear(i, j)
        }
    }
}

export function solve(puzzle, helper) {
    const grid = puzzle.getValues()
	if (!validate(grid, helper)) {
        alert('ERROR IN INPUTDATA!')
        return
    }
    const algorithms = [ new algs.AlgEasyUpdate() ]
	// algorithms << AlgEasyUpdate.new
	// algorithms << AlgSectorUpdate.new
	// algorithms << AlgCheckOwning.new
	// algorithms << AlgCheckNakedTuple.new
	// algorithms << AlgCheckHiddenTuple.new

    while (!isDone(puzzle.getValues())) {
        const state = {}
        updateHelper(puzzle.getValues(), helper)
        algorithms.forEach(alg => {
            alg.run(state, puzzle, helper)
            if (state.updated) {
                if (!validate(puzzle.getValues(), helper)) {
                    alert(`ERROR IN ALGORITHM ${alg.constructor.name}`)
                    state.error = true
                }
                return
            }
        })
        if (state.error) {
            break
        }
        if (state.updated) {
            alert(`${state.reason}`);
            puzzle.setValueAndFocus(state.data.row, state.data.col, state.data.value)
        } else {
            alert(`Can't update more`)
            break
        }
    }
	if (isDone(puzzle.getValues())) {
        if (validate(puzzle.getValues(), helper)) {
            alert('Solved!')
        } else {
            alert('Invalid puzzle')
        }
    } else {
        alert(`I'm either too dumb to solve this or it is unsolvable`)
    }
}
