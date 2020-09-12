package de.blank42.scorehunter.lobby.exception;

public class NotAllPlayersReadyException extends Exception {

    public NotAllPlayersReadyException() {
        super("Not all players are ready");
    }
}
