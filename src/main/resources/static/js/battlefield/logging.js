/**
 * Add basic log into list.
 * @param content Log's content.
 */
export function basicLog(content) {
    document.querySelector('#logs').insertAdjacentHTML('beforeend', createBasicLogItem(content))
}

/**
 * Add log with player's action to list.
 * @param username Player's username.
 * @param content Log's content.
 */
export function playerActionLog(username, content) {
    document.querySelector('#logs').insertAdjacentHTML('beforeend', createPlayerActionLogItem(username, content))
}

/**
 * Create the HTML item.
 * @param content Message.
 * @returns {string}
 */
function createBasicLogItem(content) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return `
<div class="mb-2">
    <span class="badge bg-secondary">${time}</span>
    <span>${content}</span>
</div>
`
}

/**
 * Create the HTML item for log with player action.
 * @param username Player's username.
 * @param content Log content.
 * @returns {string}
 */
function createPlayerActionLogItem(username, content) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return `
<div class="mb-2">
    <span class="badge bg-secondary">${time}</span>
    <span>Игрок <strong>${username}</strong> ${content}</span>
</div>
`
}

/**
 * Show message on top of the screen.
 * @param text Message content.
 * @param type Message type. Using "info", "success" or something else.
 */
export function showMessage(text, type) {
    const alertDiv = document.createElement('div')
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
    alertDiv.style.top = '20px'
    alertDiv.style.right = '20px'
    alertDiv.style.zIndex = '9999'
    alertDiv.style.minWidth = '300px'
    alertDiv.innerHTML = `
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
        `

    document.body.appendChild(alertDiv)

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove()
        }
    }, 3000)
}
