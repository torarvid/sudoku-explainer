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

function saveCurrentValues() {
    const values = []
    grid.childNodes.forEach(row => {
        const rowValues = []
        row.childNodes.forEach(cell => {
            rowValues.push(cell.textContent)
        })
        values.push(rowValues)
    })
    const stringValues = values.toString()
    console.log('V', stringValues);
    window.localStorage.setItem('grid', stringValues);
}

function loadCurrentValues() {
    const stringValues = window.localStorage.getItem('grid')
    if (!stringValues) {
        return
    }
    const values = stringValues.split(',')
    values.forEach((value, index) => {
        const row = grid.childNodes[Math.floor(index / 9)]
        const cell = row.childNodes[index % 9]
        cell.textContent = value
    })
}

function setFocusedValue(value) {
    focusedCell.textContent = value
    focusNextCell()
    saveCurrentValues()
}

const content = document.getElementById('content')
content.appendChild(grid)

focusCellAt(0, 0)
loadCurrentValues()

document.onkeydown = (e) => {
    switch (e.code) {
        case 'Tab':
        case 'Space':
            focusNextCell()
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