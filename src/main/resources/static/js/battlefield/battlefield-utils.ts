import {CellType, Field, Player} from "./index.js";
// import {gameStatusTypes, getStatus} from "./status";
// import {attack, submitFieldForVerification} from "./connector";

enum GameMode {
    Prepare,
    AllPlayers,
    Player
}

const letters: Array<string> = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
let currentGameMode: GameMode | Player = GameMode.Prepare;
let currentPlayer: Player | null = null;

export function verifyField() {
    // submitFieldForVerification(players[0].field);
}

export function initBattlefield() {
    console.log("initBattlefield()");
    const battlefield: HTMLElement | null = document.getElementById('battlefield')
    if (!battlefield) return;

    battlefield.innerHTML = '';

    const topLeftCell = document.createElement('div');
    topLeftCell.className = 'cell coordinate';
    battlefield.appendChild(topLeftCell);


    for (let i = 0; i < 10; i++) {
        const letterCell = document.createElement('div');
        letterCell.className = 'cell coordinate';
        letterCell.textContent = letters[i];
        battlefield.appendChild(letterCell);
    }

    for (let row = 0; row < 10; row++) {
        const numberCell = document.createElement('div');
        if (numberCell == null) return;

        numberCell.className = 'cell coordinate';
        numberCell.textContent = (row + 1).toString();
        battlefield.appendChild(numberCell);

        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();

            cell.addEventListener('click', function () {
                // handleCellClick(this);
            })

            battlefield.appendChild(cell);
        }
    }

    document.getElementById(`mode-main-player`)?.addEventListener('click', function () {
        setMode(GameMode.Player, Player.getMainPlayer());
    })
}

export function setMode(gameMode: GameMode, player: Player) {
    currentGameMode = gameMode;
    currentPlayer = player;

    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active', 'mode-active');
    })

    let activeButton;
    if (currentGameMode === GameMode.AllPlayers || currentGameMode === GameMode.Prepare)
        activeButton = document.getElementById(`mode-${gameMode}`);
    else if (currentGameMode === GameMode.Player)
        activeButton = document.getElementById(`mode-player-${currentPlayer.username}`);
    activeButton?.classList.add('active', 'mode-active');

    updateDisplay();
}

/**
 * Update battlefield view.
 */
export function updateDisplay() {
    const battlefield = document.getElementById('battlefield');
    if (!battlefield) return;

    const cells: Array<HTMLDivElement> = battlefield.querySelectorAll('.cell:not(.coordinate)') as unknown as HTMLDivElement[];
    const modeTitle: HTMLElement = document.getElementById('current-mode') as HTMLElement;
    const modeDescription: HTMLElement = document.getElementById('mode-description') as HTMLElement;

    cells.forEach((cell: HTMLDivElement) => {
        cell.style.opacity = '1';
        cell.style.pointerEvents = 'auto';

        if (cell.classList.contains('ship')) {
            cell.classList.remove('ship-hidden');
        }
    })

    if (currentGameMode === GameMode.AllPlayers || currentGameMode === GameMode.Prepare) {
        if (currentGameMode === GameMode.Prepare) {
            modeTitle.textContent = 'Расставь свой флот';
            modeDescription.textContent = 'Необходимо 4 - одноклеточных, 3 - двухклеточных, 2 - трехклеточных, 1 - четырёхклеточный';
        } else {
            modeTitle.textContent = 'Режим: Все игроки на одном поле';
            modeDescription.textContent = 'На этом поле отображены корабли всех игроков. Цвет корабля соответствует цвету игрока в списке.';
        }

        cells.forEach((cell: HTMLDivElement) => {
            clearCell(cell);
            for (let i = 0; i < Player.getPlayersCount(); i++) {
                const player = Player.getPlayerByUuid(Player.getPlayersUUIDs()[i])
                if (!player) return;
                const field: Field = player.field;
                fillCell(cell, field, player.username === Player.getMainPlayer().username);
            }
        })
    } else if (currentGameMode === GameMode.Player) {
        const player: Player | null = currentPlayer;
        if (!player) return;
        const field: Field = player.field;

        modeTitle.textContent = `Режим: Игрок "${player.username}"`;
        modeDescription.textContent = `Ты видишь поле игрока "${player.username}". Только его корабли отображены на поле.`;
        cells.forEach(cell => {
            clearCell(cell);
            fillCell(cell, field);
        })
    }
}

/**
 * Cell click executor.
 * @param cell Cell as div object.
 */
// function handleCellClick(cell: HTMLDivElement) {
//     // if (getStatus() === gameStatusTypes.WAITING_SELF_START) {
//     const x = parseInt(cell.dataset.col);
//     const y = parseInt(cell.dataset.row);
//     if (cell.classList.contains('ship')) {
//         cell.classList.remove('ship');
//         currentPlayer.field.field[y][x] = 'EMPTY';
//     } else {
//         cell.classList.add('ship');
//         players[0].field.field[y][x] = 'SHIP';
//     }
//     // } else if (getStatus() === gameStatusTypes.WAITING_SELF_MOVE) {
//     //     const x = parseInt(cell.dataset.col);
//     //     const y = parseInt(cell.dataset.row);
//     //     attack(x, y);
//     // }
// }

/**
 * Add new player into list of battlefields.
 * @param username Player's name.
 */
// export function addPlayerIntoBattlefields(username) {
//     let i = 0;
//     while (document.querySelector(`#mode-player-${i}`))
//         i++;
//
//     document.querySelector('#list-of-modes')
//         .insertAdjacentHTML('beforeend', createPlayerBattlefieldItem(username, i));
//     document.getElementById(`mode-player-${i}`).addEventListener('click', function () {
//         setMode(`player`, i);
//     })
// }

/**
 * Create HTML item for player's battlefield.
 * @param username Player's name.
 * @param index Player's index.
 * @returns {string} HTML item.
 */
// function createPlayerBattlefieldItem(username, index) {
//     return `
// <button type="button" class="btn btn-outline-primary disabled" id="mode-player-${index}">Поле "<span>${username}</span>"
// </button>
// `;
// }

/**
 * Fill the cell.
 * @param cell HTML object.
 * @param ignoreEmpty Ignore empty cells.
 * @param field Field.
 */
function fillCell(cell: HTMLDivElement, field: Field, ignoreEmpty: boolean = false) {
    const x: number = parseInt(<string>cell.dataset.col);
    const y: number = parseInt(<string>cell.dataset.row);

    if (field.field[y][x] === CellType.BROKEN_SHIP) {
        cell.classList.add('kill');
    } else if (field.field[y][x] === CellType.WRECKED_SHIP && !cell.classList.contains('kill')) {
        cell.classList.add('hit');
    } else if (field.field[y][x] === CellType.SHIP && !cell.classList.contains('hit') && !cell.classList.contains('kill')) {
        cell.classList.add('ship');
    } else if (field.field[y][x] === CellType.EMPTY && !ignoreEmpty && !cell.classList.contains('ship') && !cell.classList.contains('hit') && !cell.classList.contains('kill')) {
        cell.classList.add('miss');
    }
}

/**
 * Clear the cell.
 * @param cell The HTML object.
 */
function clearCell(cell: HTMLDivElement) {
    cell.classList.remove('kill');
    cell.classList.remove('ship');
    cell.classList.remove('hit');
    cell.classList.remove('miss');
}
