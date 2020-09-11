package de.blank42.scorehunter.lobby;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
@ServerEndpoint("/lobbyList")
public class LobbyListSocket {

    private static final Logger LOG = LoggerFactory.getLogger(LobbyListSocket.class);

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Inject
    LobbyController lobbyController;

    List<Session> sessions = new ArrayList<>();;

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        try {
            session.getAsyncRemote().sendText(MAPPER.writeValueAsString(lobbyController.getLobbyList()));
        } catch (JsonProcessingException e) {
            LOG.error("Error processing lobby list", e);
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    public void broadcastUpdates() {
        try {
            final String updateData = MAPPER.writeValueAsString(lobbyController.getLobbyList());
            sessions.forEach(session -> session.getAsyncRemote().sendText(updateData));
        } catch (JsonProcessingException e) {
            LOG.error("Error processing lobby list", e);
        }
    }
}
