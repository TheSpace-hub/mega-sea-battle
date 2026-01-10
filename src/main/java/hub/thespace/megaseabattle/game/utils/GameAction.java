package hub.thespace.megaseabattle.game.utils;

import lombok.Data;

@Data
public class GameAction {
    private Action action;
    private String username;
    private Field.Position position;

    public GameAction(Action action, String username, Field.Position position) {
        this.action = action;
        this.username = username;
        this.position = position;
    }

    public enum Action {
        PLAYER_JOIN,
        PLAYER_LEAVE,
        PLAYER_READY,
        PLAYER_STEP,
        PLAYER_ATTACK,
        PLAYER_LOOSE,
        PLAYER_WON,
        GAME_STARTED,
        GAME_FINISHED,
    }

}
