export function basicLog(content: string) {
    document.querySelector('#logs')?.insertAdjacentHTML('afterbegin', createBasicLogItem(content))
}

export function playerActionLog(username: string, content: string) {
    document.querySelector('#logs')?.insertAdjacentHTML('afterbegin', createPlayerActionLogItem(username, content))
}

export function importantActionLog(username: string, content: string) {
    document.querySelector('#logs')?.insertAdjacentHTML('afterbegin', createImportantActionLogItem(username, content))
}

function createBasicLogItem(content: string) {
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

function createPlayerActionLogItem(username: string, content: string) {
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

function createImportantActionLogItem(username: string, content: string) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    return `
<div class="mb-2">
    <span class="badge bg-primary">${time}</span>
    <span>Игрок <strong>${username}</strong> ${content}</span>
</div>
`
}

// TODO - create type
export function showMessage(text: string, type: string) {
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