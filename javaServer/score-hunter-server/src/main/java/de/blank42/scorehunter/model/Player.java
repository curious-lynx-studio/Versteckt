package de.blank42.scorehunter.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.websocket.Session;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

@RegisterForReflection
public class Player {

    static long activeTimeout = 60L;

    private int id;

    @JsonIgnore //ignored because not needed in JSON
    private Session wsSession;

    private List<Position> positions;

    @JsonIgnore
    private LocalTime lastUpdated;

    public Player() {
        positions = List.of();
    }

    public Player(int id, Session wsSession) {
        this();
        this.id = id;
        this.wsSession = wsSession;
        lastUpdated = LocalTime.now();
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setPositions(List<Position> positions) {
        this.positions = positions;
    }

    public int getId() {
        return id;
    }

    public List<Position> getPositions() {
        return positions;
    }

    public void updatePositions(Player newData) {
        this.positions = newData.getPositions();
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

}
