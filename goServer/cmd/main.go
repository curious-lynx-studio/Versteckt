package main

import (
	"encoding/json"
	"github.com/valplusplusle/score-hunter-server/pkg/lobby"
	"github.com/valplusplusle/score-hunter-server/pkg/socket"
	"log"
	"net/http"
)

var (
	socketManager = socket.NewManager()
)

type GreetingsRequest struct {
	Name string `json:"name"`
}

type GreetingsResponse struct {
	Greeting string `json:"greeting"`
	Name     string `json:"name"`
}

// Start this in terminal instead of IDE for the FileServer to work properly
func main() {
	fileServer := http.FileServer(http.Dir("../resources/html"))
	http.Handle("/", fileServer)

	// Test for ID-Magic
	//http.HandleFunc("/ws", socket.NewUpgrader(&socketManager, HandleIdRequest).UpgradeConnection)

	lobbyManager, upgrader := lobby.NewManager()
	http.HandleFunc("/lobby/create", lobby.NewHandler(&lobbyManager).CreateLobbyHandler)
	http.HandleFunc("/lobbyList", upgrader.UpgradeConnection)

	log.Println("Starting server")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Println(err)
	}
}

type IdRequest struct {
	Id int `json:"id"`
}

type IdResponse struct {
	Greeting string `json:"greeting"`
	Id       int    `json:"id"`
}

func HandleIdRequest(data []byte) {
	request := IdRequest{}
	err := json.Unmarshal(data, &request)
	if err != nil {
		log.Printf("Error processing data: %v\n", err)
		return
	}
	response := IdResponse{
		Greeting: "Hi",
		Id:       request.Id,
	}
	socketManager.BroadcastData <- response
}
