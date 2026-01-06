import {addPlayerIntoList} from "./list-of-players.js";

const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']

const players = [
    {id: 1, name: 'Морской Волк', color: 'player-1-color'},
    {id: 2, name: 'Пират', color: 'player-2-color'},
    {id: 3, name: 'Капитан', color: 'player-3-color'},
    {id: 4, name: 'Адмирал', color: 'player-4-color'},
    {id: 5, name: 'Штурман', color: 'player-5-color'}
]

let currentMode = 'all'
let currentPlayer = 1

document.addEventListener('DOMContentLoaded', function () {
    initBattlefield()
    setupEventListeners()
    updateDisplay()
})

/**
 * Creating a battlefield.
 */
function initBattlefield() {
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

    for (let row = 1; row <= 10; row++) {
        const numberCell = document.createElement('div')
        numberCell.className = 'cell coordinate'
        numberCell.textContent = row
        battlefield.appendChild(numberCell)

        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            cell.dataset.row = row
            cell.dataset.col = col

            cell.addEventListener('click', function () {
                if (currentMode === 'all' || (cell.dataset.player && parseInt(cell.dataset.player) === currentPlayer)) {
                    handleCellClick(this)
                }
            })

            battlefield.appendChild(cell)
        }
    }
}

/**
 * Cell click executor.
 * @param cell Cell as div object.
 */
function handleCellClick(cell) {
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
    }
}

/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all').addEventListener('click', function () {
        setMode('all')
    })

    for (let i = 1; i <= 5; i++) {
        document.getElementById(`mode-player${i}`).addEventListener('click', function () {
            setMode(`player${i}`)
        })
    }


    document.getElementById('btn-end-turn').addEventListener('click', function () {
        showMessage('Ход завершен. Ожидание других игроков...', 'warning')
        this.disabled = true
        this.textContent = 'Ожидание хода...'

        setTimeout(() => {
            showMessage('Сейчас ходит игрок "Пират"', 'info')
            document.getElementById('btn-end-turn').textContent = 'Завершить ход (не ваш ход)'
        }, 3000)
    })
}

/**
 * Setting the display mode. Selecting a player to view.
 * @param mode
 */
function setMode(mode) {
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
function updateDisplay() {
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
        modeDescription.textContent = `Вы видите поле игрока "${player.name}". Только его корабли отображены на поле.`

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
 * Show message on top of the screen.
 * @param text Message content.
 * @param type Message type. Using "info", "success" or something else.
 */
function showMessage(text, type) {
    const alertDiv = document.createElement('div')
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
    alertDiv.style.top = '20px'
    alertDiv.style.right = '20px'
    alertDiv.style.zIndex = '9999'
    alertDiv.style.minWidth = '300px'
    alertDiv.innerHTML = `
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
        `

    document.body.appendChild(alertDiv)

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove()
        }
    }, 3000)
}
