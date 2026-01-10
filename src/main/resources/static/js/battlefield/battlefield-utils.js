import {players} from "./main.js";
import {gameStatusTypes, getStatus} from "./status.js";
import {submitFieldForVerification} from "./connector.js";

const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']

let currentMode = 'all'
let currentPlayer = 1

/**
 * Ask the server about the correctness of the field. If the field is correct, it will be registered.
 */
export function verifyField() {
    submitFieldForVerification(
        {
            sizeX: 10,
            sizeY: 10,
            field: readField()
        })
}

/**
 * Read the field and get the ships placed by the user.
 * @return List of lists with field.
 */
function readField() {
    let field = Array.from({length: 10}, () => Array(10).fill(null))

    const cells = document.querySelectorAll('#battlefield div.cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.row)
        const y = parseInt(cell.dataset.col)
        if (isNaN(x) || isNaN(y))
            return
        field[y][x] = cell.dataset.state
    })

    return field
}

/**
 * In order to display the field correctly, you need to write data on
 * the value of each player in the dataset section of each cell.
 * @param players Players list.
 */
export function initFieldData(players) {
    for (let i = 0; i < players.length; i++) {
        const cells = document.querySelectorAll('#battlefield div.cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.row)
            const y = parseInt(cell.dataset.col)
            if (isNaN(x) || isNaN(y))
                return
            cell.dataset.state = players[i]['field'].toString()
        })
    }
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
        numberCell.textContent = row
        battlefield.appendChild(numberCell)

        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            cell.dataset.row = row
            cell.dataset.col = col
            cell.dataset.state = 'EMPTY'

            cell.addEventListener('click', function () {
                handleCellClick(this)
            })

            battlefield.appendChild(cell)
        }
    }

    document.getElementById(`mode-player-0`).addEventListener('click', function () {
        setMode(`player-0`)
    })
}

/**
 * Setting the display mode. Selecting a player to view.
 * @param mode
 */
export function setMode(mode) {
    currentMode = mode

    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active', 'mode-active')
    })

    const activeButton = document.getElementById(`mode-${mode}`)
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

    cells.forEach(cell => {
        cell.style.opacity = '1'
        cell.style.pointerEvents = 'auto'

        if (cell.classList.contains('ship')) {
            cell.classList.remove('ship-hidden')
        }
    })

    if (currentMode === 'all') {
        modeTitle.textContent = 'Режим: Все игроки на одном поле'
        modeDescription.textContent = 'На этом поле отображены корабли всех игроков. Цвет корабля соответствует цвету игрока в списке.'

        cells.forEach(cell => {
            if (cell.dataset.ship === 'true') {
                const playerId = parseInt(cell.dataset.player)
                cell.style.backgroundColor = getComputedStyle(document.documentElement)
                    .getPropertyValue(`--player${playerId}-color`)
                cell.style.color = 'white'
            }
        })
    } else {
        const playerId = parseInt(currentMode.replace('player', ''))
        const player = players.find(p => p.id === playerId)

        modeTitle.textContent = `Режим: Игрок "${player.name}"`
        modeDescription.textContent = `Ты видишь поле игрока "${player.name}". Только его корабли отображены на поле.`

        cells.forEach(cell => {
            if (cell.dataset.ship === 'true') {
                const cellPlayerId = parseInt(cell.dataset.player)

                if (cellPlayerId === playerId) {
                    cell.style.backgroundColor = getComputedStyle(document.documentElement)
                        .getPropertyValue(`--player${playerId}-color`)
                    cell.style.color = 'white'
                } else {
                    cell.style.opacity = '0.3'
                    cell.style.pointerEvents = 'none'

                    if (!cell.classList.contains('chit')) {
                        cell.classList.add('ship-hidden')
                        cell.classList.remove('ship')
                        cell.textContent = ''
                    }
                }
            } else {
                if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
                    cell.style.opacity = '0.7'
                }
            }
        })
    }
}

/**
 * Cell click executor.
 * @param cell Cell as div object.
 */
function handleCellClick(cell) {
    if (getStatus() === gameStatusTypes.WAITING_SELF_START) {
        if (cell.classList.contains('ship')) {
            cell.classList.remove('ship')
            cell.dataset.state = 'EMPTY'
        } else {
            cell.classList.add('ship')
            cell.dataset.state = 'SHIP'
        }
    }
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
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
        setMode(`player-${i}`)
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
