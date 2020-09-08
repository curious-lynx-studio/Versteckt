package de.blank42.scorehunter.model;

public class Position {

    private int x;
    private int y;

    public Position(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public double getDistance(int otherX, int otherY) {
        int distanceX = otherX - x;
        int distanceY = otherY - y;
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }
}
