package de.blank42.scorehunter.lobby.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public class ConnectedLobby {

    private List<LobbyPlayer> players;
    private Lobby.GameMode gamemode;
    private int maxPlayerCount;

    public ConnectedLobby() {
    }

    public ConnectedLobby(List<LobbyPlayer> players, Lobby.GameMode gamemode, int maxPlayerCount) {
        this.players = players;
        this.gamemode = gamemode;
        this.maxPlayerCount = maxPlayerCount;
    }

    public List<LobbyPlayer> LobbyPlayer() {
        return players;
    }

    public void setPlayer(List<LobbyPlayer> players) {
        this.players = players;
    }

    public Lobby.GameMode getGamemode() {
        return gamemode;
    }

    public void setGamemode(Lobby.GameMode gamemode) {
        this.gamemode = gamemode;
    }

    public int getMaxPlayerCount() {
        return maxPlayerCount;
    }

    public void setMaxPlayerCount(int maxPlayerCount) {
        this.maxPlayerCount = maxPlayerCount;
    }
}
