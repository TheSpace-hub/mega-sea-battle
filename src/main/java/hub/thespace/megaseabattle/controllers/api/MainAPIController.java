package hub.thespace.megaseabattle.controllers.api;

import hub.thespace.megaseabattle.game.GameConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
public class MainAPIController {

    @GetMapping("/api/list-of-games")
    public List<GameConfig> getListOfGames() {
        return GameConfig.games;
    }

}
