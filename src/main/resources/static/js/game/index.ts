import {initBattlefield} from "./battlefield-utils.js";
import {GameStatus} from "./status";

export class Player {
    private readonly _username: string;
    private readonly _uuid: string;
    public status: PlayerStatus;
    private _field: Field;

    constructor(uuid: string, username: string) {
        this._username = username;
        this._uuid = uuid;
        this.status = PlayerStatus.UNKNOWN;
        this._field = new Field(10, 10, Field.generateNew(10, 10, CellType.UNKNOWN));
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

    static getMainPlayer(): Player {
        const player: Player | null = players[0];
        if (player == null)
            throw new Error(`Can not find main player by username ${player}`);

        return player;
    }

    static getPlayerByUuid(uuid: string): Player | null {
        for (let i = 0; i < players.length; i++) {
            if (players[i].uuid === uuid)
                return players[i];
        }
        return null;
    }

    static getPlayersCount(): number {
        return players.length;
    }

    static getPlayersUUIDs(): Array<string> {
        const uuids: string[] = [];
        for (let i = 0; i < Player.getPlayersCount(); i++) {
            uuids.push(players[i].uuid.toString());
        }
        return uuids;
    }
}

export enum PlayerStatus {
    UNKNOWN,
    PREPARING,
    READY,
    LOOSE,
    WON
}

export enum CellType {
    UNKNOWN,
    EMPTY,
    SHIP,
    WRECKED_SHIP,
    BROKEN_SHIP,
}

export class Field {
    private readonly _sizeX: number;
    private readonly _sizeY: number;
    private readonly _field: Array<Array<CellType>>;

    constructor(sizeX: number, sizeY: number, field: Array<Array<CellType>>) {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._field = field;
    }

    static generateNew(sizeX: number, sizeY: number, cellType: CellType): Array<Array<CellType>> {
        return Array.from({length: sizeY}, () =>
            Array.from({length: sizeX}, () => CellType.SHIP)
        );
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
export const gameId: string = window.location.pathname.split('/').pop() as string;
const players: Array<Player> = [];

document.addEventListener('DOMContentLoaded', function () {
    addMainPlayer();
    initBattlefield();
    // setupEventListeners();
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

function addMainPlayer() {
    const uuid = crypto.randomUUID();
    const username = document.body.dataset.username as string;

    players.push(new Player(uuid, username));
    players[0].field = new Field(10, 10, Field.generateNew(10, 10, CellType.EMPTY));
    console.log(`Field: ${JSON.stringify(Field.generateNew(10, 10, CellType.EMPTY))}`)
}

function setupEventListeners() {
    document.getElementById('mode-all')?.addEventListener('click', function () {
        // setMode('all', 0);
    })

    document.getElementById('start-game-button')?.addEventListener('click', function () {
        // verifyField();
    })
}
