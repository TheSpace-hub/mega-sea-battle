package hub.thespace.megaseabattle.game;


import java.util.List;

/**
 * An object of this class belongs to an instance of the game.
 */
public record Game(String id, int maxPlayers, List<Player> players) {

    public Game(String id, int maxPlayers) {
        this(id, maxPlayers, List.of());
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

}
