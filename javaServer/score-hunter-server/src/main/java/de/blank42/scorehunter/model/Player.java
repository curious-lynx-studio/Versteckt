package de.blank42.scorehunter.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.websocket.Session;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalTime;

@RegisterForReflection
public class Player {

    static long activeTimeout = 60L;

    @JsonIgnore //ignored because not needed in JSON
    private Session wsSession;

    private String id;
    private int x;
    private int y;
    private String name;
    private int character;
    private int health;

    @JsonIgnore
    private LocalTime lastUpdated;

    public Player() {
    }

    public Player(String id, Session wsSession) {
        this.id = id;
        this.wsSession = wsSession;
        lastUpdated = LocalTime.now();
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    @JsonGetter
    public String getX() {
        return String.valueOf(x);
    }

    @JsonIgnore
    public int getXint() {
        return x;
    }

    @JsonSetter
    public void setX(String x) {
        this.x = Integer.parseInt(x);
    }

    @JsonGetter
    public String getY() {
        return String.valueOf(y);
    }

    @JsonIgnore
    public int getYint() {
        return y;
    }

    @JsonSetter
    public void setY(String y) {
        this.y = Integer.parseInt(y);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCharacter() {
        return character;
    }

    public void setCharacter(int character) {
        this.character = character;
    }

    public int getHealth() {
        return health;
    }

    public void setHealth(int health) {
        this.health = health;
    }

    public void updateData(Player newData) {
        this.name = newData.getName();
        this.character = newData.getCharacter();
        this.x = newData.getXint();
        this.y = newData.getYint();
        this.health = newData.getHealth();
        lastUpdated = LocalTime.now();
    }

    @JsonIgnore
    public boolean isInactive() {
        return Duration.between(lastUpdated, LocalTime.now()).toSeconds() > activeTimeout;
    }

    public void sendData(String toSend) {
        wsSession.getAsyncRemote().sendText(toSend);
    }

    public void closeConnection() {
        try {
            wsSession.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean isPlayersSession(Session otherSession) {
        return wsSession.equals(otherSession);
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", x=" + x +
                ", y=" + y +
                ", name='" + name + '\'' +
                ", character=" + character +
                '}';
    }
}
