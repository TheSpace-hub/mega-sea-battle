package hub.thespace.megaseabattle.api;

import hub.thespace.megaseabattle.game.utils.FieldUtils;
import hub.thespace.megaseabattle.game.utils.Game;
import hub.thespace.megaseabattle.game.GamesController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Main API controller.
 */
@RestController
@RequestMapping("/api")
@Slf4j
public class MainAPIController {

    private final FieldUtils fieldUtils;

    @Autowired
    public MainAPIController(FieldUtils fieldUtils) {
        this.fieldUtils = fieldUtils;
    }

    /**
     * Get list of games.
     *
     * @return Json response.
     */
    @GetMapping("/list-of-games")
    public List<Game> getListOfGames() {
        List<Game> games = new ArrayList<>();
        int shift = 0;
        for (int i = 0; i < Math.min(10, GamesController.games.size()); i++) {
            if (GamesController.games.size() == i + shift) {
                return games;
            }
            Game game = GamesController.games.get(i + shift);
            if (!game.isClosed) {
                games.add(game);
            } else {
                shift++;
                i--;
            }
        }
        return games;
    }

    /**
     * Create the game.
     *
     * @param playersCount Player count.
     * @return Json response.
     */
    @GetMapping("/create-game/{playersCount}")
    public Map<String, String> createGame(@PathVariable int playersCount) {
        if (2 <= playersCount && playersCount <= 5) {
            Game game = GamesController.createGame(playersCount);
            log.info("Creating game {} with {} players", game.getId(), playersCount);
            return Map.of("id", game.getId());
        }
        log.warn("Trying to create a game with {} players", playersCount);
        return Map.of("id", "-1");
    }

    /**
     * Send data about game field.
     *
     * @param id Game id.
     * @return Public game data.
     */
    @GetMapping("/game-data/{id}")
    public Game getGameData(@PathVariable String id) {
        Game game = GamesController.getGameById(id);
        if (game == null) {
            log.warn("An attempt to get a non-existent game {}", id);
            return null;
        }
        return fieldUtils.generatePublicInfo(game);
    }

}
