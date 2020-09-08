package de.blank42.scorehunter.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

public class Position {

    private int x;
    private int y;

    public Position() {
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
