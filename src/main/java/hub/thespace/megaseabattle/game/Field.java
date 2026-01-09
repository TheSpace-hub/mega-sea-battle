package hub.thespace.megaseabattle.game;


import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Field {

    private final int sizeX;
    private final int sizeY;
    private final List<List<CellState>> filed;

    public Field(int sizeX, int sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        filed = new ArrayList<>();
        for (int i = 0; i < this.sizeX; i++) {
            List<CellState> row = new ArrayList<>();
            for (int j = 0; j < this.sizeY; j++) {
                row.add(CellState.UNKNOWN);
            }
            filed.add(row);
        }
    }

    public enum CellState {
        UNKNOWN,
        EMPTY,
        SHIP,
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
