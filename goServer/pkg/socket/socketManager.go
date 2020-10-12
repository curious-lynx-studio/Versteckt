package socket

import (
	"github.com/gorilla/websocket"
	"log"
)

type Manager struct {
	connections     map[*websocket.Conn]bool
	NewConnection   chan NewConnectionRequest
	CloseConnection chan *websocket.Conn
	BroadcastData   chan interface{}
}

type NewConnectionRequest struct {
	Connection   *websocket.Conn
	ConsumerFunc ConsumeData
}

type ConsumeData func([]byte)

func NewManager() Manager {
	manager := Manager{
		connections:     make(map[*websocket.Conn]bool),
		NewConnection:   make(chan NewConnectionRequest),
		CloseConnection: make(chan *websocket.Conn),
		BroadcastData:   make(chan interface{}),
	}
	go manager.handleConnections()
	return manager
}

func (man Manager) handleConnections() {
	for {
		select {
		case request := <-man.NewConnection:
			log.Println("WS client connected")
			man.connections[request.Connection] = true
			go man.receiveData(request.Connection, request.ConsumerFunc)
			log.Printf("There are now %d connections\n", len(man.connections))
		case ws := <-man.CloseConnection:
			log.Println("WS client disconnected")
			delete(man.connections, ws)
			log.Printf("There are now %d connections\n", len(man.connections))
		case data := <-man.BroadcastData:
			for socket, _ := range man.connections {
				_ = socket.WriteJSON(data)
			}
		}
	}
}

func (man Manager) receiveData(ws *websocket.Conn, consumerFunc ConsumeData) {
	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			_ = ws.Close()
			man.CloseConnection <- ws
			return
		}
		consumerFunc(message)
	}
}
