package hub.thespace.megaseabattle.game.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class FieldUtils {

    public boolean isFieldCorrect(Field field) {
        return isCorrectNumberOfShipCells(field) && isCorrectNumberOfShips(field);
    }

    private boolean isCorrectNumberOfShipCells(Field field) {
        int shipCells = 0;
        for (int y = 0; y < field.sizeY(); y++) {
            for (int x = 0; x < field.sizeX(); x++) {
                if (field.getCellState(x, y) == Field.CellState.SHIP) {
                    shipCells++;
                } else if (field.getCellState(x, y) != Field.CellState.EMPTY)
                    return false;
            }
        }
        return shipCells == 20;
    }

    private boolean isCorrectNumberOfShips(Field field) {
        int targetX = 0;
        int targetY = 0;
        Map<Integer, Integer> numberOfShips = new HashMap<>();

        while (field.getCellState(targetX, targetY) != Field.CellState.SHIP) {
            targetX++;
            if (targetX == field.sizeX()) {
                targetX = 0;
                targetY++;
            }
        }

        log.info("target is {} {}", targetX, targetY);
        Direction direction = getShipDirection(field, targetX, targetY);
        log.info("Direction {} ", direction);
        if (direction == null) return false;

        return false;
    }

    private Direction getShipDirection(Field field, int targetX, int targetY) {
        if (isCellEmptyOrOffTheMap(field, targetX - 1, targetY - 1) &&
                isCellEmptyOrOffTheMap(field, targetX, targetY - 1) &&
                isCellEmptyOrOffTheMap(field, targetX + 1, targetY - 1) &&
                isCellEmptyOrOffTheMap(field, targetX - 1, targetY + 1) &&
                isCellEmptyOrOffTheMap(field, targetX, targetY + 1) &&
                isCellEmptyOrOffTheMap(field, targetX + 1, targetY + 1) &&
                isCellEmptyOrOffTheMap(field, targetX - 1, targetY)) {
            return Direction.RIGHT;
        } else if (isCellEmptyOrOffTheMap(field, targetX - 1, targetY - 1) &&
                isCellEmptyOrOffTheMap(field, targetX - 1, targetY) &&
                isCellEmptyOrOffTheMap(field, targetX - 1, targetY + 1) &&
                isCellEmptyOrOffTheMap(field, targetX + 1, targetY - 1) &&
                isCellEmptyOrOffTheMap(field, targetX + 1, targetY) &&
                isCellEmptyOrOffTheMap(field, targetX + 1, targetY + 1) &&
                isCellEmptyOrOffTheMap(field, targetX, targetY - 1)) {
            return Direction.DOWN;
        }

        return null;
    }

    private boolean isCellEmptyOrOffTheMap(Field field, int targetX, int targetY) {
        if (targetX < 0 || targetY < 0 || targetX >= field.sizeX() || targetY >= field.sizeY()) {
            return true;
        } else return field.getCellState(targetX, targetY) == Field.CellState.EMPTY;
    }

    enum Direction {
        UP, DOWN, LEFT, RIGHT
    }

    private void printPrettyField(Field field) {
        StringBuffer pretty = new StringBuffer();

        for (int y = 0; y < field.sizeY(); y++) {
            for (int x = 0; x < field.sizeX(); x++) {
                if (field.getCellState(x, y) == Field.CellState.EMPTY) {
                    pretty.append("0");
                } else if (field.getCellState(x, y) == Field.CellState.SHIP) {
                    pretty.append("#");
                } else {
                    pretty.append(field.getCellState(x, y));
                }
            }
            pretty.append("\n");
        }

        System.out.println(pretty);
    }

}
