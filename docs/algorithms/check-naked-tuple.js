export class AlgCheckNakedTuple {
    run(state, { helper }) {
        for (let i = 0; i < 9; i++) {
            const currentRow = helper.row(i)
            const currentCol = []
            for (let j = 0; j < 9; j++) {
                currentCol.push(helper.get(j, i))
            }
            const currentSquare = []
            const rowAnchor = 3 * Math.floor(i / 3)
            const colAnchor = 3 * (i % 3)
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    currentSquare.push(helper.get(j+rowAnchor, k+colAnchor))
                }
            }
            const tdict = { row: currentRow, col: currentCol, square: currentSquare }
            for (let [key, value] of Object.entries(tdict)) {
                value.some(row => {
                    const temp = value.filter(r => JSON.stringify(r) === JSON.stringify(row))
                    if (temp.length === row.length) {
                        this.remove(state, helper, temp[0], i, key)
                        if (state.updated) {
                            return true
                        }
                    }
                })
                if (state.updated) {
                    return state
                }
            }
        }
        return state
    }

    remove(state, helper, value, index, str) {
        switch(str) {
            case 'row':
                state.updated = !!helper.rowMap(index, (r, col) => {
                    if (JSON.stringify(value) !== JSON.stringify(r)) {
                        value.forEach(n => helper.delete(index, col, n))
                        return helper.get(index, col)
                    }
                    return r
                })
                break
            case 'col':
                state.updated = !!helper.colMap(index, (c, row) => {
                    if (JSON.stringify(value) !== JSON.stringify(c)) {
                        value.forEach(n => helper.delete(row, index, n))
                        return helper.get(row, index)
                    }
                    return c
                })
                break
            case 'square':
                state.updated = !!helper.squareMap(index, (s, i) => {
                    if (JSON.stringify(value) !== JSON.stringify(s)) {
                        const rowAnchor = 3 * Math.floor(index / 3)
                        const colAnchor = 3 * (index % 3)
                        const row = rowAnchor + Math.floor(i / 3)
                        const col = colAnchor + (i % 3)
                        value.forEach(n => helper.delete(row, col, n))
                        return helper.get(row, col)
                    }
                    return s
                })
                break
        }
        state.reason = `found tuple ${value} in ${str} ${index+1}`
    }
}
