package hub.thespace.megaseabattle.controllers.game;

import hub.thespace.megaseabattle.config.WebSocketConnectionInterceptor;
import hub.thespace.megaseabattle.game.Field;
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
    public void gameTest(@Payload Field field, SimpMessageHeaderAccessor accessor) {
        String username = connectionInterceptor.getUsernameFromSession(accessor.getSessionId());
        log.info("User {} want load field {}", username, field);
    }

}
