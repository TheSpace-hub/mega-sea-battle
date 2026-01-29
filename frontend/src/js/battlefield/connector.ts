import {basicLog, importantActionLog, playerActionLog, showMessage} from "./logging.js";
import {addPlayer, players} from "./main.js";
import {setPlayerStatusInList} from "./list-of-players.js";
import {setMode, updateDisplay} from "./battlefield-utils.js";
import {changeGameStatus, gameStatusTypes} from "./status.js";

const id = window.location.pathname.split('/').pop();
let connector: any = null;

/**
 * Class connects to server and implements publish func.
 */
class Connector {
    private client: any;

    constructor() {
        this.client = null;
    }

    connect(username: string) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.client = new StompJs.Client({
                // @ts-ignore
                webSocketFactory: () => new SockJS('/ws'),
                connectHeaders: {
                    'username': username,
                    'id': id
                },
                debug: (str: string) => {
                    console.log(str);
                },
                onConnect: (socket: any) => {
                    this.client.subscribe(`/topic/game-${id}`, function (topic: any) {
                        const response = JSON.parse(topic.body);
                        if (response['action'] === 'PLAYER_JOIN') {
                            onPlayerJoin(response['username']);
                        } else if (response['action'] === 'PLAYER_READY') {
                            onPlayerReady(response['username']);
                        } else if (response['action'] === 'GAME_STARTED') {
                            onGameStarted();
                        } else if (response['action'] === 'PLAYER_STEP') {
                            onOtherPlayerStep(response['username']);
                        } else if (response['action'] === 'PLAYER_ATTACK') {
                            onPlayerAttack(response['username'], response['position']['x'], response['position']['y']);
                        } else if (response['action'] === 'PLAYER_LOOSE') {
                            importantActionLog(response['username'], 'остался без кораблей!');
                        } else if (response['action'] === 'PLAYER_WON') {
                            importantActionLog(response['username'], 'всех победил!')
                            changeGameStatus(gameStatusTypes.PLAYER_WON, response['username']);
                        } else if (response['action'] === 'GAME_FINISHED') {
                            onGameFinished();
                        }
                        updateGameData().then();
                    })
                    updateGameData().then();
                }
            })

            this.client.activate();
            basicLog("Ты подключился к игре");
        })
    }

    /**
     * Attack the cell.
     * @param x Pos. x.
     * @param y Pos. y.
     */
    attack(x: number, y: number) {
        this.publish('/app/game.attack', {'x': x, 'y': y})
    }

    /**
     * Publish message.
     * @param destination Path to endpoint.
     * @param body Dict content.
     */
    publish(destination: string, body: any) {
        this.client.publish({
            destination: destination,
            body: JSON.stringify(body)
        })
    }

    closeConnection() {
        this.client.deactivate().then()
    }

}

export async function connect(username: string) {
    connector = new Connector();
    await connector.connect(username);
}

/**
 * Submit the field for verification.
 * @param field List of lists with field.
 */
export function submitFieldForVerification(field: any) {
    connector.publish('/app/game.verify-field', field);
}

/**
 * Attack the cell.
 * @param x Pos. x.
 * @param y Pos. y.
 */
export function attack(x: number, y: number) {
    connector.attack(x, y);
}

/**
 * Update filed before any action.
 */
export async function updateGameData() {
    const response = await fetch(`/api/game-data/${id}`);
    if (!response.ok) {
        console.error(response.statusText);
        return;
    }

    const data = await response.json();
    for (let i = 0; i < data['players'].length; i++) {
        updatePlayer(data['players'][i]);
    }

    updateDisplay();
}

/**
 * Update player by response data.
 * @param player
 */
function updatePlayer(player: any) {
    addPlayer(player['username']);
    setPlayerStatusInList(player['username'], player['status']);
    for (let i = 1; i < players.length; i++) {
        if (players[i].username === player['username']) {
            players[i].field = player['field'];
            break;
        }
    }
}

/**
 * On player join.
 * @param username New player's name.
 */
function onPlayerJoin(username: string) {
    const fixedUsername = username.replace(' ', '');
    playerActionLog(username, 'подключился к серверу');
    addPlayer(fixedUsername);
}

/**
 * On player ready.
 * @param username Player's name.
 */
function onPlayerReady(username: string) {
    playerActionLog(username, 'расставил свой флот');
    const fixedUsername = username.replace(' ', '');
    if (fixedUsername === players[0].username) {
        document.querySelector('#start-game-button')?.remove();
        setMode('all');
        updateDisplay();
        changeGameStatus(gameStatusTypes.WAITING_OTHER_START);
    }
}

/**
 * Allow "mode-all" and allow mode with another players.
 */
function onGameStarted() {
    basicLog('Бойня начинается');
    document.querySelector(`#mode-all`)?.classList.remove('disabled');
    for (let i = 0; i < players.length; i++) {
        document.querySelector(`#mode-player-${i}`)?.classList.remove('disabled');
    }
}

/**
 * On player step.
 * @param username Player's name.
 */
function onOtherPlayerStep(username: string) {
    const fixedUsername = username.replace(' ', '');
    if (fixedUsername === players[0].username) {
        importantActionLog(username, ', твой ход');
        changeGameStatus(gameStatusTypes.WAITING_SELF_MOVE);
    } else {
        playerActionLog(username, 'готовит артиллерию');
        changeGameStatus(gameStatusTypes.WAITING_OTHER_MOVE, username);
    }
}

function onPlayerAttack(username: string, x: number, y: number) {
    const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
    if (players[0].field.field[y][x] === 'SHIP')
        players[0].field.field[y][x] = 'WRECKED_SHIP';
    playerActionLog(username, `атаковал ${letters[x]} ${y + 1}`);
}

function onGameFinished() {
    connector.closeConnection();
}
