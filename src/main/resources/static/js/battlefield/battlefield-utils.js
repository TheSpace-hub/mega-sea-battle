import {players} from "./main.js";
import {gameStatusTypes, getStatus} from "./status.js";
import {attack, submitFieldForVerification} from "./connector.js";

const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']

let currentMode = 'prepare'
let currentPlayer = 0

/**
 * Ask the server about the correctness of the field. If the field is correct, it will be registered.
 */
export function verifyField() {
    submitFieldForVerification(players[0].field)
}


/**
 * Creating a battlefield.
 */
export function initBattlefield() {
    const battlefield = document.getElementById('battlefield')

    battlefield.innerHTML = ''

    const topLeftCell = document.createElement('div')
    topLeftCell.className = 'cell coordinate'
    battlefield.appendChild(topLeftCell)


    for (let i = 0; i < 10; i++) {
        const letterCell = document.createElement('div')
        letterCell.className = 'cell coordinate'
        letterCell.textContent = letters[i]
        battlefield.appendChild(letterCell)
    }

    for (let row = 0; row < 10; row++) {
        const numberCell = document.createElement('div')
        numberCell.className = 'cell coordinate'
        numberCell.textContent = row + 1
        battlefield.appendChild(numberCell)

        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            cell.dataset.row = row
            cell.dataset.col = col

            cell.addEventListener('click', function () {
                handleCellClick(this)
            })

            battlefield.appendChild(cell)
        }
    }

    document.getElementById(`mode-player-0`).addEventListener('click', function () {
        setMode(`player`, 0)
    })
}

/**
 * Setting the display mode. Selecting a player to view.
 * @param mode Display mode.
 * @param player Player's id
 */
export function setMode(mode, player) {
    currentMode = mode
    currentPlayer = player

    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active', 'mode-active')
    })

    let activeButton;
    if (currentMode === 'all' || currentMode === 'prepare')
        activeButton = document.getElementById(`mode-${mode}`)
    else if (currentMode === 'player')
        activeButton = document.getElementById(`mode-player-${currentPlayer}`)
    activeButton.classList.add('active', 'mode-active')

    updateDisplay()
}

/**
 * Update battlefield view.
 */
export function updateDisplay() {
    const battlefield = document.getElementById('battlefield')
    const cells = battlefield.querySelectorAll('.cell:not(.coordinate)')
    const modeTitle = document.getElementById('current-mode')
    const modeDescription = document.getElementById('mode-description')
    console.log(JSON.stringify(players))

    cells.forEach(cell => {
        cell.style.opacity = '1'
        cell.style.pointerEvents = 'auto'

        if (cell.classList.contains('ship')) {
            cell.classList.remove('ship-hidden')
        }
    })

    if (currentMode === 'all' || currentMode === 'prepare') {
        if (currentMode === 'prepare') {
            modeTitle.textContent = 'Расставь свой флот'
            modeDescription.textContent = 'Необходимо 4 - одноклеточных, 3 - двухклеточных, 2 - трехклеточных, 1 - четырёхклеточный'
        } else {
            modeTitle.textContent = 'Режим: Все игроки на одном поле'
            modeDescription.textContent = 'На этом поле отображены корабли всех игроков. Цвет корабля соответствует цвету игрока в списке.'
        }

        cells.forEach(cell => {
            clearCell(cell)
            for (let i = 0; i < players.length; i++) {
                const field = players[i].field.field
                fillCell(cell, field, players[0].username === players[i].username)
            }
        })
    } else if (currentMode === 'player') {
        const player = players[currentPlayer]
        const field = player.field.field

        modeTitle.textContent = `Режим: Игрок "${player.username}"`
        modeDescription.textContent = `Ты видишь поле игрока "${player.username}". Только его корабли отображены на поле.`
        cells.forEach(cell => {
            clearCell(cell)
            fillCell(cell, field)
        })
    }
}

/**
 * Cell click executor.
 * @param cell Cell as div object.
 */
function handleCellClick(cell) {
    if (getStatus() === gameStatusTypes.WAITING_SELF_START) {
        const x = parseInt(cell.dataset.col)
        const y = parseInt(cell.dataset.row)
        if (cell.classList.contains('ship')) {
            cell.classList.remove('ship')
            players[0].field.field[y][x] = 'EMPTY'
        } else {
            cell.classList.add('ship')
            players[0].field.field[y][x] = 'SHIP'
        }
    } else if (getStatus() === gameStatusTypes.WAITING_SELF_MOVE) {
        const x = parseInt(cell.dataset.col)
        const y = parseInt(cell.dataset.row)
        attack(x, y);
    }
}

/**
 * Add new player into list of battlefields.
 * @param username Player's name.
 */
export function addPlayerIntoBattlefields(username) {
    let i = 0;
    while (document.querySelector(`#mode-player-${i}`))
        i++

    document.querySelector('#list-of-modes').insertAdjacentHTML('beforeend', createPlayerBattlefieldItem(username, i))
    document.getElementById(`mode-player-${i}`).addEventListener('click', function () {
        setMode(`player`, i)
    })
}

/**
 * Create HTML item for player's battlefield.
 * @param username Player's name.
 * @param index Player's index.
 * @returns {string} HTML item.
 */
function createPlayerBattlefieldItem(username, index) {
    return `
<button type="button" class="btn btn-outline-primary disabled" id="mode-player-${index}">Поле "<span>${username}</span>"
</button>
`
}

/**
 * Fill the cell.
 * @param cell HTML object.
 * @param ignoreEmpty Ignore empty cells.
 * @param field Field.
 */
function fillCell(cell, field, ignoreEmpty = false) {
    const x = parseInt(cell.dataset.col)
    const y = parseInt(cell.dataset.row)

    if (field[y][x] === 'BROKEN_SHIP') {
        cell.classList.add('kill')
    } else if (field[y][x] === 'WRECKED_SHIP' && !cell.classList.contains('kill')) {
        cell.classList.add('hit')
    } else if (field[y][x] === 'SHIP' && !cell.classList.contains('hit') && !cell.classList.contains('kill')) {
        cell.classList.add('ship')
    } else if (field[y][x] === 'EMPTY' && !ignoreEmpty && !cell.classList.contains('ship') && !cell.classList.contains('hit') && !cell.classList.contains('kill')) {
        cell.classList.add('miss')
    }
}

/**
 * Clear the cell.
 * @param cell The HTML object.
 */
function clearCell(cell) {
    cell.classList.remove('kill')
    cell.classList.remove('ship')
    cell.classList.remove('hit')
    cell.classList.remove('miss')
}
