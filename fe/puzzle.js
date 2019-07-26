export class Puzzle {
    constructor() {
        this.focusedCell = null
        this._grid = this.createGrid()
    }

    get grid() {
        return this._grid
    }

    cellClick(e) {
        this.focusCell(e.target)
    }

    focusCell(cell) {
        if (this.focusedCell) {
            this.focusedCell.classList.remove('focusedCell')
        }
        this.focusedCell = cell
        this.focusedCell.classList.add('focusedCell')
    }

    focusCellAt(row, col) {
        const r = this.grid.childNodes[row]
        const cell = r.childNodes[col]
        this.focusCell(cell)
    }

    focusNextCell() {
        if (!this.focusedCell) {
            this.focusCellAt(0, 0)
            return
        }
        if (this.focusedCell.nextSibling) {
            this.focusCell(this.focusedCell.nextSibling)
        } else {
            const r = this.focusedCell.parentElement
            if (!r.nextSibling) {
                this.focusCellAt(0, 0)
                return
            }
            this.focusCell(r.nextSibling.firstChild)
        }
    }

    createGridCell() {
        const cell = document.createElement('td')
        cell.classList.add('cell')
        cell.onmousedown = this.cellClick.bind(this)
        return cell
    }

    createGridRow() {
        const row = document.createElement('tr')
        for (let i = 0; i < 9; i++) {
            const cell = this.createGridCell()
            row.appendChild(cell)
        }
        return row
    }

    createGrid() {
        const grid = document.createElement('table')
        for (let i = 0; i < 9; i++) {
            const row = this.createGridRow()
            grid.appendChild(row)
        }
        return grid
    }

    getValues() {
        const values = []
        this.grid.childNodes.forEach(row => {
            const rowValues = []
            row.childNodes.forEach(cell => {
                rowValues.push(cell.textContent | 0) // convert to number
            })
            values.push(rowValues)
        })
        return values
    }

    saveCurrentValues() {
        const values = this.getValues()
        window.localStorage.setItem('grid', JSON.stringify(values));
    }

    loadCurrentValues() {
        const stringValues = window.localStorage.getItem('grid')
        if (!stringValues) {
            return
        }
        const values = JSON.parse(stringValues)
        values.forEach((row, index) => {
            const r = this.grid.childNodes[index]
            row.forEach((value, rIndex) => {
                const cell = r.childNodes[rIndex]
                if (value !== 0) {
                    cell.textContent = value
                }
            })
        })
        return values
    }

    setValueAndFocus(row, col, value) {
        this.focusCellAt(row, col)
        this.focusedCell.textContent = value
    }

    setFocusedValue(value) {
        this.focusedCell.textContent = value
        this.focusNextCell()
        this.saveCurrentValues()
    }
}
