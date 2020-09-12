package de.blank42.scorehunter.game.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.websocket.Session;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RegisterForReflection
public class GameData {

    private Map<String, Player> players;
    private List<Bomb> bombs;

    public GameData() {
    }

    public GameData(Map<String, Player> players, List<Bomb> bomb) {
        this.players = players;
        this.bombs = bomb;
    }

    @JsonGetter
    public Collection<Player> getPlayers() {
        return players.values();
    }

    public List<Bomb> getBombs() {
        return bombs;
    }

    public void addPlayer(String id, Session playerSession) {
        players.put(id, new Player(id, playerSession));
    }

    public Player getPlayerByName(String playerName) {
        return players.get(playerName);
    }

    public void updateData(Player playerUpdate) {
        Player playerToUpdate = players.get(playerUpdate.getId());
        playerToUpdate.updateData(playerUpdate);
    }

    public void removePlayer(Player playerToRemove) {
        players.remove(playerToRemove.getId());
    }

    public Stream<BombDamage> calculateBombDamage(Bomb explodedBomb) {
        return players.values()
                .stream()
                .map(player -> player.updateBombDamage(explodedBomb));
    }


}
