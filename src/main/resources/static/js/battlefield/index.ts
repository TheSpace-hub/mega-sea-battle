export class Player {
    private readonly _username: string;
    private readonly _uuid: string;
    private _field: Field;

    constructor(uuid: string, username: string) {
        this._username = username;
        this._uuid = uuid;
        this._field = new Field(10, 10, Field.createEmpty(10, 10, CellType.UNKNOWN));
    }

    get username(): string {
        return this._username;
    }

    get uuid(): string {
        return this._uuid;
    }

    get field(): Field {
        return this._field;
    }

    set field(value: Field) {
        this._field = value;
    }

    get mainPlayer(): Player {
        const player: Player | null = getPlayerByUuid(mainPlayerUsername);
        if (player == null)
            throw new Error(`Can not find main player by username ${player}`);

        return player;
    }

}

function getPlayerByUuid(uuid: string): Player | null {
    for (let i = 0; i < players.length; i++) {
        if (players[i].uuid === uuid)
            return players[i];
    }
    return null;
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

    static createEmpty(sizeX: number, sizeY: number, cellType: CellType): Array<Array<CellType>> {
        let field: Array<Array<CellType>> = Array(sizeY);
        for (let y = 0; y < sizeY; y++)
            field.push(Array(sizeX).fill(cellType));

        return field;
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

export let mainPlayerUsername: string;
export const players: Array<Player> = [];

document.addEventListener('DOMContentLoaded', function () {
    addMainPlayer();
    // initBattlefield();
    setupEventListeners();
    // updateDisplay();

    // connect(players[0].username).then();
    // changeGameStatus(gameStatusTypes['WAITING_SELF_START']);
})

export function addPlayer(uuid: string, username: string) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].username === username) {
            return;
        }
    }

    players.push(new Player(uuid, username));

    // addPlayerIntoBattlefields(username);
    // addPlayerIntoList(username);
}

/**
 * Initialization function for the user who owns the page.
 */
function addMainPlayer() {
    const uuid = 'uuid';
    players.push(new Player(uuid, document.body.dataset.username as string));
    players[0].field = new Field(10, 10,
        Array.from({length: 10}, () => Array(10).fill(CellType.EMPTY)));
}

/**
 * Configure Event handlers.
 */
function setupEventListeners() {
    document.getElementById('mode-all')?.addEventListener('click', function () {
        // setMode('all', 0);
    })

    document.getElementById('start-game-button')?.addEventListener('click', function () {
        // verifyField();
    })
}



