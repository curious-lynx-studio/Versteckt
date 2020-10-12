package lobby

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type Handler struct {
	lobbyManager *Manager
}

func NewHandler(lobbyManager *Manager) Handler {
	return Handler{
		lobbyManager: lobbyManager,
	}
}

func (handler Handler) CreateLobbyHandler(writer http.ResponseWriter, request *http.Request) {
	data := make([]byte, 0)
	status := http.StatusInternalServerError
	header := map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "POST",
		"Access-Control-Allow-Headers": "Content-Type",
	}
	defer writeResponse(writer, &status, &data, &header)

	if request.Method == http.MethodOptions {
		fmt.Println("Responding to preflight request")
		status = 200
		return
	}

	if request.Method != http.MethodPost {
		status = http.StatusMethodNotAllowed
		data = []byte("Only POST is allowed")
		return
	}

	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		data = []byte("Error reading body")
		return
	}

	lobbyRequest := CreateRequest{}
	err = json.Unmarshal(body, &lobbyRequest)
	if err != nil {
		status = 400
		data = []byte("Error processing body")
		return
	}

	err = lobbyRequest.validateRequest()
	if err != nil {
		status = 400
		data = []byte(err.Error())
		return
	}

	err = handler.lobbyManager.AddLobby(lobbyRequest)
	if err != nil {
		status = 400
		data = []byte(err.Error())
		return
	}

	status = 201
	fmt.Println("Lobby added")
}

func writeResponse(writer http.ResponseWriter, responseCode *int, data *[]byte, header *map[string]string) {
	fmt.Printf("Writing response with status %d\n", *responseCode)
	for name, value := range *header {
		writer.Header().Set(name, value)
	}
	writer.WriteHeader(*responseCode)
	_, err := writer.Write(*data)
	if err != nil {
		log.Printf("Error writing response: %v.\n\tData was: %s\n", err, string(*data))
	}
}
