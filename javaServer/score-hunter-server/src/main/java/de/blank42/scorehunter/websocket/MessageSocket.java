package de.blank42.scorehunter.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.blank42.scorehunter.model.Player;
import io.quarkus.scheduler.Scheduled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
@ServerEndpoint(value = "/positions", subprotocols = "echo-protocol")
public class MessageSocket {

    private static final Logger LOG = LoggerFactory.getLogger(MessageSocket.class);

    private static int idGenerator = 1;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    Map<Integer, Player> players;

    @PostConstruct
    void init() {
        players = new ConcurrentHashMap<>();
    }

    @OnOpen
    public void openSession(Session session) {
        int id = idGenerator;
        idGenerator++;
        players.put(id, new Player(id, session));
        LOG.info("New player connected. Setting id {}", id);
        session.getAsyncRemote().sendText("id=" + id);
    }

    @OnMessage
    public void notifyUpdate(String messageRcv) throws JsonProcessingException {
        Player playerUpdate = MAPPER.readValue(messageRcv, Player.class);
        LOG.info("Received data from player {}. Notifying others", playerUpdate.getId());
        Player playerToUpdate = players.get(playerUpdate.getId());
        playerToUpdate.updatePositions(playerUpdate);
        String messageToSend = MAPPER.writeValueAsString(players.values());
        players.entrySet()
                .stream()
                .filter(entry -> entry.getKey() != playerUpdate.getId())
                .map(Map.Entry::getValue)
                .forEach(player -> player.sendData(messageToSend));
    }

    @OnClose
    public void closeSession(Session session) {
        players.entrySet()
                .stream()
                .filter(entry -> entry.getValue().isPlayersSession(session))
                .findFirst()
                .ifPresent(playerToRemove -> {
                    players.remove(playerToRemove.getKey());
                    LOG.info("player {} removed", playerToRemove.getKey());
                });
    }

    @Scheduled(every = "10s", delay = 5, delayUnit = TimeUnit.SECONDS)
    public void removeUnusedSessions() {
        players.values()
                .stream()
                .filter(Player::isInactive)
                .forEach(Player::closeConnection);
    }

    @PreDestroy
    void shutdown() {
        players.values().forEach(Player::closeConnection);
    }
}
