package de.blank42.scorehunter.game.model;

public class BombDamage {

    private String plantedBy;
    private Player givenTo;
    private int damageDealt;

    public BombDamage(String plantedBy, Player givenTo, int damageDealt) {
        this.plantedBy = plantedBy;
        this.givenTo = givenTo;
        this.damageDealt = damageDealt;
    }

    public String getPlantedBy() {
        return plantedBy;
    }

    public Player getGivenTo() {
        return givenTo;
    }

    public int getDamageDealt() {
        return damageDealt;
    }
}
