package hub.thespace.megaseabattle.game.utils;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Field {

    private final int sizeX;
    private final int sizeY;
    private final List<List<CellState>> field;

    public Field(int sizeX, int sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        field = new ArrayList<>();
        for (int i = 0; i < this.sizeX; i++) {
            List<CellState> row = new ArrayList<>();
            for (int j = 0; j < this.sizeY; j++) {
                row.add(CellState.UNKNOWN);
            }
            field.add(row);
        }
    }

    public Field(@JsonProperty("sizeX") int sizeX, @JsonProperty("sizeY") int sizeY, @JsonProperty("field") List<List<CellState>> field) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.field = field;
    }

    public enum CellState {
        UNKNOWN("UNKNOWN"),
        EMPTY("EMPTY"),
        SHIP("SHIP"),
        UNBROKEN_SHIP("UNBROKEN_SHIP"),
        WRECKED_SHIP("WRECKED_SHIP");

        private final String value;

        CellState(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static CellState fromString(String value) {
            for (CellState state : CellState.values()) {
                if (state.value.equalsIgnoreCase(value)) {
                    return state;
                }
            }
            throw new IllegalArgumentException("Неизвестное состояние клетки: " + value);
        }
    }

    /**
     * Set cell type
     *
     * @param position  Cell position.
     * @param cellState Cell state.
     */
    public void setCellState(Position position, CellState cellState) {
        field.get(position.x()).set(position.y(), cellState);
    }

    /**
     * Get cell state.
     *
     * @param position Cell position.
     * @return Cell state.
     */
    public CellState getCellState(Position position) {
        return field.get(position.x()).get(position.y());
    }

    /**
     * Get cell state by coords.
     *
     * @param x Coord. x.
     * @param y Coord. y.
     * @return
     */
    public CellState getCellState(int x, int y) {
        return getCellState(new Position(x, y));
    }

    public record Position(int x, int y) {
    }

    @Override
    public String toString() {
        return "Field{" +
                "sizeX=" + sizeX +
                ", sizeY=" + sizeY +
                ", field=" + field +
                '}';
    }
}
