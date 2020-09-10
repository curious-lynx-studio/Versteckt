package de.blank42.scorehunter.lobby.exception;

public class LobbyNotFoundException extends Exception {

    public LobbyNotFoundException() {
        super("Lobby does not exist");
    }
}
