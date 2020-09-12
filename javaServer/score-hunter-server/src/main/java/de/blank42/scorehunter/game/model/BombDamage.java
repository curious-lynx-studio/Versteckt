package de.blank42.scorehunter.game.model;

public class BombDamage {

    private String plantedBy;
    private int damageDealt;

    public BombDamage(String plantedBy, int damageDealt) {
        this.plantedBy = plantedBy;
        this.damageDealt = damageDealt;
    }

    public String getPlantedBy() {
        return plantedBy;
    }

    public int getDamageDealt() {
        return damageDealt;
    }
}
