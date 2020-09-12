package de.blank42.scorehunter.game;

import io.quarkus.scheduler.Scheduled;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
@ServerEndpoint("/game/{gameName}")
public class GameSocket {

    Map<String, GameController> gameControllers;

    @PostConstruct
    void init() {
        gameControllers = new ConcurrentHashMap<>();
    }

    @OnOpen
    public void openSession(Session session, @PathParam("gameName") String gameName) {
        getController(gameName).addPlayer(session);
    }

    @OnMessage
    public void saveUpdate(String messageRcv, @PathParam("gameName") String gameName) {
        getController(gameName).processUpdate(messageRcv);
    }

    @OnClose
    public void closeSession(Session session, @PathParam("gameName") String gameName) {
        getController(gameName).closeSession(session);
    }

    private GameController getController(String gameName) {
        return Optional.ofNullable(gameControllers.get(gameName))
                .orElseGet(() -> {
                    GameController result = new GameController();
                    result.init();
                    gameControllers.put(gameName, result);
                    return result;
                });
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
