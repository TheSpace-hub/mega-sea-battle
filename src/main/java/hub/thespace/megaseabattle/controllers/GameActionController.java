package hub.thespace.megaseabattle.controllers;

import hub.thespace.megaseabattle.game.utils.Game;
import hub.thespace.megaseabattle.game.utils.GameAction;
import hub.thespace.megaseabattle.game.utils.Field;
import hub.thespace.megaseabattle.game.GamesController;
import hub.thespace.megaseabattle.game.utils.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;


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

    @MessageMapping("/game.attack")
    public void attack(@Payload Field.Position position, SimpMessageHeaderAccessor accessor) {
        Player player = getPlayer(accessor);
        Game game = getGame(accessor);
        if (game.getCurrentPlayer() != player) {
            log.error("The field was attacked by a player {} who cannot attack it", player.getUsername());
            return;
        }

        log.info("Player {} attack the cell ({}; {})", player.getUsername(), position.x(), position.y());
        game.attack(position);

        GameAction action = new GameAction(GameAction.Action.PLAYER_ATTACK, player.getUsername(), position);
        messagingTemplate.convertAndSend("/topic/game-" + game.getId(), action);

        checkDead(game);

        action = new GameAction(GameAction.Action.PLAYER_STEP, game.nextPlayer(position).getUsername(), null);
        messagingTemplate.convertAndSend("/topic/game-" + game.getId(), action);
    }

    @MessageMapping("/game.verify-field")
    public void verifyField(@Payload Field field, SimpMessageHeaderAccessor accessor) {
        Player player = getPlayer(accessor);
        Game game = getGame(accessor);

        log.info("User {} want load field {}", player.getUsername(), field);

        if (GamesController.checkIsStartedFieldCorrect(field)) {
            GameAction action = new GameAction(GameAction.Action.PLAYER_READY, player.getUsername(), null);
            player.setStatus(Player.Status.READY);
            player.setField(field);
            messagingTemplate.convertAndSend("/topic/game-" + game.getId(), action);
            checkIsGameReady(accessor);
        }
    }

    /**
     * Get player by accessor.
     *
     * @param accessor Accessor.
     * @return Player instance.
     */
    private Player getPlayer(SimpMessageHeaderAccessor accessor) {
        WebSocketConnectionInterceptor.PlayerSession playerSession =
                connectionInterceptor.getPlayerSessionSession(accessor.getSessionId());
        return GamesController.getGameById(playerSession.gameId()).getPlayerByUsername(playerSession.username());
    }

    /**
     * Get game by accessor.
     *
     * @param accessor Accessor.
     * @return Game instance.
     */
    private Game getGame(SimpMessageHeaderAccessor accessor) {
        WebSocketConnectionInterceptor.PlayerSession playerSession =
                connectionInterceptor.getPlayerSessionSession(accessor.getSessionId());
        return GamesController.getGameById(playerSession.gameId());
    }

    /**
     * Check is game ready. If the game is ready, it sends the message about it.
     *
     * @param accessor Accessor
     */
    private void checkIsGameReady(SimpMessageHeaderAccessor accessor) {
        Game game = getGame(accessor);
        if (!game.isGameReady())
            return;
        GameAction action = new GameAction(GameAction.Action.GAME_STARTED, null, null);
        messagingTemplate.convertAndSend("/topic/game-" + game.getId(), action);

        action = new GameAction(GameAction.Action.PLAYER_STEP, game.getCurrentPlayer().getUsername(), null);
        messagingTemplate.convertAndSend("/topic/game-" + game.getId(), action);
    }


    private void checkDead(Game game) {
        List<String> queueToDead = new ArrayList<>();
        for (Player player : game.getPlayers()) {
            if (player.isLoose(game.getOpenCells())) {
                log.info("Killing player {}", player.getUsername());
                queueToDead.add(player.getUsername());
                GameAction action = new GameAction(GameAction.Action.PLAYER_LOOSE, player.getUsername(), null);
                messagingTemplate.convertAndSend("/topic/game-" + game.getId(), action);
            }
        }
        for (String player : queueToDead) {
            game.killPlayer(player);
        }
    }

}
