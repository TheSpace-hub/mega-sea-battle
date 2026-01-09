package hub.thespace.megaseabattle.controllers.game;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@Slf4j
public class GameActionController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GameActionController(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

}
