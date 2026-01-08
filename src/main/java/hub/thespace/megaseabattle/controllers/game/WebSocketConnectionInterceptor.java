package hub.thespace.megaseabattle.controllers.game;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class WebSocketConnectionInterceptor implements ChannelInterceptor {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketConnectionInterceptor(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public @Nullable Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();
        if (command == StompCommand.CONNECT) {
            handleClientConnected(accessor);
        }

        return message;
    }

    /**
     * This func. called after the player join.
     *
     * @param accessor Stomp header accessor.
     */
    private void handleClientConnected(StompHeaderAccessor accessor) {
        if (accessor.getNativeHeader("username") == null)
            return;
        if (accessor.getNativeHeader("username").size() != 1)
            return;
        String username = accessor.getNativeHeader("username").get(0);
        String id = accessor.getNativeHeader("id").get(0);
        log.info("Client {} connected into game {}", username, id.toUpperCase());
        sendJoinAction(username, id);
    }

    /**
     * Send join action.
     *
     * @param username Player's name.
     * @param id       Game's id.
     */
    private void sendJoinAction(String username, String id) {
        GameAction gameAction = new GameAction(GameAction.Action.PLAYER_JOIN, username, null);
        log.info("The game with ID {} has done the {} action", id, gameAction);

        messagingTemplate.convertAndSend("/topic/game-" + id, gameAction);
    }

}
