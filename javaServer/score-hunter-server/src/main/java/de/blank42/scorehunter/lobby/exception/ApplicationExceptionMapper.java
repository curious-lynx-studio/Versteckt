package de.blank42.scorehunter.lobby.exception;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class ApplicationExceptionMapper implements ExceptionMapper<Exception> {
    @Override
    public Response toResponse(Exception e) {
        Response.ResponseBuilder response ;
        if (e instanceof LobbyAlreadyExistsException) {
            response = Response.status(Response.Status.CONFLICT).entity(e.getMessage());
        } else {
            response = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage());
        }

        return response.build();
    }
}
