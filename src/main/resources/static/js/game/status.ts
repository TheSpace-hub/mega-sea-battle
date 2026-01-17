export enum GameStatus {
    WAITING_SELF_START,
    WAITING_OTHER_START,
    WAITING_SELF_MOVE,
    WAITING_OTHER_MOVE,
    PLAYER_WON,
}

export function setStatus(status: GameStatus, username: string | null = null) {
    const statusInfo: HTMLElement = document.querySelector('#status-info') as HTMLElement;
    const statusUsername: HTMLElement = document.querySelector('#status-username') as HTMLElement;
    currentStatus = status;

    if (status === GameStatus.WAITING_SELF_START) {
        statusInfo.textContent = 'Расставь свои корабли на поле, а затем начни игру.'
        statusUsername.textContent = ''
    } else if (status === GameStatus.WAITING_OTHER_START) {
        statusInfo.textContent = 'Дождись, пока другие расставят свой флот.'
        statusUsername.textContent = ''
    } else if (status === GameStatus.WAITING_SELF_MOVE) {
        statusInfo.textContent = 'Сделай выстрел, выбрав клетку на поле.'
        statusUsername.textContent = ''
    } else if (status === GameStatus.WAITING_OTHER_MOVE) {
        statusInfo.textContent = 'Подожди, сейчас ход игрока '
        statusUsername.textContent = username
    } else if (status === GameStatus.PLAYER_WON) {
        statusInfo.textContent = 'Весь флот врагов на дне! В игре победил '
        statusUsername.textContent = username
    }
}

let currentStatus: GameStatus = GameStatus.WAITING_SELF_START;

export function getStatus(): GameStatus {
    return currentStatus;
}
