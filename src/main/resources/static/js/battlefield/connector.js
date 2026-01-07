import {basicLog} from "./logging.js";
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
                const message = JSON.parse(topic.body)
                if (message['action'] === 'PLAYER_JOIN') {
                    console.log(topic.body)
                    addPlayer(message['username'])
                }
            })
        }
    })

    client.activate()
    basicLog('Ты подключился к игре')
}
