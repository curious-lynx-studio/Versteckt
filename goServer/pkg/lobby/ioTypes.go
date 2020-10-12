package lobby

import (
	"errors"
	"github.com/valplusplusle/score-hunter-server/pkg/socket"
)

type UpdateRequest struct {
	Bomb   *Bomb   `json:"bombs"`
	Player *Player `json:"player"`
}

type GameUpdate struct {
	GameMode         string    `json:"gameMode"`
	PlantedBombs     *[]Bomb   `json:"bombs"`
	ConnectedPlayers []*Player `json:"players"`
}

func (lobby Lobby) toGameUpdate() GameUpdate {
	result := GameUpdate{
		GameMode:         lobby.GameMode,
		PlantedBombs:     &lobby.PlantedBombs,
		ConnectedPlayers: make([]*Player, len(lobby.ConnectedPlayers)),
	}
	i := 0
	for _, player := range lobby.ConnectedPlayers {
		result.ConnectedPlayers[i] = &player
		i++
	}
	return result
}

type ListUpdate struct {
	Name               string `json:"lobbyName"`
	LobbyUrl           string `json:"lobbyUrl"`
	GameMode           string `json:"gameMode"`
	CurrentPlayerCount int    `json:"currentPlayerCount"`
	MaxPlayerCount     int    `json:"maxPlayerCount"`
	PasswordSecured    bool   `json:"passwordSecured"`
}

func (lobby Lobby) toListUpdate() ListUpdate {
	return ListUpdate{
		Name:               lobby.Name,
		LobbyUrl:           "ws://blank42.de:8080/lobby/name/" + lobby.Name,
		GameMode:           lobby.GameMode,
		CurrentPlayerCount: len(lobby.ConnectedPlayers),
		MaxPlayerCount:     lobby.MaxPlayerCount,
		PasswordSecured:    lobby.Password != "",
	}
}

type CreateRequest struct {
	Name           string `json:"lobbyName"`
	GameMode       string `json:"gameMode"`
	MaxPlayerCount int    `json:"maxPlayerCount,string"`
	Password       string `json:"password"`
}

func (request CreateRequest) toLobby() Lobby {
	return Lobby{
		Name:             request.Name,
		GameMode:         request.GameMode,
		Password:         request.Password,
		MaxPlayerCount:   request.MaxPlayerCount,
		ConnectedPlayers: make(map[string]Player),
		PlantedBombs:     make([]Bomb, 0),
		LobbySocket:      socket.NewManager(),
	}
}

func (request CreateRequest) validateRequest() error {
	if request.Name == "" {
		return errors.New("lobbyName must not be empty")
	}
	if request.GameMode == "" {
		return errors.New("gameMode must not be empty")
	}
	if request.MaxPlayerCount < 1 || request.MaxPlayerCount > 4 {
		return errors.New("maxPlayerCount must be in 1..4")
	}
	return nil
}
