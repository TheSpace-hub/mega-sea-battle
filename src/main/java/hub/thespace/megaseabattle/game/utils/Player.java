package hub.thespace.megaseabattle.game.utils;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Getter
@Setter
@Slf4j
public class Player {
    private String username;
    private Status status;
    private Field field;
    private boolean isDead;

    public Player(String username, Status status, Field field) {
        this.username = username;
        this.status = status;
        this.field = field;
    }

    /**
     * Does the player have ships that are not sunk.
     *
     * @param openCells Open cells.
     * @return Dose the player loose.
     */
    public boolean isLoose(List<Field.Position> openCells) {
        for (int y = 0; y < 10; y++) {
            for (int x = 0; x < 10; x++) {
                if (field.getCellState(x, y) == Field.CellState.SHIP && !openCells.contains(new Field.Position(x, y)))
                    return false;
            }
        }
        return true;
    }

    public void kill() {
        isDead = true;
        status = Status.LOOSE;
    }

    public enum Status {
        PREPARING,
        READY,
        LOOSE
    }

    public enum Locale {
        RUSSIAN
    }
}
