package hub.thespace.megaseabattle.game;


import java.util.List;

/**
 * An object of this class belongs to an instance of the game.
 */
public record Game(String id, int maxPlayers, List<Player> players, List<Field.Position> openCells) {

    public Game(String id, int maxPlayers) {
        this(id, maxPlayers, List.of(), List.of());
    }

    /**
     * Add new player.
     *
     * @param username Player's username.
     * @param field    Player's field with ships.
     */
    public void addPlayer(String username, Field field) {
        this.players.add(new Player(username, field));
    }

    /**
     * Generate info for public. This method remove secret player's info.
     * @return Public data.
     */
    public Game generatePublicInfo() {
        Game game = new Game(id, maxPlayers, List.of(), openCells);
        for (Player player : players) {
            Field field = new Field();
            for (Field.Position position : openCells) {
                field.setCellState(position, player.getField().getCellState(position));
            }
            game.addPlayer(player.getUsername(), field);
        }
        return game;
    }

}
