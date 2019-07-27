export class AlgSectorUpdate {

    run(state, puzzle) {
        const { helper } = puzzle
        for (let i = 0; i < 9; i++) {
            const rows = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            const cols = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            const squares = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            helper.row(i, r => r.forEach(num => rows[num-1] += 1))
            helper.col(i, c => c.forEach(num => cols[num-1] += 1))
            helper.square(i, v => v.forEach(num => squares[num-1] += 1))
            const rowIdx = rows.indexOf(1)
            if (rowIdx) {
                for (let j = 0; j < 9; j++) {
                    const val = this.checkHelper(helper, state, i, j, rowIdx+1, 'row')
                    if (val) {
                        return val
                    }
                }
            }
            const colIdx = cols.indexOf(1)
            if (colIdx) {
                for (let j = 0; j < 9; j++) {
                    const val = this.checkHelper(helper, state, j, i, colIdx + 1, 'col')
                    if (val) {
                        return val
                    }
                }
            }
            const rowsAnchor = 3 * Math.floor(i / 3)
            const colsAnchor = 3 * (i % 3)
            const squareIdx = squares.indexOf(1)
            if (squareIdx) {
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 3; k++) {
                        const [row, col] = [j + rowsAnchor, k + colsAnchor]
                        const val = this.checkHelper(helper, state, row, col, squareIdx + 1, 'square')
                        if (val) {
                            return val
                        }
                    }
                }
            }
        }

        return state
    }

    checkHelper(helper, state, row, col, value, str) {
        if (helper.get(row, col).indexOf(value) >= 0) {
            const reason = `(${row+1}, ${col+1}) set to ${value}, only possible in ${str}`
            return Object.assign(state, { row, col, value, reason, updated: true })
        }
        return null
    }
}
