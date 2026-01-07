export const gameStatusTypes = Object.freeze({
    WAITING_SELF_START: 'waiting-self-start',
    WAITING_OTHER_START: 'waiting-other-start',
    WAITING_SELF_MOVE: 'waiting-self-move',
    WAITING_OTHER_MOVE: 'waiting-other-move',
    GAME_END: 'game-end',
})

let status = gameStatusTypes.WAITING_SELF_START

/**
 * Change game status.
 * @param type Game status.
 * @param username Player's name if needed. Can be null.
 */
export function changeGameStatus(type, username = null) {
    const statusInfo = document.querySelector('#status-info')
    const statusUsername = document.querySelector('#status-username')
    status = type

    if (type === 'waiting-self-start') {
        statusInfo.textContent = 'Расставь свои корабли на поле, а затем начни игру.'
        statusUsername.textContent = ''
    } else if (type === 'waiting-other-start') {
        statusInfo.textContent = 'Дождись, пока другие расставят свой флот.'
        statusUsername.textContent = ''
    } else if (type === 'waiting-self-move') {
        statusInfo.textContent = 'Сделай выстрел, выбрав клетку на поле.'
        statusUsername.textContent = username
    } else if (type === 'waiting-other-move') {
        statusInfo.textContent = 'Подожди, сейчас ход игрока '
        statusUsername.textContent = username
    } else if (type === 'waiting-other-move') {
        statusInfo.textContent = 'Весь флот на дне! В игре победил '
        statusUsername.textContent = username
    }
}

/**
 * Get status.
 * @returns {string} Status.
 */
export function getStatus() {
    return status
}
