package de.blank42.scorehunter.lobby.model;

import java.util.List;

public class ConnectedLobby {

    private List<String> player;
    private Lobby.Gamemode gamemode;
    private int maxPlayerCount;

    public ConnectedLobby() {
    }

    public ConnectedLobby(List<String> player, Lobby.Gamemode gamemode, int maxPlayerCount) {
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

    public Lobby.Gamemode getGamemode() {
        return gamemode;
    }

    public void setGamemode(Lobby.Gamemode gamemode) {
        this.gamemode = gamemode;
    }

    public int getMaxPlayerCount() {
        return maxPlayerCount;
    }

    public void setMaxPlayerCount(int maxPlayerCount) {
        this.maxPlayerCount = maxPlayerCount;
    }
}
