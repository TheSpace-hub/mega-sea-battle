package hub.thespace.megaseabattle.controllers.game;

import hub.thespace.megaseabattle.game.responses.PlayerJoin;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    @MessageMapping("/game.join")
    @SendTo("/topic/public")
    public PlayerJoin playerJoin(PlayerJoin playerJoin) {
        return playerJoin;
    }

}
