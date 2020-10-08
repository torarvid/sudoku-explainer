export class SudokuHelper {
    constructor() {
        this.cells = []
        for (let i = 0; i < 9; i++) {
            const row = []
            for (let j = 0; j < 9; j++) {
                row.push([1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
            this.cells.push(row)
        }
    }
    get(row, col) {
        return this.cells[row][col]
    }

    set(row, col, array) {
        this.cells[row][col] = array
    }

    delete(row, col, val) {
        const arr = this.cells[row][col]
        const index = arr.indexOf(val)
        if (index < 0) {
            return false
        }
        arr.splice(index, 1)
        this.cells[row][col] = arr
        return true
    }

    clear(row, col) {
        this.cells[row][col] = []
    }

    row(num, fn) {
        if (fn) {
            this.cells[num].forEach(fn)
            return this
        } else {
            return this.cells[num]
        }
    }

    rowMap(num, fn) {
        let edited = false
        this.cells[num].map((n, i) => {
            const oldVal = [...n]
            const newVal = fn(n, i)
            if (!edited && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                edited = true
            }
            return newVal
        })
        return edited ? this.cells[num] : null
    }

    col(num, fn) {
        if (fn) {
            for (let i = 0; i < 9; i++) {
                fn(this.cells[i][num], i)
            }
            return this
        } else {
            const carr = []
            this.col(num, n => carr.push(n))
            return carr
        }
    }

    colMap(num, fn) {
        let edited = false
        for (let i = 0; i < 9; i++) {
            const oldVal = [...this.cells[i][num]]
            const newVal = fn(this.cells[i][num], i)
            if (!edited && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                edited = true
            }
        }
        return edited ? this.col(num) : null
    }

    square(num, fn) {
        if (fn) {
            const rowAnchor = 3 * Math.floor(num / 3)
            const colAnchor = 3 * (num % 3)
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    fn(this.cells[i + rowAnchor][j + colAnchor], i * 3 + j)
                }
            }
            return this
        } else {
            const sarr = []
            this.square(num, n => sarr.push(n))
            return sarr
        }
    }

    squareMap(num, fn) {
        const rowAnchor = 3 * Math.floor(num / 3)
        const colAnchor = 3 * (num % 3)
        let edited = false
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const oldVal = [...this.cells[i + rowAnchor][j + colAnchor]]
                const newVal = fn(this.cells[i + rowAnchor][j + colAnchor], i * 3 + j)
                if (!edited && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    edited = true
                }
            }
        }
        return edited ? this.square(num) : null
    }
}
