import {addPlayerIntoList} from "./list-of-players.js";
import {initBattlefield, setMode, updateDisplay, addPlayerIntoBattlefields, verifyField} from "./battlefield-utils.js";
import {connect} from "./connector.js";
import {changeGameStatus, gameStatusTypes} from "./status.js";

export const players = []

document.addEventListener('DOMContentLoaded', function () {
    addMainPlayer()
    initBattlefield()
    setupEventListeners()
    updateDisplay()

    connect(players[0].name).then()
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
        name: username,
        field: Array.from({length: 10}, () => Array(10).fill('UNKNOWN'))
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
        name: document.body.dataset.username,
        field: Array.from({length: 10}, () => Array(10).fill('UNKNOWN'))
    })
}

/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all').addEventListener('click', function () {
        setMode('all', 0)
    })

    document.getElementById('start-game-button').addEventListener('click', function () {
        verifyField()
    })
}



