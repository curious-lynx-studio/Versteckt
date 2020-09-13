package de.blank42.scorehunter.lobby;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.blank42.scorehunter.lobby.model.ConnectedLobby;
import de.blank42.scorehunter.lobby.model.LobbyConnectRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.function.Predicate;
import java.util.regex.Pattern;

@ApplicationScoped
@ServerEndpoint("/lobby/name/{lobbyName}")
public class LobbySocket {

    private static final Logger LOG = LoggerFactory.getLogger(LobbySocket.class);

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Predicate<String> READY_PATTERN = Pattern.compile("^[a-zA-Z0-9]*:ready:true|false").asPredicate();

    @Inject
    LobbyController lobbyController;

    @OnMessage
    public void connectToLobby(Session session, @PathParam("lobbyName") String lobbyName, String message) throws IOException {
        lobbyName = decodeLobbyName(lobbyName);
        try {
            if (READY_PATTERN.test(message)) {
                String[] parts = message.split(":");
                String playerName = parts[0];
                boolean ready = Boolean.parseBoolean(parts[2]);
                lobbyController.setReadyState(lobbyName, playerName, ready);
            } else {
                LobbyConnectRequest connectRequest = MAPPER.readValue(message, LobbyConnectRequest.class);
                lobbyController.connectToLobby(lobbyName, connectRequest, session);
            }
        } catch (Exception e) {
            LOG.error("Error connecting to lobby");
            session.close();
        }
    }


    @OnClose
    public void removeSession(Session session, @PathParam("lobbyName") String lobbyName) {
        lobbyName = decodeLobbyName(lobbyName);
        lobbyController.removeSession(session, lobbyName);
        broadcastUpdates(lobbyName);
    }

    public void broadcastUpdates(String lobbyName)  {
        try {
            ConnectedLobby lobby = lobbyController.getLobbyByName(lobbyName);
            if (lobby != null) {
                final String lobbyUpdate = MAPPER.writeValueAsString(lobby);
                lobbyController.getLobbySessions(lobbyName).forEach(session ->
                        session.getAsyncRemote().sendText(lobbyUpdate)
                );
            }
        } catch (JsonProcessingException e) {
            LOG.error("Error processing lobby data", e);
        }
    }

    private String decodeLobbyName(String lobbyName) {
        return URLDecoder.decode(lobbyName, StandardCharsets.UTF_8);
    }
}
