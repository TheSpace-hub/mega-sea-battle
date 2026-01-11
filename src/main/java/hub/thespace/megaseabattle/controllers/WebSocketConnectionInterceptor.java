package hub.thespace.megaseabattle.controllers;

import hub.thespace.megaseabattle.game.utils.GameAction;
import hub.thespace.megaseabattle.game.utils.Game;
import hub.thespace.megaseabattle.game.GamesController;
import hub.thespace.megaseabattle.game.utils.Player;
import lombok.Getter;
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
    @Getter
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
        Game game = GamesController.getGameById(id.toLowerCase());

        if (game == null || game.isClosed) {
            log.warn("Game {} not found", id);
            return;
        } else if (game.getPlayers().size() == game.getMaxPlayers()) {
            log.warn("Trying to connect to a completed game {}", id);
            return;
        }

        joinAction(username, id, accessor.getSessionId());
    }


    private void joinAction(String username, String id, String sessionId) {
        Game game = GamesController.getGameById(id.toLowerCase());
        log.info("Client {} connected into game {}", username, id.toUpperCase());

        assert game != null;
        game.addPlayer(username, Player.Status.PREPARING);
        addUserToSession(username, id, sessionId);

        GameAction gameAction = new GameAction(GameAction.Action.PLAYER_JOIN, username);
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
    public PlayerSession getPlayerSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public record PlayerSession(String username, String gameId) {
    }

}
