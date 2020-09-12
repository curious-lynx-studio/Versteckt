package de.blank42.scorehunter.game;

import io.quarkus.scheduler.Scheduled;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.concurrent.TimeUnit;

@Deprecated(forRemoval = true)
@ApplicationScoped
@ServerEndpoint("/positions")
public class MessageSocket {

    @Inject
    GameController gameController;

    @OnOpen
    public void openSession(Session session) {
        gameController.addPlayer(session);
    }

    @OnMessage
    public void saveUpdate(String messageRcv) {
        gameController.processUpdate(messageRcv);
    }

    @OnClose
    public void closeSession(Session session) {
        gameController.closeSession(session);
    }

    @Scheduled(every = "0.01s")
    public void sendUpdates() {
        gameController.sendUpdate();
    }

    @Scheduled(every = "10s", delay = 60, delayUnit = TimeUnit.SECONDS)
    void removeUnusedSessions() {
        gameController.removeUnusedSessions();
    }

    @Scheduled(every = "0.1s")
    void updateBombs() {
        gameController.updateBombs();
    }
}
