package de.blank42.scorehunter.game.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonRootName;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
@JsonRootName("bombs")
public class Bomb {

    private int x;
    private int y;
    private String plantedBy;
    private State state;

    @JsonIgnore
    private long timeUpdated;

    public Bomb() {
        state = State.PLANTED;
        timeUpdated = System.currentTimeMillis();
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

    public String getPlantedBy() {
        return plantedBy;
    }

    public void setPlantedBy(String plantedBy) {
        this.plantedBy = plantedBy;
    }

    public State getState() {
        return state;
    }

    public Bomb updateState() {
        long now = System.currentTimeMillis();
        if (now - timeUpdated > 1000L && state != State.EXPLODED) {
            timeUpdated = now;
            state = state.getNextState();
            if (state == State.EXPLODED) {
                return this;
            }
        }
        return null;
    }

    public boolean toRemove() {
        return state == State.EXPLODED && System.currentTimeMillis() - timeUpdated > 1000L;
    }

    public enum State {
        PLANTED,
        ONE,
        TWO,
        THREE,
        EXPLODED;

        public State getNextState() {
            return State.values()[this.ordinal() + 1];
        }

    }

}
