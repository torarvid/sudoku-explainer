export class AlgCheckOwning {
    sqRow(helper, row, col) {
        const rowAnchor = 3 * Math.floor(row / 3)
        const colAnchor = 3 * Math.floor(col / 3)
        let ownInRow = new Set()
        for (let c = colAnchor; c < colAnchor + 3; c++) {
            const own = new Set(helper.get(row, c))
            ownInRow = new Set([...ownInRow, ...own])
        }
        for (let r = rowAnchor; r < rowAnchor + 3; r++) {
            if (r === row) {
                continue
            }
            for (let c = colAnchor; c < colAnchor + 3; c++) {
                helper.get(r, c).forEach(n => ownInRow.delete(n))
            }
        }
        return ownInRow
    }

    sqCol(helper, row, col) {
        const rowAnchor = 3 * Math.floor(row / 3)
        const colAnchor = 3 * Math.floor(col / 3)
        let ownInCol = new Set()
        for (let r = rowAnchor; r < rowAnchor + 3; r++) {
            const own = new Set(helper.get(r, col))
            ownInCol = new Set([...ownInCol, ...own])
        }
        for (let r = rowAnchor; r < rowAnchor + 3; r++) {
            for (let c = colAnchor; c < colAnchor + 3; c++) {
                if (c === col) {
                    continue
                }
                helper.get(r, c).forEach(n => ownInCol.delete(n))
            }
        }
        return ownInCol
    }

    run(state, { helper }) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j += 3) {
                const ownRow = this.sqRow(helper, i, j)
                const taken = new Set()
                for (let k = 0; k < 6; k++) {
                    const index = (j + k + 3) % 9
                    ownRow.forEach(num => {
                        if (!(helper.get(i, index).indexOf(num) >= 0)) {
                            return
                        }
                        helper.delete(i, index, num)
                        taken.add(num)
                    })
                }
                if (taken.size > 0) {
                    const rowsAnchor = 3 * Math.floor(i / 3)
                    const square = `(${rowsAnchor + 1}, ${j + 1}) -> (${rowsAnchor + 3}, ${j + 3})`
                    state.reason = `${[...taken]} taken in row ${i + 1} by square ${square}`
                    state.updated = true
                    return state
                }
                const ownInCol = this.sqCol(helper, j, i)
                for (let k = 0; k < 6; k++) {
                    const index = (j + k + 3) % 9
                    ownInCol.forEach(num => {
                        if (!(helper.get(index, i).indexOf(num) >= 0)) {
                            return
                        }
                        helper.delete(index, i, num)
                        taken.add(num)
                    })
                }
                if (taken.size > 0) {
                    const rowAnchor = 3 * Math.floor(i / 3)
                    const square = `(${j + 1}, ${rowAnchor + 1}) -> (${j + 3}, ${rowAnchor + 3})`
                    state.reason = `${[...taken]} taken in col ${i + 1} by square ${square}`
                    state.updated = true
                    return state
                }
            }
        }
        return state
    }
}
