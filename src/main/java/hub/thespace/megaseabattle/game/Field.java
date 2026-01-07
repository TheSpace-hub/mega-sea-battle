package hub.thespace.megaseabattle.game;


import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
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

    /**
     * Get cell state.
     *
     * @param position Cell position.
     * @return Cell state.
     */
    public CellState getCellState(Position position) {
        return filed.get(position.x()).get(position.y());
    }

    public record Position(int x, int y) {
    }

}
