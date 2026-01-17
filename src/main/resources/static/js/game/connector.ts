import {basicLog, importantActionLog, playerActionLog} from "./logging.js";
import {addPlayer, CellType, Field, gameId, Player} from "./index.js";
import {setPlayerStatusInList} from "./list-of-players.js";
import {GameMode, setMode, updateDisplay} from "./battlefield-utils.js";
import {GameStatus, setStatus} from "./status.js";

// @ts-ignore
import * as SockJS from 'sockjs-client';
// @ts-ignore
import {Client} from "@stomp/stompjs";

let connector: any = null;

enum ConnectorStatus {
    PLAYER_JOIN,
    PLAYER_LEAVE,
    PLAYER_READY,
    PLAYER_STEP,
    PLAYER_ATTACK,
    PLAYER_LOOSE,
    PLAYER_WON,
    GAME_STARTED,
    GAME_FINISHED,
}

class Connector {
    private _client: any;

    constructor() {
        this._client = null;
    }

    connect(username: string) {
        return new Promise((resolve, reject) => {
            this._client = new Client({
                webSocketFactory: () => new SockJS('/ws'),
                connectHeaders: {
                    'username': username
                },
                debug: (str: string) => {
                    console.log(str)
                },
                onConnect: (socket: any) => {
                    this._client.subscribe(`/topic/game-${gameId}`, function (topic: any) {
                        const response = JSON.parse(topic.body)

                        const uuid: string | null = response['uuid']
                        const username: string | null = response['username']
                        let player: Player | null = null;

                        if (uuid != null)
                            player = Player.getPlayerByUuid(uuid)

                        if (response['action'] === 'PLAYER_JOIN') {
                            if (uuid == null)
                                throw new Error("UUID is missing")

                            onPlayerJoin(uuid, response['username'])
                        } else if (response['action'] === 'PLAYER_READY') {
                            onPlayerReady(response['username'])
                        } else if (response['action'] === 'GAME_STARTED') {
                            onGameStarted()
                        } else if (response['action'] === 'PLAYER_STEP') {
                            onOtherPlayerStep(response['username'])
                        } else if (response['action'] === 'PLAYER_ATTACK') {
                            onPlayerAttack(response['username'], response['position']['x'], response['position']['y'])
                        } else if (response['action'] === 'PLAYER_LOOSE') {
                            importantActionLog(response['username'], 'остался без кораблей!')
                        } else if (response['action'] === 'PLAYER_WON') {
                            importantActionLog(response['username'], 'всех победил!')
                            setStatus(GameStatus.PLAYER_WON, response['username'])
                        } else if (response['action'] === 'GAME_FINISHED') {
                            onGameFinished()
                        }
                        updateGameData().then()
                    })
                    updateGameData().then()
                }
            })

            this._client.activate()
            basicLog("Ты подключился к игре")
        })
    }

    attack(x: number, y: number) {
        this.publish('/app/game.attack', {'x': x, 'y': y})
    }

    /**
     * Publish message.
     * @param destination Path to endpoint.
     * @param body Dict content.
     */
    publish(destination: string, body: {}) {
        this._client.publish({
            destination: destination,
            body: JSON.stringify(body)
        })
    }

    closeConnection() {
        this._client.deactivate().then()
    }

}

export async function connect(username: string) {
    connector = new Connector();
    await connector.connect(username);
}

export function submitFieldForVerification(field: Field) {
    connector.publish('/app/game.verify-field', field)
}

export function attack(x: number, y: number) {
    connector.attack(x, y)
}

export async function updateGameData() {
    const response = await fetch(`/api/game-data/${gameId}`)
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

function updatePlayer(player: Player) {
    addPlayer('', player['username'])
    setPlayerStatusInList(player)
}

function onPlayerJoin(uuid: string, username: string) {
    playerActionLog(username, 'подключился к серверу')
    addPlayer(uuid, username)
}

function onPlayerReady(player: Player) {
    playerActionLog(player.username, 'расставил свой флот')
    if (player.uuid === Player.getMainPlayer().uuid) {
        document.querySelector('#start-game-button')?.remove()
        setMode(GameMode.AllPlayers, null)
        updateDisplay()
        setStatus(GameStatus.WAITING_OTHER_START, null)
    }
}

function onGameStarted() {
    basicLog('Бойня начинается')
    document.querySelector(`#mode-all`)?.classList.remove('disabled')
    for (let i = 0; i < Player.getPlayersCount(); i++) {
        document.querySelector(`#mode-player-${i}`)?.classList.remove('disabled')
    }
}

function onOtherPlayerStep(player: Player) {
    if (player.uuid === Player.getMainPlayer().uuid) {
        importantActionLog(player.username, ', твой ход')
        setStatus(GameStatus.WAITING_SELF_MOVE)
    } else {
        playerActionLog(player.username, 'готовит артиллерию')
        setStatus(GameStatus.WAITING_OTHER_MOVE, player.username)
    }
}

function onPlayerAttack(player: Player, x: number, y: number) {
    const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
    if (Player.getMainPlayer().field.field[y][x] === CellType.SHIP)
        Player.getMainPlayer().field.field[y][x] = CellType.WRECKED_SHIP
    playerActionLog(player.username, `атаковал ${letters[x]} ${y + 1}`)
}

function onGameFinished() {
    connector.closeConnection()
}
