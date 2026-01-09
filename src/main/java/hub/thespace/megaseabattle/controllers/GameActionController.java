package hub.thespace.megaseabattle.controllers;

import hub.thespace.megaseabattle.game.utils.GameAction;
import hub.thespace.megaseabattle.game.utils.Field;
import hub.thespace.megaseabattle.game.GameLogicController;
import hub.thespace.megaseabattle.game.utils.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@Slf4j
public class GameActionController {

    private final SimpMessagingTemplate messagingTemplate;
    private final WebSocketConnectionInterceptor connectionInterceptor;

    @Autowired
    public GameActionController(@Lazy SimpMessagingTemplate messagingTemplate, @Lazy WebSocketConnectionInterceptor connectionInterceptor) {
        this.messagingTemplate = messagingTemplate;
        this.connectionInterceptor = connectionInterceptor;
    }

    @MessageMapping("/game.verify-field")
    public void verifyField(@Payload Field field, SimpMessageHeaderAccessor accessor) {
        WebSocketConnectionInterceptor.PlayerSession playerSession =
                connectionInterceptor.getPlayerSessionSession(accessor.getSessionId());
        Player player = GameLogicController
                .getGameById(playerSession.gameId()).getPlayerByUsername(playerSession.username());

        log.info("User {} want load field {}", playerSession, field);

        if (GameLogicController.checkIsStartedFieldCorrect(field)) {
            GameAction action = new GameAction(GameAction.Action.PLAYER_READY, playerSession.username(), "");
            player.setStatus("Готов");
            messagingTemplate.convertAndSend("/topic/game-" + playerSession.gameId(), action);
        }
    }

}
