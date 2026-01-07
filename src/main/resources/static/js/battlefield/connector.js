import {basicLog} from "./logging.js";

let client = null;

export function connect(username) {
    client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
            'username': username
        },
        debug: function (str) {
            console.log(str)
        }
    })

    client.activate()
}
