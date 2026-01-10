import {basicLog, playerActionLog} from "./logging.js";
import {addPlayer, players} from "./main.js";
import {setPlayerStatusInList} from "./list-of-players.js";
import {updateDisplay, updateFieldData} from "./battlefield-utils.js";
import {changeGameStatus, gameStatusTypes} from "./status.js";

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
                        } else if (response['action'] === 'GAME_STARTED') {
                            onGameStarted()
                        } else if (response['action'] === 'PLAYER_STEP') {
                            onOtherPlayerStep(response['username'])
                        } else if (response['action'] === 'PLAYER_ATTACK') {
                            onPlayerAttack(response['username'], response['position']['x'], response['position']['y'])
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
     * Attack the cell.
     * @param x Pos. x.
     * @param y Pos. y.
     */
    attack(x, y) {
        this.publish('/app/game.attack', {'x': x, 'y': y})
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
 * Attack the cell.
 * @param x Pos. x.
 * @param y Pos. y.
 */
export function attack(x, y) {
    connector.attack(x, y)
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
        updatePlayer(data['players'][i])
    }

    updateDisplay()
}

/**
 * Update player by response data.
 * @param player
 */
function updatePlayer(player) {
    addPlayer(player['username'])
    setPlayerStatusInList(player['username'], player['status'])
    for (let i = 0; i < players.length; i++) {
        if (players[i].username === player['username']) {
            players[i].field = player['field']
            break
        }
    }
    updateFieldData()
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
    if (username === players[0].username) {
        document.querySelector('#start-game-button').remove()
        changeGameStatus(gameStatusTypes.WAITING_OTHER_START)
    }
}

/**
 * Allow "mode-all" and allow mode with another players.
 */
function onGameStarted() {
    basicLog('Бой начинается')
    document.querySelector(`#mode-all`).classList.remove('disabled')
    for (let i = 0; i < players.length; i++) {
        document.querySelector(`#mode-player-${i}`).classList.remove('disabled')
    }
}

/**
 * On player step.
 * @param username Player's name.
 * @param x Pos. x.
 * @param y Pos. y.
 */
function onOtherPlayerStep(username) {
    if (username === players[0].username) {
        playerActionLog(username, ', твой ход')
        changeGameStatus(gameStatusTypes.WAITING_SELF_MOVE)
    } else {
        playerActionLog(username, 'готовит артиллерию')
        changeGameStatus(gameStatusTypes.WAITING_OTHER_MOVE, username)
    }
}

function onPlayerAttack(username, x, y) {
    const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
    playerActionLog(username, `атаковал ${letters[x]} ${y}`)
}
