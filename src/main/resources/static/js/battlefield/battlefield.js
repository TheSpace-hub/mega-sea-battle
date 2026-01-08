import {addPlayerIntoList} from "./list-of-players.js";
import {basicLog, playerActionLog, showMessage} from "./logging.js";
import {initBattlefield, setMode, updateDisplay, addPlayerIntoBattlefields} from "./battlefield-utils.js";
import {connect} from "./connector.js";
import {changeGameStatus, gameStatusTypes} from "./status.js";
import {updateGameData} from "./connector.js";

export const players = []

document.addEventListener('DOMContentLoaded', function () {
    addMainPlayer()
    initBattlefield()
    setupEventListeners()
    updateDisplay()

    connect(players[0].name)
    changeGameStatus(gameStatusTypes['WAITING_SELF_START'])
})

/**
 * Add other player.
 * @param username Player's name.
 */
export function addPlayer(username) {
    for (let i = 0; i < players.length; i++) {
        if (players[i]['name'] === username) {
            return
        }
    }

    players.push({
        id: players.length,
        name: username
    })

    addPlayerIntoBattlefields(username)
    addPlayerIntoList(username)
}

/**
 * Initialization function for the user who owns the page.
 */
function addMainPlayer() {
    players.push({
        id: players.length,
        name: document.body.dataset.username
    })

    addPlayerIntoBattlefields(players[0].name)
}

/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all').addEventListener('click', function () {
        setMode('all')
    })

    document.getElementById('start-game-button').addEventListener('click', function () {
        this.disabled = true
        this.textContent = 'Ожидание хода...'

        setTimeout(() => {
            document.getElementById('start-game-button').textContent = 'Завершить ход (не ваш ход)'
        }, 3000)
    })
}



