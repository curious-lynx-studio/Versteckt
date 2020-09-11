package de.blank42.scorehunter.lobby.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class LobbyConnectRequest {

    private String playerName;
    private String password;

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
