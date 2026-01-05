package hub.thespace.megaseabattle.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class RegisterController {
    @MessageMapping("/register")
    public void onRegister(Message<?> message) {
        log.info("Received Message: {}", message);
    }
}
