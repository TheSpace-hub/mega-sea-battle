package hub.thespace.megaseabattle.config;

import hub.thespace.megaseabattle.controllers.game.GameAction;
import hub.thespace.megaseabattle.game.Game;
import hub.thespace.megaseabattle.game.GameLogicController;
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

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class WebSocketConnectionInterceptor implements ChannelInterceptor {

    private final SimpMessagingTemplate messagingTemplate;

    private final Map<String, PlayerSession> sessions;

    @Autowired
    public WebSocketConnectionInterceptor(@Lazy SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        sessions = new HashMap<>();
    }

    /**
     * This func. called after message.
     *
     * @param message Message.
     * @param channel Channel.
     * @return Message.
     */
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

        Game game = GameLogicController.getGameById(id.toLowerCase());
        if (game == null) {
            log.warn("Game {} not found", id);
            return;
        }
        game.addPlayer(username);
        addUserToSession(username, id, accessor.getSessionId());
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

    /**
     * Add user into session list.
     *
     * @param username  Player's name.
     * @param gameId    Game id.
     * @param sessionId Session id.
     */
    private void addUserToSession(String username, String gameId, String sessionId) {
        log.info("Adding user {} to session {}", username, sessionId);
        sessions.put(sessionId, new PlayerSession(username, gameId));
    }

    /**
     * Get PlayerSession object by session id.
     *
     * @param sessionId Session id.
     * @return Username
     */
    public PlayerSession getPlayerSessionSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public record PlayerSession(String username, String gameId) {
    }

}
