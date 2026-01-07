import {addPlayerIntoList} from "./list-of-players.js";
import {basicLog, playerActionLog} from "./logging.js";
import {initBattlefield, setMode, updateDisplay, addPlayerIntoBattlefields} from "./battlefield.js";

export const players = [
    {id: 0, name: 'Морской Волк', color: 'player-1-color'},
]

document.addEventListener('DOMContentLoaded', function () {
    basicLog('Ты подключился к игре')
    initBattlefield()
    setupEventListeners()
    updateDisplay()
})


/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all').addEventListener('click', function () {
        setMode('all')
    })

    document.getElementById(`mode-player-0`).addEventListener('click', function () {
        setMode(`player-0`)
    })


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
