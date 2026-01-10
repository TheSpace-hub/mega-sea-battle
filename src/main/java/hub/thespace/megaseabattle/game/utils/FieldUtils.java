package hub.thespace.megaseabattle.game.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class FieldUtils {

    public boolean isFieldCorrect(Field field) {
        isCorrectNumberOfShips(field);
        return false;
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
        List<List<Field.Position>> ships = new ArrayList<>();

        while (field.getCellState(targetX, targetY) != Field.CellState.SHIP) {
            targetX++;
            if (targetX == field.sizeX()) {
                targetX = 0;
                targetY++;
            }
        }

        Direction direction = getShipDirection(field, targetX, targetY);
        log.info("Direction {} ", direction);
        if (direction == null) return false;

        List<Field.Position> ship = new ArrayList<>();
        for (int i = 0; i < countLengthOfShipCells(field, targetX, targetY, direction); i++) {
            ship.add(new Field.Position(
                    targetX + (direction == Direction.RIGHT ? i : 0),
                    targetY + (direction == Direction.DOWN ? i : 0)
            ));
        }
        ships.add(ship);
        log.info("Ships {} ", ships);
        return false;
    }

    private int countLengthOfShipCells(Field field, int x, int y, Direction direction) {
        int shipCells = 1;
        x += direction == Direction.RIGHT ? 1 : 0;
        y += direction == Direction.DOWN ? 1 : 0;
        while (!isCellEmptyOrOffTheMap(field, x, y)) {
            if (isCellShip(field, x, y)) {
                if (direction == Direction.RIGHT &&
                        isCellEmptyOrOffTheMap(field, x + 1, y - 1) &&
                        isCellEmptyOrOffTheMap(field, x + 1, y + 1)) {
                    shipCells++;
                    x += 1;
                } else if (direction == Direction.DOWN &&
                        isCellEmptyOrOffTheMap(field, x - 1, y + 1) &&
                        isCellEmptyOrOffTheMap(field, x + 1, y + 1)) {
                    shipCells++;
                    y += 1;
                } else {
                    return -1;
                }
            }
        }

        return shipCells;
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

    private boolean isCellShip(Field field, int targetX, int targetY) {
        if (targetX < 0 || targetY < 0 || targetX >= field.sizeX() || targetY >= field.sizeY()) {
            return false;
        } else return field.getCellState(targetX, targetY) == Field.CellState.SHIP;
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
