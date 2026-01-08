import {basicLog, playerActionLog} from "./logging.js";
import {addPlayer} from "./battlefield.js";

let client = null;
const secret = generateSecretKey();
const id = window.location.pathname.split('/').pop();

export function connect(username) {
    client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
            'username': username,
            'id': id
        },
        debug: function (str) {
            console.log(str)
        },
        onConnect: function (socket) {
            client.subscribe(`/topic/game-${id}`, function (topic) {
                const response = JSON.parse(topic.body)
                console.log(topic.body)
                if (response['action'] === 'PLAYER_JOIN') {
                    onPlayerJoin(response['username'])
                }
                updateGameData().then()
            })
        }
    })

    client.activate()
    basicLog('Ты подключился к игре')
}

/**
 * Update filed before any action.
 */
export async function updateGameData() {
    const response = await fetch(`/api/game-data/${id}`)
    if (!response.ok) {
        console.error(response.statusText)
        return
    }

    const data = JSON.stringify(await response.json())
    console.log(`Data: ${data}`)
}

/**
 * On player join.
 * @param username New player's name.
 */
function onPlayerJoin(username) {
    playerActionLog(username, 'подключился к серверу')
    addPlayer(username)
}

/**
 * Generate secret key for user.
 * @returns {string} Secret key.
 */
function generateSecretKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}
