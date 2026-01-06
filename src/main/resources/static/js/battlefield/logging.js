/**
 * Add basic log into list.
 * @param content Log's content.
 */
export function basicLog(content) {
    document.querySelector('#logs').insertAdjacentHTML('beforeend', createBasicLogItem(content))
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