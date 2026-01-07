document.addEventListener("DOMContentLoaded", generateListOfGames)
document.querySelector('#join').addEventListener('click', joinInToGameByJoinButton)
document.addEventListener('click', joinInToGameByList)

/**
 * Fill in the list with the latest games.
 * This function use API (/api/list-of-games) for to get info.
 */
async function generateListOfGames() {
    try {
        const response = await fetch("/api/list-of-games")
        if (!response.ok) {
            console.error(response.statusText)
        }

        const data = await response.json()
        for (const game of data) {
            addGameToListOfGames(game['id'], 0, game['maxPlayers'])
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Add new game to list.
 * @param id Game's id.
 * @param players Players in the game.
 * @param maxPlayers Max players of the game.
 */
function addGameToListOfGames(id, players, maxPlayers) {
    document.querySelector('#list-of-games').insertAdjacentHTML('beforeend', createItem(id, players, maxPlayers))
}

/**
 * Create game item.
 * @param id Game id.
 * @param players Players count.
 * @param maxPlayers Max players count in the game.
 * @returns {string}
 */
function createItem(id, players, maxPlayers) {
    return `
<li class="list-group-item align-items-center justify-content-between d-flex">
    <a href="#" id="game-${id}" class="text-decoration-none">Бой "${id}"</a>
    <span class="badge bg-primary rounded-pill">${players} / ${maxPlayers}</span>
</li>
`
}

/**
 * Join in to the game by id.
 * @param id Game's id.
 */
function joinInToGame(id) {
    const username = document.querySelector('#username').value
    if (id === '' || username === '')
        return
    window.location.href = `/game/${id}?username=${username}`
}

/**
 * Open game button executor.
 */
function joinInToGameByJoinButton() {
    const id = document.querySelector('#game-id').value
    joinInToGame(id)
}

/**
 * Join in to the game by link in the list.
 * @param event
 */
function joinInToGameByList(event) {
    if (!event.target.matches('a'))
        return
    if (!event.target.href.endsWith('#'))
        return

    const id = event.target.id.split('-').at(1)
    joinInToGame(id)
}
