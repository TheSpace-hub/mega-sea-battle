/**
 * Add new player into list.
 * @param username Player's name.
 */
export function addPlayerIntoList(username) {
    document.querySelector('#list-of-players').insertAdjacentHTML('beforeend', createItem(username))
}

/**
 * Create the HTML item.
 * @param username Player's username
 * @returns {string}
 */
function createItem(username) {
    return `
<li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
        <span class="player-color-dot player-2-color"></span>
        <span>${username}</span>
    </div>
    <div class="ship-count">Подключение...</div>
</li>
`
}
