import {basicLog} from "./logging.js";

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
        }
    })

    client.activate()
    basicLog('Ты подключился к игре')
}
