package lobby

import (
	"encoding/json"
	"github.com/valplusplusle/score-hunter-server/pkg/socket"
	"log"
)

type Lobby struct {
	Name             string            `json:"lobbyName"`
	GameMode         string            `json:"gameMode"`
	Password         string            `json:"password"`
	MaxPlayerCount   int               `json:"maxPlayerCount"`
	ConnectedPlayers map[string]Player `json:"connectedPlayers"`
	PlantedBombs     []Bomb            `json:"bomb"`
	LobbySocket      socket.Manager    `json:"-"`
}

type Player struct {
	Name      string `json:"name"`
	X         int    `json:"x"`
	Y         int    `json:"y"`
	Character int    `json:"character"`
	Health    int    `json:"health"`
}

type Bomb struct {
	X         int    `json:"x"`
	Y         int    `json:"y"`
	PlantedBy string `json:"plantedBy"`
	State     int    `json:"state"`
}

func (player Player) ConsumeUpdateData(data []byte) {
	updateData := UpdateRequest{}
	err := json.Unmarshal(data, &updateData)
	if err != nil {
		log.Printf("Error processing update data %v\n", err)
	}
	if updateData.Bomb != nil {

	}
}
