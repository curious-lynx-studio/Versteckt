package de.blank42.scorehunter.lobby.exception;

public class LobbyIsFullException extends Exception {

    public LobbyIsFullException() {
        super("Lobby is full");
    }
}
