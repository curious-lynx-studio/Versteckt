package de.blank42.scorehunter.lobby.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class ListedLobby {

    private String lobbyName;
    private String lobbyUrl;
    private Lobby.GameMode gameMode;
    private int currentPlayerCount;
    private int maxPlayerCount;
    private boolean passwordSecured;

    public ListedLobby() {
    }

    public ListedLobby(String lobbyName, String lobbyUrl, Lobby.GameMode gameMode, int maxPlayerCount,
                       int currentPlayerCount, boolean passwordSecured) {
        this.lobbyName = lobbyName;
        this.lobbyUrl = lobbyUrl;
        this.gameMode = gameMode;
        this.maxPlayerCount = maxPlayerCount;
        this.currentPlayerCount = currentPlayerCount;
        this.passwordSecured = passwordSecured;
    }

    public String getLobbyName() {
        return lobbyName;
    }

    public void setLobbyName(String lobbyName) {
        this.lobbyName = lobbyName;
    }

    public String getLobbyUrl() {
        return lobbyUrl;
    }

    public void setLobbyUrl(String lobbyUrl) {
        this.lobbyUrl = lobbyUrl;
    }

    public Lobby.GameMode getGameMode() {
        return gameMode;
    }

    public void setGameMode(Lobby.GameMode gameMode) {
        this.gameMode = gameMode;
    }

    public int getCurrentPlayerCount() {
        return currentPlayerCount;
    }

    public void setCurrentPlayerCount(int currentPlayerCount) {
        this.currentPlayerCount = currentPlayerCount;
    }

    public int getMaxPlayerCount() {
        return maxPlayerCount;
    }

    public void setMaxPlayerCount(int maxPlayerCount) {
        this.maxPlayerCount = maxPlayerCount;
    }

    public void setPasswordSecured(boolean passwordSecured) {
        this.passwordSecured = passwordSecured;
    }

    public boolean isPasswordSecured() {
        return passwordSecured;
    }
}
