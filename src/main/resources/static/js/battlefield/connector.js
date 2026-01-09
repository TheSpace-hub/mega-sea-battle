import {basicLog, playerActionLog} from "./logging.js";
import {addPlayer, players} from "./main.js";
import {setPlayerStatusInList} from "./list-of-players.js";

const id = window.location.pathname.split('/').pop();
let connector = null;

/**
 * Class connects to server and implements publish func.
 */
class Connector {
    constructor() {
        this.client = null;
    }

    connect(username) {
        return new Promise((resolve, reject) => {
            this.client = new StompJs.Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                connectHeaders: {
                    'username': username,
                    'id': id
                },
                debug: (str) => {
                    console.log(str)
                },
                onConnect: (socket) => {
                    this.client.subscribe(`/topic/game-${id}`, function (topic) {
                        const response = JSON.parse(topic.body)
                        console.log('/topic/game Data:', topic.body)
                        if (response['action'] === 'PLAYER_JOIN') {
                            onPlayerJoin(response['username'])
                        } else if (response['action'] === 'PLAYER_READY') {
                            onPlayerReady(response['username'])
                        }
                        updateGameData().then()
                    })
                    updateGameData().then()
                }
            })

            this.client.activate()
            basicLog("Ты подключился к игре")
        })
    }

    /**
     * Publish message.
     * @param destination Path to endpoint.
     * @param body Dict content.
     */
    publish(destination, body) {
        this.client.publish({
            destination: destination,
            body: JSON.stringify(body)
        })
    }
}

export async function connect(username) {
    connector = new Connector(username);
    await connector.connect(username);
}

/**
 * Submit the field for verification.
 * @param field List of lists with field.
 */
export function submitFieldForVerification(field) {
    connector.publish('/app/game.verify-field', field)
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

    const data = await response.json()
    for (let i = 0; i < data['players'].length; i++) {
        addPlayer(data['players'][i]['username'])
        setPlayerStatusInList(data['players'][i]['username'], data['players'][i]['status'])
    }

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
 * On player ready.
 * @param username Player's name.
 */
function onPlayerReady(username) {
    playerActionLog(username, 'расставил свой флот')
    if (username === players[0]['name']) {
        document.querySelector('#start-game-button').disabled = true
    }
}
