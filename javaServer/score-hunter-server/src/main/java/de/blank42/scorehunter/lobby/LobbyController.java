package de.blank42.scorehunter.lobby;

import de.blank42.scorehunter.game.GameSocket;
import de.blank42.scorehunter.lobby.exception.LobbyAlreadyExistsException;
import de.blank42.scorehunter.lobby.exception.LobbyIsFullException;
import de.blank42.scorehunter.lobby.exception.LobbyNotFoundException;
import de.blank42.scorehunter.lobby.model.ConnectedLobby;
import de.blank42.scorehunter.lobby.model.ListedLobby;
import de.blank42.scorehunter.lobby.model.Lobby;
import de.blank42.scorehunter.lobby.model.LobbyConnectRequest;
import de.blank42.scorehunter.lobby.model.LobbyCreateRequest;
import de.blank42.scorehunter.lobby.model.LobbyPlayer;
import io.quarkus.security.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Singleton
public class LobbyController {

    private static final Logger LOG = LoggerFactory.getLogger(LobbyController.class);

    Map<String, Lobby> lobbies;

    @Inject
    LobbySocket lobbySocket;

    @Inject
    LobbyListSocket lobbyListSocket;

    @Inject
    GameSocket gameSocket;

    @PostConstruct
    void init() {
        lobbies = new ConcurrentHashMap<>();
    }

    public String addLobby(LobbyCreateRequest lobbyRequest) throws LobbyAlreadyExistsException {
        LOG.info("Start creating lobby {}", lobbyRequest.getLobbyName());
        final String lobbyName = lobbyRequest.getLobbyName();
        if (lobbies.values().stream().anyMatch(savedLobby -> savedLobby.getLobbyName().equals(lobbyName))
                || gameSocket.getRunningGames().stream().anyMatch(runningLobbyName -> runningLobbyName.equals(lobbyName))) {
            LOG.info("Creation stopped, lobby does already exist");
            throw new LobbyAlreadyExistsException();
        }
        Lobby lobby = lobbyRequest.toLobby();
        lobbies.put(lobbyName, lobby);
        CompletableFuture.runAsync(() -> lobbyListSocket.broadcastUpdates());
        LOG.info("Lobby successfully created");
        return lobby.getLobbyUrl();
    }

    public void connectToLobby(String lobbyName, LobbyConnectRequest connectRequest, Session session) throws LobbyNotFoundException, LobbyIsFullException {
        LOG.info("Received connect request for lobby {} from {}", lobbyName, connectRequest.getPlayerName());
        Lobby lobby = lobbies.values().stream()
                .filter(lob -> lob.getLobbyName().equals(lobbyName))
                .findFirst()
                .orElseThrow(LobbyNotFoundException::new);
        if (lobby.isPasswordSecured() && !lobby.getPassword().equals(connectRequest.getPassword())) {
            LOG.error("Wrong password");
            throw new UnauthorizedException("Wrong password");
        }
        if (lobby.isFull()) {
            LOG.error("Lobby is full");
            throw new LobbyIsFullException();
        }
        lobby.addPlayer(connectRequest.getPlayerName(), session);
        LOG.info("Connect successful");
        CompletableFuture.runAsync(() -> {
            lobbyListSocket.broadcastUpdates();
            lobbySocket.broadcastUpdates(lobbyName);
        });
    }

    public ConnectedLobby getLobbyByName(String lobbyName) {
        Lobby lobby = lobbies.get(lobbyName);
        if (lobby != null) {
            return lobby.toConnectedLobby();
        }
        return null;
    }

    public List<ListedLobby> getLobbyList() {
        return lobbies.values()
                .stream()
                .map(Lobby::toListedLobby)
                .sorted(Comparator.comparing(ListedLobby::getLobbyName))
                .collect(Collectors.toList());
    }

    public List<Session> getLobbySessions(String lobbyName) {
        return Optional.ofNullable(lobbies.get(lobbyName))
                .orElse(new Lobby())
                .getPlayerSessions();

    }

    public void setReadyState(String lobbyName, String playerName, boolean ready) {
        Lobby lobby = lobbies.get(lobbyName);
        lobby.getConnectedPlayers()
                .stream()
                .filter(player -> player.getPlayerName().equals(playerName))
                .findFirst()
                .ifPresent(player -> {
                    player.setReady(ready);
                    CompletableFuture.runAsync(() -> lobbySocket.broadcastUpdates(lobbyName));
                });
        if (lobby.getMaxPlayerCount() <= lobby.getCurrentPlayerCount() && lobby.getConnectedPlayers().stream().allMatch(LobbyPlayer::isReady)) {
            startGame(lobby);
        } else {
            CompletableFuture.runAsync(() -> lobbySocket.broadcastUpdates(lobbyName));
        }
    }

    public void removeSession(Session session, String lobbyName) {
        Lobby lobby = lobbies.get(lobbyName);
        lobby.getConnectedPlayers().removeIf(player -> player.getSession().equals(session));
        if (lobby.getConnectedPlayers().isEmpty()) {
            removeLobby(lobbyName);
        }
        CompletableFuture.runAsync(() -> {
            lobbyListSocket.broadcastUpdates();
            lobbySocket.broadcastUpdates(lobbyName);
        });
    }

    public void removeLobby(String lobbyName) {
        lobbies.remove(lobbyName);
    }


    public void startGame(Lobby lobby) {
        LOG.info("Game {} starting", lobby.getLobbyName());
        String startMessage = lobby.getGameUrl();
        gameSocket.createController(lobby.getLobbyName(), lobby.getGameMode());
        lobby.getConnectedPlayers()
                .stream()
                .map(LobbyPlayer::getSession)
                .forEach(session -> session.getAsyncRemote().sendText(startMessage, result -> {
                    try {
                        session.close();
                    } catch (IOException ignored) {
                    }
                }));
        lobbies.remove(lobby.getLobbyName());
        CompletableFuture.runAsync(() -> lobbyListSocket.broadcastUpdates());
    }

    @PreDestroy
    void shutdown() {
        lobbies.values().forEach(Lobby::close);
    }
}
