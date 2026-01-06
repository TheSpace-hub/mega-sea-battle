document.addEventListener("DOMContentLoaded", generateListOfGames)

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
            addGameToListOfGames(game['name'], game['id'], 0, game['maxPlayers'])
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Add new game to list.
 * @param name Game's name.
 * @param id Game's id.
 * @param players Players in the game.
 * @param maxPlayers Max players of the game.
 */
function addGameToListOfGames(name, id, players, maxPlayers) {
    const a = document.createElement('a')
    a.href = '/game/' + id
    a.classList.add('text-decoration-none')
    a.innerHTML = 'Бой "' + name + '"'

    const span = document.createElement('span')
    span.classList.add('badge')
    span.classList.add('bg-primary')
    span.classList.add('rounded-pill')
    span.innerHTML = players + ' / ' + maxPlayers

    const li = document.createElement('li')
    li.appendChild(a)
    li.appendChild(span)
    li.classList.add('list-group-item')
    li.classList.add('align-items-center')
    li.classList.add('justify-content-between')
    li.classList.add('d-flex')

    document.querySelector('#list-of-games').appendChild(li)
}
