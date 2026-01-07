package hub.thespace.megaseabattle.game;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class Field {

    private List<List<CellState>> filed;
    private boolean inGame;

    public enum CellState {
        UNKNOWN,
        EMPTY,
        UNBROKEN_SHIP,
        WRECKED_SHIP,
    }

    /**
     * Set cell type
     *
     * @param position  Cell position.
     * @param cellState Cell state.
     */
    public void setCellState(Position position, CellState cellState) {
        filed.get(position.x()).set(position.y(), cellState);
    }

    public record Position(int x, int y) {
    }

}
