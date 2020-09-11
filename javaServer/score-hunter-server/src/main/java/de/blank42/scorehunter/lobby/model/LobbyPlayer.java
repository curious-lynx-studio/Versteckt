package de.blank42.scorehunter.lobby.model;

import javax.websocket.Session;

public class LobbyPlayer {

    private String playerName;
    private boolean lobbyLeader;
    private Session session;

    public LobbyPlayer(String playerName, Session session) {
        this.playerName = playerName;
        this.session = session;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public boolean isLobbyLeader() {
        return lobbyLeader;
    }

    public void setLobbyLeader(boolean lobbyLeader) {
        this.lobbyLeader = lobbyLeader;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
