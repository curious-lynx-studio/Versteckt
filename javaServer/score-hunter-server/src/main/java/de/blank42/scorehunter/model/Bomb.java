package de.blank42.scorehunter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.annotation.JsonValue;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
@JsonRootName("bombs")
public class Bomb {

    private int x;
    private int y;
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


    public Position updateState() {
        long now = System.currentTimeMillis();
        if (now - timeUpdated > 1000L && state != State.EXPLODED) {
            timeUpdated = now;
            state = state.getNextState();
            if (state == State.EXPLODED) {
                return new Position(x, y);
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

        @JsonValue
        public int getId() {
            return this.ordinal();
        }

        public State getNextState() {
            return State.values()[this.ordinal() + 1];
        }

    }

}
