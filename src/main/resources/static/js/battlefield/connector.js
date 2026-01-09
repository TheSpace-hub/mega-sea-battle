import {basicLog, playerActionLog} from "./logging.js";
import {addPlayer, players} from "./battlefield.js";
import {setPlayerStatusInList} from "./list-of-players.js";

let client = null;
const id = window.location.pathname.split('/').pop();

export function connect(username) {
    client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        debug: function (str) {
            console.log(str)
        },
        onConnect: function (socket) {
            client.publish({
                destination: '/app/game.register',
                body: JSON.stringify({
                    'username': username,
                    'id': id
                })
            });
            client.subscribe(`/topic/game-${id}`, function (topic) {
                const response = JSON.parse(topic.body)
                console.log(topic.body)
                if (response['action'] === 'PLAYER_JOIN') {
                    onPlayerJoin(response['username'])
                }
                updateGameData().then()
            })
            updateGameData().then()
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
