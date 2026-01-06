package hub.thespace.megaseabattle.game;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class Field {

    private List<List<CellType>> filed;
    private boolean inGame;

    public enum CellType {
        UNKNOWN,
        EMPTY,
        UNBROKEN_SHIP,
        WRECKED_SHIP,
    }

}
