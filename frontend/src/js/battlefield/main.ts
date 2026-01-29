import {addPlayerIntoList} from "./list-of-players.js";
import {initBattlefield, setMode, updateDisplay, addPlayerIntoBattlefields, verifyField} from "./battlefield-utils.js";
import {connect} from "./connector.js";
import {changeGameStatus, gameStatusTypes} from "./status.js";

class Player {
    private id: any;
    public username: string;
    public field: Field;

    constructor(id: any, username: string) {
        this.id = id;
        this.username = username;
        this.field = new Field(10, 10, Array.from({length: 10}, () => Array(10).fill('UNKNOWN')))
    }
}

class Field {
    private sizeX: number;
    private sizeY: number;
    public field: string[][];

    constructor(sizeX: number, sizeY: number, field: string[][]) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.field = field;
    }
}

export const players: Player[] = []

document.addEventListener('DOMContentLoaded', function () {
    addMainPlayer();
    initBattlefield();
    setupEventListeners();
    updateDisplay();

    connect(players[0].username).then();
    changeGameStatus(gameStatusTypes['WAITING_SELF_START']);
})

/**
 * Add other player.
 * @param username Player's name.
 */
export function addPlayer(username: string) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].username === username) {
            return;
        }
    }

    players.push(new Player(players.length, username));

    addPlayerIntoBattlefields(username);
    addPlayerIntoList(username);
}

/**
 * Initialization function for the user who owns the page.
 */
function addMainPlayer() {
    players.push(new Player(players.length, <string>document.body.dataset.username));
    players[0].field = new Field(10, 10, Array.from({length: 10}, () => Array(10).fill('EMPTY')));
}

/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all')?.addEventListener('click', function () {
        setMode('all', 0)
    })

    document.getElementById('start-game-button')?.addEventListener('click', function () {
        verifyField()
    })
}