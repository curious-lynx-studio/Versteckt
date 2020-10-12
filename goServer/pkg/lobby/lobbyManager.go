package lobby

import (
	"errors"
	"github.com/valplusplusle/score-hunter-server/pkg/socket"
)

type Manager struct {
	Lobbies    map[string]Lobby
	listSocket socket.Manager
	updateData socket.InitData
}

func NewManager() (Manager, socket.Upgrader) {
	manager := Manager{
		Lobbies:    make(map[string]Lobby),
		listSocket: socket.NewManager(),
		updateData: socket.InitData{Data: make([]ListUpdate, 0)},
	}

	upgrader := socket.NewUpgrader(&manager.listSocket, manager.ConsumeData, &manager.updateData)
	return manager, upgrader
}

func (manager *Manager) AddLobby(lobbyRequest CreateRequest) error {
	lobbyName := lobbyRequest.Name
	if _, lobbyExist := manager.Lobbies[lobbyName]; lobbyExist {
		return errors.New("lobby already exists")
	}
	manager.Lobbies[lobbyName] = lobbyRequest.toLobby()
	manager.RefreshUpdateData()
	manager.listSocket.BroadcastData <- manager.updateData.Data
	return nil
}

func (manager *Manager) ConsumeData(_ []byte) {

}

func (manager *Manager) RefreshUpdateData() {
	data := make([]ListUpdate, len(manager.Lobbies))
	i := 0
	for _, lobby := range manager.Lobbies {
		data[i] = lobby.toListUpdate()
		i++
	}
	manager.updateData.Data = data
}
