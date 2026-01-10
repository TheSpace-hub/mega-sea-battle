import {players} from "./main.js";

/**
 * Add new player into list.
 * @param username Player's name.
 */
export function addPlayerIntoList(username) {
    document.querySelector('#list-of-players').insertAdjacentHTML('beforeend', createItem(username))
    updatePlayersCounter()
}

/**
 * Set player's status in list.
 * @param username Player's name.
 * @param status Player's status.
 */
export function setPlayerStatusInList(username, status) {
    document.querySelector(`#status-${username}`).innerHTML = status;
}

/**
 * Update players counter before players list.
 */
function updatePlayersCounter() {
    document.querySelector('#player-count').innerHTML = players.length.toString()
}

/**
 * Create the HTML item.
 * @param username Player's username
 * @returns {string}
 */
function createItem(username) {
    const index = players.findIndex(player => player.username === username) + 1
    return `
<li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
        <span class="player-color-dot player-${index}-color"></span>
        <span>${username}</span>
    </div>
    <div class="ship-count" id="status-${username}">Подключение...</div>
</li>
`
}
