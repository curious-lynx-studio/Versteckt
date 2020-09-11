package de.blank42.scorehunter.lobby;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

@ApplicationScoped
@ServerEndpoint("/lobby/name/{lobbyName}")
public class LobbySocket {

    private static final Logger LOG = LoggerFactory.getLogger(LobbySocket.class);

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Inject
    LobbyController lobbyController;

    @OnMessage
    public void connectToLobby(Session session, @PathParam("lobbyName") String lobbyName, String message) throws IOException {
        try {
            LobbyConnectRequest connectRequest = MAPPER.readValue(message, LobbyConnectRequest.class);
            lobbyController.connectToLobby(lobbyName, connectRequest, session);
            session.getAsyncRemote().sendText(MAPPER.writeValueAsString(lobbyController.getLobbyByName(lobbyName)));
        } catch (Exception e) {
            LOG.error("Error connecting to lobby");
            session.close();
        }
    }


    @OnClose
    public void removeSession(Session session, @PathParam("lobbyName") String lobbyName) {
        lobbyController.removeSession(session, lobbyName);
        broadcastUpdates(lobbyName);
    }

    public void broadcastUpdates(String lobbyName)  {
        //TODO: Add ready state for player
        try {
            final String lobbyUpdate = MAPPER.writeValueAsString(lobbyController.getLobbyByName(lobbyName));
            lobbyController.getLobbySessions(lobbyName).forEach(session ->
                    session.getAsyncRemote().sendText(lobbyUpdate)
            );
        } catch (JsonProcessingException e) {
            LOG.error("Error processing lobby data", e);
        }
    }
}
