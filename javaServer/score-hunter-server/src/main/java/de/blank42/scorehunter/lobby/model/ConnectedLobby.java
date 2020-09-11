package de.blank42.scorehunter.lobby.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public class ConnectedLobby {

    private List<String> player;
    private Lobby.GameMode gamemode;
    private int maxPlayerCount;

    public ConnectedLobby() {
    }

    public ConnectedLobby(List<String> player, Lobby.GameMode gamemode, int maxPlayerCount) {
        this.player = player;
        this.gamemode = gamemode;
        this.maxPlayerCount = maxPlayerCount;
    }

    public List<String> getPlayer() {
        return player;
    }

    public void setPlayer(List<String> player) {
        this.player = player;
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
