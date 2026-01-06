package hub.thespace.megaseabattle.game;


import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * An object of this class belongs to an instance of the game.
 */
@Getter
public class Game {

    public static List<Game> games = new ArrayList<>();

    private final String id;
    private final int maxPlayers;
    private final Map<String, Field> fields;

    public Game(String id, int maxPlayers) {
        this.id = id;
        this.maxPlayers = maxPlayers;
        this.fields = new HashMap<>();
    }

    /**
     * Add new player's field.
     * @param username Player's username.
     * @param field Player's field with ships.
     */
    public void addField(String username, Field field) {
        this.fields.put(username, field);
    }

}
