package de.blank42.scorehunter.lobby.exception;

public class LobbyAlreadyExistsException extends Exception {

    public LobbyAlreadyExistsException() {
        super("Lobby already exists");
    }
}
