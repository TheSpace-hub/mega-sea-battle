package hub.thespace.megaseabattle.game;


import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * An object of this class belongs to an instance of the game.
 */
@Slf4j
@Getter
public class Game {

    private final String id;
    private final int maxPlayers;
    private final List<Player> players;
    private final List<Field.Position> openCells;

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
    public void addPlayer(String username) {
        players.add(new Player(username, "Готовит флот", new Field(10, 10)));
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
                field.setCellState(position, player.getField().getCellState(position));
            }
            game.addPlayer(player.getUsername());
            game.addField(player.getUsername(), field);
        }
        log.info("Public game info {} has been generated: {}", id, game);
        return game;
    }

}
