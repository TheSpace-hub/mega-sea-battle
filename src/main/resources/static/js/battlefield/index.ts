export class Player {
    private readonly _username: string;
    private _field: Field;

    constructor(username: string) {
        this._username = username;
        this._field = new Field(10, 10,
            Array.from({length: 10}, () => Array(10).fill('UNKNOWN')));
    }

    get username(): string {
        return this._username;
    }

    get field(): Field {
        return this._field;
    }

    set field(value: Field) {
        this._field = value;
    }
}

enum CellType {
    UNKNOWN,
    EMPTY,
    SHIP,
    WRECKED_SHIP,
    BROKEN_SHIP,
}

class Field {
    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private readonly _field: Array<Array<CellType>>;

    constructor(sizeX: number, sizeY: number, field: Array<Array<CellType>>) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._field = field;
    }


    get sizeX(): number {
        return this._sizeX;
    }

    get sizeY(): number {
        return this._sizeY;
    }

    get field(): Array<Array<CellType>> {
        return this._field;
    }
}

export const players: Array<Player> = [];

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

    players.push(new Player(username));

    addPlayerIntoBattlefields(username);
    addPlayerIntoList(username);
}

/**
 * Initialization function for the user who owns the page.
 */
function addMainPlayer() {
    players.push(new Player(document.body.dataset.username as string));
    players[0].field = new Field(10, 10,
        Array.from({length: 10}, () => Array(10).fill(CellType.EMPTY)));
}

/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all')?.addEventListener('click', function () {
        setMode('all', 0);
    })

    document.getElementById('start-game-button')?.addEventListener('click', function () {
        verifyField();
    })
}



