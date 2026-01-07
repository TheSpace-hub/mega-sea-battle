import {addPlayerIntoList} from "./list-of-players.js";
import {basicLog, playerActionLog} from "./logging.js";
import {initBattlefield, setMode, updateDisplay} from "./battlefield.js";

const players = [
    {id: 1, name: 'Морской Волк', color: 'player-1-color'},
    {id: 2, name: 'Пират', color: 'player-2-color'},
    {id: 3, name: 'Капитан', color: 'player-3-color'},
    {id: 4, name: 'Адмирал', color: 'player-4-color'},
    {id: 5, name: 'Штурман', color: 'player-5-color'}
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
