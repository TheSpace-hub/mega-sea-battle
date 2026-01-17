import {Player, PlayerStatus} from "./index.js";

export function addPlayerIntoList(player: Player) {
    document.querySelector('#list-of-players')?.insertAdjacentHTML(
        'beforeend', createItem(player))
    updatePlayersCounter()
}

export function setPlayerStatusInList(player: Player) {
    let name = '?Status?'

    if (player.status === PlayerStatus.PREPARING)
        name = 'Готовит флот';
    else if (player.status === PlayerStatus.READY)
        name = 'Готов к бою';
    else if (player.status === PlayerStatus.LOOSE)
        name = 'Без кораблей';
    else if (player.status === PlayerStatus.WON)
        name = 'Всех победил';

    (document.querySelector(`#status-${player.uuid}`) as HTMLElement).innerHTML = name;
}

function updatePlayersCounter() {
    (document.querySelector('#player-count') as HTMLElement).innerHTML = Player.getPlayersCount().toString()
}

function createItem(player: Player) {
    return `
<li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
        <span class="player-color-dot player-1-color"></span>
        <span>${player.username}</span>
    </div>
    <div class="ship-count" id="status-${player.username}">Подключение...</div>
</li>
`
}