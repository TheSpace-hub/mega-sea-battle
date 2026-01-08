package hub.thespace.megaseabattle.game;


import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * An object of this class belongs to an instance of the game.
 */
@Slf4j
public record Game(String id, int maxPlayers, List<Player> players, List<Field.Position> openCells) {

    public Game(String id, int maxPlayers) {
        this(id, maxPlayers, List.of(), List.of());
    }

    /**
     * Add new player.
     *
     * @param username Player's username.
     */
    public void addPlayer(String username) {
        players.add(new Player(username, null));
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
        Game game = new Game(id, maxPlayers, List.of(), openCells);
        for (Player player : players) {
            Field field = new Field();
            for (Field.Position position : openCells) {
                field.setCellState(position, player.getField().getCellState(position));
            }
            game.addPlayer(player.getUsername());
            game.addField(player.getUsername(), field);
        }
        return game;
    }

}
