package de.blank42.scorehunter.lobby;

import de.blank42.scorehunter.lobby.exception.LobbyAlreadyExistsException;
import de.blank42.scorehunter.lobby.exception.LobbyIsFullException;
import de.blank42.scorehunter.lobby.exception.LobbyNotFoundException;
import de.blank42.scorehunter.lobby.model.ConnectedLobby;
import de.blank42.scorehunter.lobby.model.Lobby;
import de.blank42.scorehunter.lobby.model.LobbyConnect;
import io.quarkus.security.UnauthorizedException;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@ApplicationScoped
public class LobbyController {

    Map<String, Lobby> lobbies;

    @Inject
    LobbySocket lobbySocket;

    @Inject
    LobbyListSocket lobbyListSocket;

    @ConfigProperty(name = "server.url")
    String serverUrl;

    @ConfigProperty(name = "quarkus.http.port")
    int port;

    @PostConstruct
    void init() {
        lobbies = new ConcurrentHashMap<>();
    }

    public String addLobby(Lobby lobby) throws LobbyAlreadyExistsException {
        final String lobbyName = lobby.getLobbyName();
        if (lobbies.values().stream().anyMatch(savedLobby -> savedLobby.getLobbyName().equals(lobbyName))) {
            throw new LobbyAlreadyExistsException();
        }
        lobbies.put(lobbyName, lobby);
        CompletableFuture.runAsync(() -> {
            lobbyListSocket.broadcastUpdates();
        });
        return getLobbyUrl(lobby);
    }

    public String connectToLobby(LobbyConnect connectRequest) throws LobbyNotFoundException, LobbyIsFullException {
        final String lobbyName = connectRequest.getLobbyName();
        Lobby lobby = lobbies.values().stream()
                .filter(lob -> lob.getLobbyName().equals(lobbyName))
                .findFirst()
                .orElseThrow(LobbyNotFoundException::new);
        if (lobby.isPasswordSecured() && !lobby.getPassword().equals(connectRequest.getPassword())) {
            throw new UnauthorizedException("Wrong password");
        }
        if (lobby.isFull()) {
            throw new LobbyIsFullException();
        }
        lobby.addPlayer(connectRequest.getPlayerName());
        CompletableFuture.runAsync(() -> {
            lobbyListSocket.broadcastUpdates();
            lobbySocket.broadcastUpdates(lobbyName);
        });
        return getLobbyUrl(lobby);
    }

    public ConnectedLobby getLobbyByName(String lobbyName) {
        return lobbies.get(lobbyName).toConnectedLobby();
    }

    public List<Lobby> getLobbies() {
        return lobbies.values().stream().sorted(Comparator.comparing(Lobby::getLobbyName)).collect(Collectors.toList());
    }

    private String getLobbyUrl(Lobby lobby) {
        return String.format("ws://%s:%d/lobbyJoin/%s", serverUrl, port, lobby.getLobbyName().replace(" ", "%20"));
    }

}
