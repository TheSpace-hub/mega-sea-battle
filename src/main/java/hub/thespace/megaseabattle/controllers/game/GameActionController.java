package hub.thespace.megaseabattle.controllers.game;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@Slf4j
public class GameActionController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GameActionController(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/game.register")
    public Map<String, String> gameAddField(@Payload String username, @Payload String id, SimpMessageHeaderAccessor headerAccessor) {
        log.info("Player {} is registered in game {} in session {}", username, id, headerAccessor.getSessionId());

        return Map.of("status", "ok");
    }
}
