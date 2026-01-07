package hub.thespace.megaseabattle.controllers.game;

import lombok.Data;

@Data
public class GameAction {
    private Action action;
    private String username;
    private String content;

    public GameAction(Action action, String username, String content) {
        this.action = action;
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
