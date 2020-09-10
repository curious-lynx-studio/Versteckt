package de.blank42.scorehunter.lobby;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.blank42.scorehunter.lobby.exception.LobbyAlreadyExistsException;
import de.blank42.scorehunter.lobby.exception.LobbyIsFullException;
import de.blank42.scorehunter.lobby.exception.LobbyNotFoundException;
import de.blank42.scorehunter.lobby.model.ConnectedLobby;
import de.blank42.scorehunter.lobby.model.Lobby;
import de.blank42.scorehunter.lobby.model.LobbyConnect;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/lobby")
public class LobbyResource {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Inject
    LobbyController lobbyController;


    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String createLobby(Lobby lobby) throws LobbyAlreadyExistsException {
        return lobbyController.addLobby(lobby);
    }

    @POST
    @Path("/connect")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String connectToLobby(LobbyConnect connectRequest) throws LobbyNotFoundException, LobbyIsFullException {
        return lobbyController.connectToLobby(connectRequest);
    }

}
