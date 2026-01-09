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
        READY;

        public String getAsMessage(Status status, Locale locale) {
            if (locale == Locale.RUSSIAN) {
                return switch (status) {
                    case PREPARING -> "Готовится";
                    case READY -> "Готов";
                };
            }
            return status.toString();
        }

    }

    public enum Locale {
        RUSSIAN
    }
}
