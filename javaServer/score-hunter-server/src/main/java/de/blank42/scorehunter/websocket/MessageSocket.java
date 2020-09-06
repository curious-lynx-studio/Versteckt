package de.blank42.scorehunter.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.blank42.scorehunter.model.Bomb;
import de.blank42.scorehunter.model.Player;
import de.blank42.scorehunter.model.ResponseData;
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
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
@ServerEndpoint(value = "/positions")
public class MessageSocket {

    private static final Logger LOG = LoggerFactory.getLogger(MessageSocket.class);

    private static int idGenerator = 1;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    Map<String, Player> players;

    List<Bomb> bombs;

    @PostConstruct
    void init() {
        players = new ConcurrentHashMap<>();
    }

    @OnOpen
    public void openSession(Session session) {
        String id = String.valueOf(idGenerator);
        idGenerator++;
        players.put(id, new Player(id, session));
        LOG.info("New player connected. Setting id {}", id);
        session.getAsyncRemote().sendText("id=" + id);
    }

    @OnMessage
    public void saveUpdate(String messageRcv)  {
        try {
            if (messageRcv.startsWith("{bombs")) {
                Bomb bombToAdd = MAPPER.readValue(messageRcv.replace("{bombs", "")
                                .replace("}}","}"), Bomb.class);
                bombs.add(bombToAdd);
            } else {
                Player playerUpdate = MAPPER.readValue(messageRcv, Player.class);
                Player playerToUpdate = players.get(playerUpdate.getId());
                playerToUpdate.updateData(playerUpdate);
            }
        } catch (JsonProcessingException e) {
           LOG.error("Error during update", e);
        }
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

    @Scheduled(every = "10s", delay = 60, delayUnit = TimeUnit.SECONDS)
    public void removeUnusedSessions() {
        players.values()
                .stream()
                .filter(Player::isInactive)
                .forEach(Player::closeConnection);
    }

//    @Scheduled(every = "1s") //for tests
    @Scheduled(every = "0.01s")
    public void sendUpdates() {
        try {
            ResponseData dataToSend = new ResponseData(((List<Player>) players.values()), bombs);
            final String messageToSend = MAPPER.writeValueAsString(dataToSend);
            players.values().forEach(player -> player.sendData(messageToSend));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Scheduled(every = "0.1s")
    public void updateBombs() {
        bombs.forEach(Bomb::updateState);
        bombs.removeIf(Bomb::toRemove);
    }

    @PreDestroy
    void shutdown() {
        players.values().forEach(Player::closeConnection);
    }
}
