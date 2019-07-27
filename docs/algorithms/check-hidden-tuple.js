export class AlgCheckHiddenTuple { // only 2-tuples for now...
    run(state, { helper }) {
        for (let i = 0; i < 9; i++) {
            const occurRow = {}
            const occurCol = {}
            helper.row(i, (r, index) => {
                if (!occurRow[r]) {
                    occurRow[r] = []
                }
                occurRow[r].push(index)
            })
            helper.col(i, (c, index) => {
                if (!occurCol[c]) {
                    occurCol[c] = []
                }
                occurCol[c].push(index)
            })
            let numbers = Object.keys(occurRow)
            for (let j = 0; j < numbers.length; j++) {
                for (let k = j+1; k < numbers.length; k++) {
                    if (occurRow[numbers[j]] === occurRow[numbers[k]] && occurRow[numbers[j]].length === 2) {
                        const row = i
                        const [l, m] = occurRow[numbers[j]]
                        if (helper.get(row, l).length > 2) {
                            state.updated = true
                            helper.set(row, l, [numbers[j], numbers[k]])
                        }
                        if (helper.get(row, m).length > 2) {
                            state.updated = true
                            helper.set(row, m, [numbers[j], numbers[k]])
                        }
                        if (state.updated) {
                            const tuple = `(${numbers[j]}, ${numbers[k]})`
                            state.reason = `found hidden tuple ${tuple} in row ${row+1}`
                            return state
                        }
                    }
                }
            }
            numbers = Object.keys(occurCol)
            for (let j = 0; j < numbers.length; j++) {
                for (let k = j+1; k < numbers.length; k++) {
                    if (occurCol[numbers[j]] === occurCol[numbers[k]] && occurCol[numbers[j]].length === 2) {
                        const col = i
                        const [l, m] = occurCol[numbers[j]]
                        if (helper.get(l, col).length > 2) {
                            state.updated = true
                            helper.set(l, col, [numbers[j], numbers[k]])
                        }
                        if (helper.get(m, col).length > 2) {
                            state.updated = true
                            helper.set(m, col, [numbers[j], numbers[k]])
                        }
                        if (state.updated) {
                            const tuple = `(${numbers[j]}, ${numbers[k]})`
                            state.reason = `found hidden tuple ${tuple} in col ${col+1}`
                            return state
                        }
                    }
                }
            }
        }
        return state
    }
}
