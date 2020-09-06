package de.blank42.scorehunter.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public class ResponseData {

    private List<Player> players;
    private List<Bomb> bombs;

    public ResponseData() {
    }

    public ResponseData(List<Player> players, List<Bomb> bomb) {
        this.players = players;
        this.bombs = bomb;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public List<Bomb> getBombs() {
        return bombs;
    }

    public void setBombs(List<Bomb> bombs) {
        this.bombs = bombs;
    }
}
