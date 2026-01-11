package hub.thespace.megaseabattle.game.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class FieldUtils {

    public boolean isFieldCorrect(Field field) {
        List<List<Field.Position>> ships = getShipsList(field);
        if (ships == null) return false;
        return ships.stream().filter(list -> list.size() == 1).count() == 4 &&
                ships.stream().filter(list -> list.size() == 2).count() == 3 &&
                ships.stream().filter(list -> list.size() == 3).count() == 2 &&
                ships.stream().filter(list -> list.size() == 4).count() == 1 &&
                ships.size() == 10;
    }

    public List<List<Field.Position>> getShipsList(Field field) {
        int targetX = 0;
        int targetY = 0;
        List<List<Field.Position>> ships = new ArrayList<>();

        while (true) {
            while (field.getCellState(targetX, targetY) != Field.CellState.SHIP || isCellInShipsList(ships, targetX, targetY)) {
                if (targetX == field.sizeX() - 1 && targetY == field.sizeY() - 1) {
                    return ships;
                }
                targetX++;
                if (targetX == field.sizeX()) {
                    targetX = 0;
                    targetY++;
                }
            }

            Direction direction = getShipDirection(field, targetX, targetY);
            if (direction == null) return null;

            List<Field.Position> ship = new ArrayList<>();
            for (int i = 0; i < countLengthOfShipCells(field, targetX, targetY, direction); i++) {
                ship.add(new Field.Position(
                        targetX + (direction == Direction.RIGHT ? i : 0),
                        targetY + (direction == Direction.DOWN ? i : 0)
                ));
            }
            ships.add(ship);
        }
    }

    private boolean isCellInShipsList(List<List<Field.Position>> ships, int x, int y) {
        for (List<Field.Position> ship : ships) {
            if (ship.contains(new Field.Position(x, y))) {
                return true;
            }
        }
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
