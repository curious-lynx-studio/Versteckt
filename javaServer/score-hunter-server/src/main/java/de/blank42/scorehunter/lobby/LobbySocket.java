package de.blank42.scorehunter.lobby;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
@ServerEndpoint("/lobby/name/{lobbyName}")
public class LobbySocket {

    private static final Logger LOG = LoggerFactory.getLogger(LobbySocket.class);

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Inject
    LobbyController lobbyController;

    Map<String, List<Session>> sessions;

    @PostConstruct
    void init() {
        sessions = new ConcurrentHashMap<>();
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("lobbyName") String lobbyName) {
        if (sessions.containsKey(lobbyName)) {
            sessions.get(lobbyName).add(session);
        } else {
            sessions.put(lobbyName, new ArrayList<>(List.of(session)));
        }
        try {
            session.getAsyncRemote().sendText(MAPPER.writeValueAsString(lobbyController.getLobbyByName(lobbyName)));
        } catch (JsonProcessingException e) {
            LOG.error("Error processing lobby data", e);
        }
    }


    @OnClose
    public void removeSession(Session session, @PathParam("lobbyName") String lobbyName) {
        sessions.get(lobbyName).remove(session);
    }

    public void broadcastUpdates(String lobbyName)  {
        try {
            final String lobbyUpdate = MAPPER.writeValueAsString(lobbyController.getLobbyByName(lobbyName));
            sessions.get(lobbyName).forEach(session -> session.getAsyncRemote().sendText(lobbyUpdate));
        } catch (JsonProcessingException e) {
            LOG.error("Error processing lobby data", e);
        }
    }
}
