import { SudokuHelper } from './sudokuhelper.js';

export class Puzzle {
    constructor() {
        this.focusedCell = null
        this._grid = this.createGrid()
        this.entry = this.createEntry()
        this.helper = new SudokuHelper()
    }

    get grid() {
        return this._grid
    }

    cellClick(e) {
        this.focusCell(e.target)
        const entryValue = [...this.entry.childNodes].find(e => {
            return e.classList.contains('active')
        })
        if (entryValue) {
            this.setFocusedValue((entryValue.textContent | 0) || null, { skipToNext: false })
        }
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
        grid.classList.add('grid')
        for (let i = 0; i < 9; i++) {
            const row = this.createGridRow()
            grid.appendChild(row)
        }
        return grid
    }

    createEntry() {
        const entry = document.createElement('div')
        entry.classList.add('entry')
        for (let i = 0; i < 10; i++) {
            const btn = document.createElement('div')
            btn.classList.add('toggle-button')
            btn.textContent = i+1
            btn.onclick = (e) => {
                entry.childNodes.forEach(n => {
                    if (btn !== n) {
                        n.classList.remove('active')
                    }
                })
                btn.classList.toggle('active')
            }
            entry.appendChild(btn)
        }
        entry.childNodes[entry.childNodes.length-1].textContent = 'X'
        return entry
    }

    getValues() {
        const values = []
        this.grid.childNodes.forEach(row => {
            const rowValues = []
            row.childNodes.forEach(cell => {
                if (cell.childNodes.length && cell.childNodes[0].nodeName !== "#text") {
                    rowValues.push(0)
                } else {
                    rowValues.push(cell.textContent | 0) // convert to number
                }
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

    setFocusedValue(value, { skipToNext = true }) {
        this.focusedCell.textContent = value
        if (skipToNext) {
            this.focusNextCell()
        }
        this.saveCurrentValues()
    }

    updateHelper() {
        const vals = this.getValues()
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (vals[i][j] === 0) {
                    continue
                }
                for (let k = 0; k < 9; k++) {
                    this.helper.delete(i, k, vals[i][j])
                    this.helper.delete(k, j, vals[i][j])
                }
                const icorner = 3 * Math.floor(i/3)
                const jcorner = 3 * Math.floor(j/3)
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        const [hx, hy] = [icorner + k, jcorner + l]
                        this.helper.delete(hx, hy, vals[i][j])
                    }
                }
                this.helper.clear(i, j)
            }
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const values = this.helper.get(i, j)
                if (values.length === 0) {
                    continue // TODO remove existing subtable if exists
                }
                const tr = this.grid.childNodes[i]
                const td = tr.childNodes[j]
                const subtable = document.createElement('table')
                subtable.classList.add('subtable')
                for (let k = 0; k < 3; k++) {
                    const r = document.createElement('tr')
                    for (let l = 0; l < 3; l++) {
                        const cell = document.createElement('td')
                        const currentVal = 3 * k + l + 1
                        if (values.indexOf(currentVal) >= 0) {
                            cell.textContent = currentVal
                        }
                        r.appendChild(cell)
                    }
                    subtable.appendChild(r)
                }
                if (td.firstChild) {
                    td.removeChild(td.firstChild)
                }
                td.appendChild(subtable)
            }
        }
    }
}
