import { solve } from './solver.js'
import { Puzzle } from './puzzle.js'
import { globalQ } from './message-queue.js'

const puzzle = new Puzzle()

document.onkeydown = e => {
    switch (e.code) {
        case 'Tab':
        case 'Space':
            puzzle.setFocusedValue(null)
            break
        case 'KeyT':
        case 'Digit1':
            puzzle.setFocusedValue('1')
            break
        case 'KeyY':
        case 'Digit2':
            puzzle.setFocusedValue('2')
            break
        case 'KeyU':
        case 'Digit3':
            puzzle.setFocusedValue('3')
            break
        case 'KeyG':
        case 'Digit4':
            puzzle.setFocusedValue('4')
            break
        case 'KeyH':
        case 'Digit5':
            puzzle.setFocusedValue('5')
            break
        case 'KeyJ':
        case 'Digit6':
            puzzle.setFocusedValue('6')
            break
        case 'KeyB':
        case 'Digit7':
            puzzle.setFocusedValue('7')
            break
        case 'KeyN':
        case 'Digit8':
            puzzle.setFocusedValue('8')
            break
        case 'KeyM':
        case 'Digit9':
            puzzle.setFocusedValue('9')
            break
        default:
            console.log(`Pressed ${e.code}`)
            break
    }
}

function startSolving() {
    solve(puzzle)
}

const content = document.getElementById('content')
content.appendChild(puzzle.grid)
content.appendChild(puzzle.entry)
const solveButton = document.createElement('button')
solveButton.onclick = startSolving
solveButton.textContent = 'Solve a step!'
content.appendChild(solveButton)
const messages = document.createElement('table')
messages.classList.add('messages')
content.appendChild(messages)
globalQ.on('updated', state => {
    const row = messages.insertRow(0)
    const cell = document.createElement('td')
    row.appendChild(cell)
    cell.textContent = state.reason
})

puzzle.focusCellAt(0, 0)
puzzle.loadCurrentValues()
