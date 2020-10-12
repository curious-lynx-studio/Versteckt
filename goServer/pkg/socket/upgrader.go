package socket

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type Upgrader struct {
	upgrader    websocket.Upgrader
	manager     *Manager
	consumeFunc ConsumeData
	initData    *InitData
}

type InitData struct {
	Data interface{}
}

func NewUpgrader(manager *Manager, consumeFunc ConsumeData, initData *InitData) Upgrader {
	upgrader := Upgrader{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		manager:     manager,
		consumeFunc: consumeFunc,
		initData:    initData,
	}
	return upgrader
}

func (upgrader Upgrader) UpgradeConnection(writer http.ResponseWriter, request *http.Request) {
	ws, err := upgrader.upgrader.Upgrade(writer, request, nil)
	if err != nil {
		log.Printf("Error creating socket: %v\n", err)
		return
	}
	if upgrader.initData != nil {
		err = ws.WriteJSON(upgrader.initData.Data)
		if err != nil {
			log.Printf("Error sending init: %v\n", err)
			return
		}
	}
	upgrader.manager.NewConnection <- NewConnectionRequest{
		Connection:   ws,
		ConsumerFunc: upgrader.consumeFunc,
	}
}
