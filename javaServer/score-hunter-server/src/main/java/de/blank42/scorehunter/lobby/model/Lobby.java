package de.blank42.scorehunter.lobby.model;

import com.cronutils.utils.StringUtils;
import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

import javax.websocket.Session;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Lobby {

    private String lobbyName;
    private String password;
    private List<LobbyPlayer> connectedPlayers;
    private int maxPlayerCount;
    private GameMode gameMode;

    public Lobby() {
        connectedPlayers = new ArrayList<>();
    }

    public Lobby(String lobbyName, String password, int maxPlayerCount, GameMode gameMode) {
        this();
        this.lobbyName = lobbyName;
        this.password = password;
        this.maxPlayerCount = maxPlayerCount;
        this.gameMode = gameMode;
    }

    public String getLobbyName() {
        return lobbyName;
    }

    public String getPassword() {
        return password;
    }

    public List<LobbyPlayer> getConnectedPlayers() {
        return connectedPlayers;
    }

    public static enum GameMode {
        DEATHMATH,
        SCOREHUNTER;
    }

    public void setGameMode(GameMode gamemode) {
        this.gameMode = gamemode;
    }

    public GameMode getGameMode() {
        return gameMode;
    }

    public boolean isPasswordSecured() {
        return !StringUtils.isEmpty(password);
    }

    public boolean isFull() {
        return connectedPlayers.size() >= maxPlayerCount;
    }

    public String getLobbyUrl() {
        Config config = ConfigProvider.getConfig();
        String serverUrl = config.getValue("server.url", String.class);
        int port = config.getValue("quarkus.http.port", Integer.class);
        return String.format("ws://%s:%d/lobby/name/%s", serverUrl, port,
                URLEncoder.encode(lobbyName, StandardCharsets.UTF_8));
    }


    public String getGameUrl() {
        Config config = ConfigProvider.getConfig();
        String serverUrl = config.getValue("server.url", String.class);
        int port = config.getValue("quarkus.http.port", Integer.class);
        return String.format("ws://%s:%d/game/%s", serverUrl, port,
                URLEncoder.encode(lobbyName, StandardCharsets.UTF_8));
    }

    public int getCurrentPlayerCount() {
        return connectedPlayers.size();
    }

    public List<Session> getPlayerSessions() {
        return connectedPlayers.stream().map(LobbyPlayer::getSession).collect(Collectors.toList());
    }

    public ConnectedLobby toConnectedLobby() {
        return new ConnectedLobby(connectedPlayers, gameMode, maxPlayerCount);
    }

    public ListedLobby toListedLobby() {
        return new ListedLobby(lobbyName, getLobbyUrl(), gameMode, maxPlayerCount, getCurrentPlayerCount(),
                isPasswordSecured());
    }

    public void addPlayer(String playerName, Session session) {
        connectedPlayers.add(new LobbyPlayer(playerName, session, !connectedPlayers.isEmpty()));
    }

    public void close()  {
        for (Session session : getPlayerSessions()) {
            try {
                session.close();
            } catch (IOException ignored) {
            }
        }
    }

}
