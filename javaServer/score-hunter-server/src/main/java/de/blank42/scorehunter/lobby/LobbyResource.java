package de.blank42.scorehunter.lobby;

import de.blank42.scorehunter.lobby.exception.LobbyAlreadyExistsException;
import de.blank42.scorehunter.lobby.model.LobbyCreateRequest;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@ApplicationScoped
@Path("/lobby")
public class LobbyResource {

    @Inject
    LobbyController lobbyController;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public String createLobby(LobbyCreateRequest lobby) throws LobbyAlreadyExistsException {
        return lobbyController.addLobby(lobby);
    }

}
