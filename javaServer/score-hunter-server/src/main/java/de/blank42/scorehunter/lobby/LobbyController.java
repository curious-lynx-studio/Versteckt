package de.blank42.scorehunter.lobby;

import de.blank42.scorehunter.lobby.exception.LobbyAlreadyExistsException;
import de.blank42.scorehunter.lobby.exception.LobbyIsFullException;
import de.blank42.scorehunter.lobby.exception.LobbyNotFoundException;
import de.blank42.scorehunter.lobby.exception.NotAllPlayersReadyException;
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
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@ApplicationScoped
public class LobbyController {

    private static final Logger LOG = LoggerFactory.getLogger(LobbyController.class);

    Map<String, Lobby> lobbies;

    @Inject
    LobbySocket lobbySocket;

    @Inject
    LobbyListSocket lobbyListSocket;

    @PostConstruct
    void init() {
        lobbies = new ConcurrentHashMap<>();
    }

    public String addLobby(LobbyCreateRequest lobbyRequest) throws LobbyAlreadyExistsException {
        final String lobbyName = lobbyRequest.getLobbyName();
        if (lobbies.values().stream().anyMatch(savedLobby -> savedLobby.getLobbyName().equals(lobbyName))) {
            throw new LobbyAlreadyExistsException();
        }
        Lobby lobby = lobbyRequest.toLobby();
        lobbies.put(lobbyName, lobby);
        CompletableFuture.runAsync(() -> lobbyListSocket.broadcastUpdates());
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
        return lobbies.get(lobbyName).toConnectedLobby();
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
        lobbies.get(lobbyName).getConnectedPlayers()
                .stream()
                .filter(player -> player.getPlayerName().equals(playerName))
                .findFirst()
                .ifPresent(player -> {
                    player.setReady(ready);
                    CompletableFuture.runAsync(() -> lobbySocket.broadcastUpdates(lobbyName));
                });
    }

    public void removeSession(Session session, String lobbyName) {
        Lobby lobby = lobbies.get(lobbyName);
        lobby.getConnectedPlayers().removeIf(player -> player.getSession().equals(session));
        Optional<LobbyPlayer> firstPlayer = lobby.getConnectedPlayers().stream().findFirst();
        firstPlayer.ifPresentOrElse(player -> player.setLobbyLeader(true), () -> removeLobby(lobbyName));
        CompletableFuture.runAsync(() -> {
            lobbyListSocket.broadcastUpdates();
            lobbySocket.broadcastUpdates(lobbyName);
        });
    }

    public void removeLobby(String lobbyName) {
        lobbies.remove(lobbyName);
    }


    public void startGame(String lobbyName) throws NotAllPlayersReadyException {
        Lobby lobby = lobbies.get(lobbyName);
        String startMessage = "Start_" + lobby.getGameUrl();
        if (lobby.getConnectedPlayers().stream().anyMatch(player -> !player.isReady())) {
            throw new NotAllPlayersReadyException();
        }
        lobby.getConnectedPlayers()
                .stream()
                .map(LobbyPlayer::getSession)
                .forEach(session -> session.getAsyncRemote().sendText(startMessage, result -> {
                    try {
                        session.close();
                    } catch (IOException ignored) {
                    }
                }));
    }

    @PreDestroy
    void shutdown() {
        lobbies.values().forEach(Lobby::close);
    }
}
