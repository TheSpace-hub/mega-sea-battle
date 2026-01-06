package hub.thespace.megaseabattle.game;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * This class controlling game utils.
 */
public class GameController {

    public static List<Game> games = new ArrayList<>();
    private static final Random random = new Random();

    /**
     * Create new game.
     *
     * @param playersCount Players count.
     * @return Game instance.
     */
    public static Game createGame(int playersCount) {
        Game game = new Game(generateId(), playersCount);
        games.add(game);
        return game;
    }

    /**
     * Generate a 6-digit code for the game.
     *
     * @return 6-digit code.
     */
    public static String generateId() {
        char[] code = new char[6];
        for (int i = 0; i < 6; i++) {
            code[i] = "abcdefghijklmnopqrstuvwxyz0123456789".charAt(random.nextInt(36));
        }
        return new String(code);
    }

}
