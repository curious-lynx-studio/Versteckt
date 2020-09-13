package de.blank42.scorehunter.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.blank42.scorehunter.game.model.Bomb;
import de.blank42.scorehunter.game.model.GameData;
import de.blank42.scorehunter.game.model.Player;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;
import java.util.ArrayList;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class GameController {

    private static final Logger LOG = LoggerFactory.getLogger(GameController.class);

    private static int idGenerator = 1;

    private static final ObjectMapper DEFAULT_MAPPER = new ObjectMapper();
    private static final ObjectMapper BOMB_MAPPER = new ObjectMapper().enable(DeserializationFeature.UNWRAP_ROOT_VALUE);

    private GameData gameData;

    @PostConstruct
    void init() {
        gameData = new GameData(new ConcurrentHashMap<>(), new ArrayList<>());
    }

    public void addPlayer(Session playerSession) {
        String id = String.valueOf(idGenerator);
        idGenerator++;
        gameData.addPlayer(id, playerSession);
        LOG.info("New player connected. Setting id {}", id);
        playerSession.getAsyncRemote().sendText("id=" + id);
    }

    public void processUpdate(String messageRcv) {
        try {
            if (messageRcv.startsWith("{\"bombs")) {
                Bomb bombToAdd = BOMB_MAPPER.readValue(messageRcv, Bomb.class);
                gameData.getBombs().add(bombToAdd);
            } else {
                Player playerUpdate = DEFAULT_MAPPER.readValue(messageRcv, Player.class);
                gameData.updateData(playerUpdate);
            }
        } catch (JsonProcessingException e) {
            LOG.debug("Error during update", e);
        }
    }

    public void sendUpdate() {
        final String messageToSend = this.getGameDataAsString();
        gameData.getPlayers().forEach(player -> player.sendData(messageToSend));
    }

    public void closeSession(Session session) {
        gameData.getPlayers()
                .stream()
                .filter(player -> player.isPlayersSession(session))
                .findFirst()
                .ifPresent(gameData::removePlayer);
    }

    private String getGameDataAsString() {
        String result = "{bombs:[], players:[]}";
        try {
            result = DEFAULT_MAPPER.writeValueAsString(gameData);
        } catch (JsonProcessingException e) {
            LOG.info("Error serializing game data", e);
        }
        return result;
    }

    public void removeUnusedSessions() {
        gameData.getPlayers()
                .stream()
                .filter(Player::isInactive)
                .forEach(Player::closeConnection);
    }

    public void updateBombs() {
        gameData.getBombs().stream()
                .map(Bomb::updateState)
                .filter(Objects::nonNull)
                .flatMap(gameData::calculateBombDamage)
                .forEach(bombDamage -> {
                    if (!bombDamage.getPlantedBy().equals(bombDamage.getGivenTo().getName())) {
                        Player playerToUpdate = gameData.getPlayerByName(bombDamage.getPlantedBy());
                        playerToUpdate.regenerateHealth(bombDamage.getDamageDealt());
                    }
                    //TODO: Implement scoreboard
                });
        gameData.getBombs().removeIf(Bomb::toRemove);
    }

    @PreDestroy
    void shutdown() {
        gameData.getPlayers().forEach(Player::closeConnection);
    }

}
