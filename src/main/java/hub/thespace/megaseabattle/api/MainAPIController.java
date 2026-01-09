package hub.thespace.megaseabattle.api;

import hub.thespace.megaseabattle.game.Game;
import hub.thespace.megaseabattle.game.GameLogicController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Main API controller.
 */
@RestController
@RequestMapping("/api")
@Slf4j
public class MainAPIController {

    /**
     * Get list of games.
     *
     * @return Json response.
     */
    @GetMapping("/list-of-games")
    public List<Game> getListOfGames() {
        return GameLogicController.games;
    }

    /**
     * Create the game.
     *
     * @param playersCount Player count.
     * @return Json response.
     */
    @GetMapping("/create-game/{playersCount}")
    public Map<String, String> createGame(@PathVariable int playersCount) {
        log.info("Creating game with {} players", playersCount);
        Game game = GameLogicController.createGame(playersCount);
        return Map.of("id", game.getId());
    }

    /**
     * Send data about game field.
     *
     * @param id Game id.
     * @return Public game data.
     */
    @GetMapping("/game-data/{id}")
    public Game getGameData(@PathVariable String id) {
        Game privateGameData = GameLogicController.getGameById(id);
        if (privateGameData == null)
            return null;
        return privateGameData.generatePublicInfo();
    }

}
