package de.blank42.scorehunter.game;

import de.blank42.scorehunter.lobby.model.Lobby;
import io.quarkus.scheduler.Scheduled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Singleton;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Singleton
@ServerEndpoint("/game/{gameName}")
public class GameSocket {

    private static final Logger LOG = LoggerFactory.getLogger(GameSocket.class);

    Map<String, GameController> gameControllers;

    @PostConstruct
    void init() {
        gameControllers = new ConcurrentHashMap<>();
    }

    @OnOpen
    public void openSession(Session session, @PathParam("gameName") String gameName) {
        gameControllers.get(gameName).addPlayer(session);
    }

    @OnMessage
    public void saveUpdate(String messageRcv, @PathParam("gameName") String gameName) {
        gameControllers.get(gameName).processUpdate(messageRcv);
    }

    @OnClose
    public void closeSession(Session session, @PathParam("gameName") String gameName) {
        gameControllers.get(gameName).closeSession(session);
    }

    public void createController(String gameName, Lobby.GameMode gameMode) {
        GameController controller = new GameController();
        controller.init();
        controller.setGameMode(gameMode);
        gameControllers.put(gameName, controller);
        LOG.info("Created game for lobby {}", gameName);
    }

    public Set<String> getRunningGames() {
        return gameControllers.keySet();
    }

    @Scheduled(every = "0.01s")
    public void sendUpdates() {
        gameControllers.values().forEach(GameController::sendUpdate);
    }

    @Scheduled(every = "10s", delay = 60, delayUnit = TimeUnit.SECONDS)
    void removeUnusedSessions() {
        gameControllers.values().forEach(GameController::removeUnusedSessions);
    }

    @Scheduled(every = "0.1s")
    void updateBombs() {
        gameControllers.values().forEach(GameController::updateBombs);
    }
}
