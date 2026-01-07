import {basicLog, playerActionLog} from "./logging.js";
import {addPlayer} from "./battlefield.js";

let client = null;

export function connect(username) {
    const id = window.location.pathname.split('/').pop();
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
            })
        }
    })

    client.activate()
    basicLog('Ты подключился к игре')
}

/**
 * On player join.
 * @param username New player's name.
 */
function onPlayerJoin(username) {
    playerActionLog(username, 'подключился к серверу')
    addPlayer(username)
}
