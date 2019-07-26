import * as algs from './algorithms/index.js'

export function validate(input, helper) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = input[i][j]
            if (num === 0 && helper.get(i, j).length < 1) {
                return false
            }
            if (num === 0) {
                continue
            }
            for (let k = 0; k < 9; k++) {
                if (k != i && input[k][j] === num) {
                    return false
                }
                if (k != j && input[i][k] === num) {
                    return false
                }
            }
            const icorner = 3 * Math.floor(i / 3)
            const jcorner = 3 * Math.floor(j / 3)
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const r = icorner + k
                    const c = jcorner + l
                    if (!(r === i && c === j) && input[r][c] === num) {
                        return false
                    }
                }
            }
        }
    }
	return true
}

function isDone(puzzle) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (puzzle[row][col] === 0) {
                return false
            }
        }
    }
    return true
}

function updateHelper(puzzle, helper) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] === 0) {
                continue
            }
            for (let k = 0; k < 9; k++) {
                helper.delete(i, k, puzzle[i][j])
                helper.delete(k, j, puzzle[i][j])
            }
            const icorner = 3 * Math.floor(i/3)
            const jcorner = 3 * Math.floor(j/3)
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const [hx, hy] = [icorner + k, jcorner + l]
                    helper.delete(hx, hy, puzzle[i][j])
                }
            }
            helper.clear(i, j)
        }
    }
}

export function solve(puzzle, helper) {
	if (!validate(puzzle, helper)) {
        alert('ERROR IN INPUTDATA!')
        return
    }
    const algorithms = [ new algs.AlgEasyUpdate() ]
	// algorithms << AlgEasyUpdate.new
	// algorithms << AlgSectorUpdate.new
	// algorithms << AlgCheckOwning.new
	// algorithms << AlgCheckNakedTuple.new
	// algorithms << AlgCheckHiddenTuple.new

    while (!isDone(puzzle)) {
        const dict = {}
        updateHelper(puzzle, helper)
        let updated = false
        let error = false
        algorithms.forEach(alg => {
            alg.run(dict, puzzle, helper)
            if (Object.keys(dict).length > 0) {
                if (!validate(puzzle, helper)) {
                    alert(`ERROR IN ALGORITHM ${alg.constructor.name}`)
                    error = true
                }
                updated = true
                return
            }
        })
        if (error) {
            break
        }
        if (updated) {
            alert(`${dict.reason}`);
        } else {
            alert(`Can't update more`)
            break
        }
    }
	if (isDone(puzzle)) {
        if (validate(puzzle, helper)) {
            alert('Solved!')
        } else {
            alert('Invalid puzzle')
        }
    } else {
        alert(`I'm either too dumb to solve this or it is unsolvable`)
    }
}
