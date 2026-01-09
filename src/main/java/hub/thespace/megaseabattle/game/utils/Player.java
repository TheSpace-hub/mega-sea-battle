package hub.thespace.megaseabattle.game.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class Player {
    private String username;
    private Status status;
    private Field field;

    public enum Status {
        PREPARING,
        READY
    }

    public enum Locale {
        RUSSIAN
    }
}
