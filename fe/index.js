import { solve } from './solver.js'
import { SudokuHelper } from './sudokuhelper.js'

function cellClick(e) {
    focusCell(e.target)
}

function focusCell(cell) {
    if (focusedCell) {
        focusedCell.classList.remove('focusedCell')
    }
    focusedCell = cell
    focusedCell.classList.add('focusedCell')
}

function createGridCell() {
    const cell = document.createElement('td')
    cell.classList.add('cell')
    cell.onmousedown = cellClick
    return cell
}

function createGridRow() {
    const row = document.createElement('tr')
    for (let i = 0; i < 9; i++) {
        const cell = createGridCell()
        row.appendChild(cell)
    }
    return row
}

function createGrid() {
    const grid = document.createElement('table')
    for (let i = 0; i < 9; i++) {
        const row = createGridRow()
        grid.appendChild(row)
    }
    return grid
}

const grid = createGrid()
let focusedCell

function focusCellAt(row, col) {
    if (focusedCell) {
        focusedCell.classList.remove('focusedCell')
    }
    const r = grid.childNodes[row]
    focusedCell = r.childNodes[col]
    focusedCell.classList.add('focusedCell')
}

function focusNextCell() {
    if (!focusedCell) {
        focusCellAt(0, 0)
        return
    }
    if (focusedCell.nextSibling) {
        focusCell(focusedCell.nextSibling)
    } else {
        const r = focusedCell.parentElement
        if (!r.nextSibling) {
            focusCellAt(0, 0)
            return
        }
        focusCell(r.nextSibling.firstChild)
    }
}

function getValues() {
    const values = []
    grid.childNodes.forEach(row => {
        const rowValues = []
        row.childNodes.forEach(cell => {
            rowValues.push(cell.textContent | 0) // convert to number
        })
        values.push(rowValues)
    })
    return values
}

function saveCurrentValues() {
    const values = getValues()
    window.localStorage.setItem('grid', JSON.stringify(values));
}

function loadCurrentValues() {
    const stringValues = window.localStorage.getItem('grid')
    if (!stringValues) {
        return
    }
    const values = JSON.parse(stringValues)
    values.forEach((row, index) => {
        const r = grid.childNodes[index]
        row.forEach((value, rIndex) => {
            const cell = r.childNodes[rIndex]
            cell.textContent = value
        })
    })
    return values
}

function setFocusedValue(value) {
    focusedCell.textContent = value
    focusNextCell()
    saveCurrentValues()
}

document.onkeydown = (e) => {
    switch (e.code) {
        case 'Tab':
        case 'Space':
            setFocusedValue(null)
            break
        case 'KeyT':
            setFocusedValue('1')
            break
        case 'KeyY':
            setFocusedValue('2')
            break
        case 'KeyU':
            setFocusedValue('3')
            break
        case 'KeyG':
            setFocusedValue('4')
            break
        case 'KeyH':
            setFocusedValue('5')
            break
        case 'KeyJ':
            setFocusedValue('6')
            break
        case 'KeyB':
            setFocusedValue('7')
            break
        case 'KeyN':
            setFocusedValue('8')
            break
        case 'KeyM':
            setFocusedValue('9')
            break
        default:
            console.log(`Pressed ${e.code}`);
            break
    }
}

function startSolving() {
    const values = getValues()
    const helper = new SudokuHelper()
    solve(values, helper)
}

const content = document.getElementById('content')
content.appendChild(grid)
const solveButton = document.createElement('button')
solveButton.onclick = startSolving
solveButton.textContent = 'Ohoy!'
content.appendChild(solveButton)

focusCellAt(0, 0)
loadCurrentValues()
