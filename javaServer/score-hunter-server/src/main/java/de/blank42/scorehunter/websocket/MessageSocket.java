package de.blank42.scorehunter.websocket;

import de.blank42.scorehunter.model.GameController;
import io.quarkus.scheduler.Scheduled;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ApplicationScoped
@ServerEndpoint(value = "/positions")
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
}
