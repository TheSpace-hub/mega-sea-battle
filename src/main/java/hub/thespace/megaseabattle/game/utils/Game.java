package hub.thespace.megaseabattle.game.utils;


import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * An object of this class belongs to an instance of the game.
 */
@Slf4j
public class Game {

    @Getter
    private final String id;
    @Getter
    private final int maxPlayers;
    @Getter
    private final List<Player> players;
    @Getter
    private final List<Field.Position> openCells;
    private Player currentPlayer;

    public Game(String id, int maxPlayers) {
        this.id = id;
        this.maxPlayers = maxPlayers;
        players = new ArrayList<>();
        openCells = new ArrayList<>();
    }

    public Game(String id, int maxPlayers, List<Player> players, List<Field.Position> openCells) {
        this.id = id;
        this.maxPlayers = maxPlayers;
        this.players = players;
        this.openCells = openCells;
    }

    /**
     * Add new player.
     *
     * @param username Player's username.
     */
    public void addPlayer(String username, Player.Status status) {
        players.add(new Player(username, status, new Field(10, 10)));
    }

    /**
     * Get player by username.
     *
     * @param username Player's name.
     * @return Player instance.
     */
    public Player getPlayerByUsername(String username) {
        for (Player player : players) {
            if (player.getUsername().equals(username))
                return player;
        }
        return null;
    }

    /**
     * Add field for player.
     *
     * @param username Player's name.
     * @param field    Game field.
     */
    public void addField(String username, Field field) {
        for (Player player : players) {
            if (player.getUsername().equals(username)) {
                player.setField(field);
                return;
            }
        }
        log.error("Can't add field for player {} in game with ID {}", username, id);
    }

    public Player getCurrentPlayer() {
        if (currentPlayer == null) {
            currentPlayer = players.get(0);
        }

        return currentPlayer;
    }

    /**
     * Generate info for public. This method remove secret player's info.
     *
     * @return Public data.
     */
    public Game generatePublicInfo() {
        Game game = new Game(id, maxPlayers, new ArrayList<>(), openCells);
        for (Player player : players) {
            Field field = new Field(10, 10);
            for (Field.Position position : openCells) {
                Field.CellState state = switch (player.getField().getCellState(position)) {
                    case SHIP, WRECKED_SHIP -> Field.CellState.WRECKED_SHIP;
                    case UNKNOWN, EMPTY -> Field.CellState.EMPTY;
                };
                field.setCellState(position, state);
            }
            game.addPlayer(player.getUsername(), player.getStatus());
            game.addField(player.getUsername(), field);
        }
        log.info("Public game info {} has been generated: {}", id, game);
        return game;
    }

    /**
     * Check is the game ready.
     *
     * @return Is the game ready.
     */
    public boolean isGameReady() {
        if (getMaxPlayers() != getPlayers().size())
            return false;
        for (Player player : getPlayers()) {
            if (player.getStatus() != Player.Status.READY)
                return false;
        }
        currentPlayer = getPlayers().get(0);
        return true;
    }

    /**
     * Attack the field.
     *
     * @param position Field position.
     */
    public void attack(Field.Position position) {
        if (openCells.contains(position)) {
            log.error("Player attacked the attacked cell for position {}", position);
            return;
        }
        openCells.add(position);
    }

    /**
     * Get next player for move. This function move current player in queue.
     *
     * @param position If there is a ship in position, then the move will not be transferred to the next one.
     * @return Target player.
     */
    public Player nextPlayer(Field.Position position) {
        if (currentPlayer == null) {
            currentPlayer = getPlayers().get(0);
            return currentPlayer;
        }

        for (Player player : players) {
            if (player.getField().getCellState(position) == Field.CellState.SHIP) {
                return currentPlayer;
            }
        }

        while (true) {
            if (players.indexOf(currentPlayer) == players.size() - 1) {
                currentPlayer = players.get(0);
            } else {
                currentPlayer = players.get(players.indexOf(currentPlayer) + 1);
            }

            if (!currentPlayer.isDead())
                return currentPlayer;
        }
    }

    /**
     * Kill the player.
     *
     * @param username Player's username
     */
    public void killPlayer(String username) {
        Player player = getPlayerByUsername(username);
        player.kill();
        if (player == currentPlayer) {
            if (players.size() == 1) {
                currentPlayer = null;
                return;
            }
            int index = players.indexOf(player);
            if (index == players.size() - 1) {
                currentPlayer = players.get(0);
            } else {
                currentPlayer = players.get(index + 1);
            }
        }
    }

    public List<Player> getLivePlayers() {
        List<Player> players = new ArrayList<>();
        for (Player player : this.players) {
            if (!player.isDead())
                players.add(player);
        }
        return players;
    }


}
