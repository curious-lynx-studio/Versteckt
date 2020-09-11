package de.blank42.scorehunter.lobby.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class LobbyCreateRequest {

    private String lobbyName;
    private Lobby.GameMode gameMode;
    private int maxPlayerCount;
    private String password;

    public LobbyCreateRequest() {
    }

    public String getLobbyName() {
        return lobbyName;
    }

    public void setLobbyName(String lobbyName) {
        this.lobbyName = lobbyName;
    }

    public Lobby.GameMode getGameMode() {
        return gameMode;
    }

    public void setGameMode(Lobby.GameMode gameMode) {
        this.gameMode = gameMode;
    }

    public int getMaxPlayerCount() {
        return maxPlayerCount;
    }

    public void setMaxPlayerCount(int maxPlayerCount) {
        this.maxPlayerCount = maxPlayerCount;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @JsonIgnore
    public Lobby toLobby() {
        return new Lobby(lobbyName, password, maxPlayerCount, gameMode);
    }
}
