package de.blank42.scorehunter.lobby.model;

import com.cronutils.utils.StringUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class Lobby {

    private String lobbyName;
    private String password;
    private List<String> connectedPlayers;
    private int maxPlayerCount;
    private Gamemode gamemode;

    public Lobby() {
        connectedPlayers = new ArrayList<>();
    }

    public String getLobbyName() {
        return lobbyName;
    }

    public void setLobbyName(String lobbyName) {
        this.lobbyName = lobbyName;
    }

    @JsonIgnore
    public List<String> getConnectedPlayers() {
        return connectedPlayers;
    }

    public void setConnectedPlayers(List<String> connectedPlayers) {
        this.connectedPlayers = connectedPlayers;
    }

    public int getCurrentPlayerCount() {
        return connectedPlayers.size();
    }

    public int getMaxPlayerCount() {
        return maxPlayerCount;
    }

    public void setMaxPlayerCount(int maxPlayerCount) {
        this.maxPlayerCount = maxPlayerCount;
    }

    @JsonSetter
    public void setPassword(String password) {
        this.password = password;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public boolean isPasswordSecured() {
        return !StringUtils.isEmpty(password);
    }

    @JsonIgnore
    public boolean isFull() {
        return connectedPlayers.size() >= maxPlayerCount;
    }

    public void addPlayer(String playerName) {
        connectedPlayers.add(playerName);
    }

    public ConnectedLobby toConnectedLobby() {
        return new ConnectedLobby(connectedPlayers, gamemode, maxPlayerCount);
    }

    public static enum Gamemode {
        DEATHMATH,
        SCOREHUNTER;
    }

    public void setGamemode(Gamemode gamemode) {
        this.gamemode = gamemode;
    }

    public Gamemode getGamemode() {
        return gamemode;
    }
}
