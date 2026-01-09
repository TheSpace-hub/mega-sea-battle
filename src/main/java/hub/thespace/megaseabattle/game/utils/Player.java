package hub.thespace.megaseabattle.game.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class Player {
    private String username;
    private String status;
    private Field field;
}
