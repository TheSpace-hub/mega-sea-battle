package hub.thespace.megaseabattle.controllers.game;

import hub.thespace.megaseabattle.game.Game;
import lombok.Data;

@Data
public class GameAction {
    private Action action;
    private String username;
    private String content;
    private Game game;

    public GameAction(Action action, String username, String content, Game game) {
        this.action = action;
        this.username = username;
        this.content = content;
        this.game = game;
    }

    public enum Action {
        PLAYER_JOIN,
        PLAYER_LEAVE,
        PLAYER_READY,
        PLAYER_MOVE,
        PLAYER_LOOSE,
        PLAYER_WON,
    }

}
