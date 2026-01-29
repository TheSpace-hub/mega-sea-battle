document.addEventListener("DOMContentLoaded", generateListOfGames)
document.querySelector('#join')?.addEventListener('click', joinInToGameByJoinButton)
document.querySelector('#create-game')?.addEventListener('click', createGame)
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
function addGameToListOfGames(id: string, players: number, maxPlayers: number) {
    document.querySelector('#list-of-games')?.insertAdjacentHTML('beforeend', createItem(id, players, maxPlayers))
}

/**
 * Create game item.
 * @param id Game id.
 * @param players Players count.
 * @param maxPlayers Max players count in the game.
 * @returns {string}
 */
function createItem(id: string, players: number, maxPlayers: number): string {
    return `
<li class="list-group-item align-items-center justify-content-between d-flex">
    <a href="#" id="game-${id}" class="text-decoration-none">Бой #${id.toUpperCase()}</a>
    <span class="badge bg-primary rounded-pill">${players} / ${maxPlayers}</span>
</li>
`
}

/**
 * Join in to the game by id.
 * @param id Game's id.
 */
function joinInToGame(id: string) {
    const username: string = (document.querySelector('#username') as HTMLInputElement).value
    if (id === '')
        return false
    if (canJoin())
        window.location.href = `/game/${id}?username=${username}`
}

/**
 * Open game button executor.
 */
function joinInToGameByJoinButton() {
    const id: string = (document.querySelector('#game-id') as HTMLInputElement).value
    joinInToGame(id)
}

/**
 * Join in to the game by link in the list.
 * @param event
 */
function joinInToGameByList(event: any) {
    if (!event.target.matches('a'))
        return
    if (!event.target.href.endsWith('#'))
        return

    const id = event.target.id.split('-').at(1)
    joinInToGame(id)
}

/**
 * Check is user can join.
 * @returns {boolean} Can user join.
 */
function canJoin(): boolean {
    const username = (document.querySelector('#username') as HTMLInputElement).value
    if (username === '') {
        document.querySelector('#write-username-error')?.classList.remove('d-none')
        return false
    }

    return true
}

/**
 * Create game by list of player's count.
 */
async function createGame() {
    if (!canJoin())
        return
    const playersCount = (document.querySelector('#players-count') as HTMLSelectElement).value

    const response = await fetch(`/api/create-game/${playersCount}`)
    if (!response.ok) {
        console.error(response.statusText)
    }

    const data = await response.json()
    joinInToGame(data['id'])
}