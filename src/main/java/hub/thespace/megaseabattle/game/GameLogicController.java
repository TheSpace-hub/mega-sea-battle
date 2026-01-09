package hub.thespace.megaseabattle.game;

import hub.thespace.megaseabattle.game.utils.Field;
import hub.thespace.megaseabattle.game.utils.Game;
import hub.thespace.megaseabattle.game.utils.Player;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * This class controlling game utils.
 */
@Slf4j
public class GameLogicController {

    public static List<Game> games = new ArrayList<>();
    private static final Random random = new Random();

    /**
     * Get game by id.
     *
     * @param id Game's id.
     * @return The Game instance.
     */
    public static Game getGameById(String id) {
        for (Game game : games) {
            if (game.getId().equals(id))
                return game;
        }
        return null;
    }

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

    /**
     * Checks the field for correct ship placement.
     * TODO - create logic.
     *
     * @return Is the field correct.
     */
    public static boolean checkIsStartedFieldCorrect(Field field) {
        return true;
    }

    /**
     * Check is the game ready.
     *
     * @param id Game id.
     * @return Is the game ready.
     */
    public boolean checkIsGameReady(String id) {
        Game game = getGameById(id);
        if (game == null) {
            log.warn("Checking the readiness of a non-existent game {}", id);
            return false;
        }

        if (game.getMaxPlayers() != game.getPlayers().size())
            return false;
        for (Player player : game.getPlayers()) {
            if (player.getStatus() != Player.Status.READY)
                return false;
        }
        return true;
    }

}
