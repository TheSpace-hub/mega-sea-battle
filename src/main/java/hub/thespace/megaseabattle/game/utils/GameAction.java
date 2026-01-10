package hub.thespace.megaseabattle.game.utils;

import lombok.Data;

@Data
public class GameAction {
    private Action action;
    private String username;
    private String content;

    public GameAction(Action action, String username, String content) {
        this.action = action;
        this.username = username;
        this.content = content;
    }

    public enum Action {
        PLAYER_JOIN,
        PLAYER_LEAVE,
        PLAYER_READY,
        PLAYER_STEP,
        PLAYER_MOVE,
        PLAYER_LOOSE,
        PLAYER_WON,
        GAME_STARTED,
        GAME_FINISHED,
    }

}
