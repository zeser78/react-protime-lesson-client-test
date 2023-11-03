// main.go
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

var db *sql.DB

type Lesson struct {
	ID     int64 `json:"id"`
	UserID int64 `json:"user_id"`
	// Name       string `json:"name"`
	ClientID        int64  `json:"client_id"`
	LessonPackageID int64  `json:"lesson_package_id"` // added field
	ClientName      string `json:"client_name"`
	Description     string `json:"description"`
	Price           float64
	Place           string `json:"place"`
	Status          string
	LessonDate      string
	LessonDateTime  time.Time
	FormattedDate   string
	LessonTime      string
	FormattedTime   time.Time
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type Client struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	// add other fields as required
}

type LessonPackage struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type LessonPackageTrack struct {
	ID               int64 `json:"id"`
	ClientID         int64 `json:"client_id"`
	LessonPackageID  int64 `json:"lesson_package_id"`
	RemainingLessons int64 `json:"remaining_lessons"`
}

func main() {
	cfg := mysql.Config{
		User:   "protimetennis",
		Passwd: "protimetennis",
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "protimetennis_test",
		//mysql native authentication
		// AllowNativePasswords: true,
		ParseTime: true,
	}
	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected!")
	ensureTableExists()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allow your React app domain
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	mux := http.NewServeMux()
	mux.HandleFunc("/getData", getData)
	mux.HandleFunc("/addLesson", addLesson)

	handler := c.Handler(mux)

	err = http.ListenAndServe("127.0.0.1:5000", handler)
	if err != nil {
		log.Fatal(err)
	}
}
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func getData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	rows, err := db.Query("SELECT id, user_id, client_id, price, lesson_date_time FROM lessons_2")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var data []Lesson
	for rows.Next() {
		var lesson Lesson
		err = rows.Scan(&lesson.ID, &lesson.UserID, &lesson.ClientID, &lesson.Price, &lesson.LessonDateTime)
		if err != nil {
			log.Fatal(err)
		}
		data = append(data, lesson)
	}
	json.NewEncoder(w).Encode(data)

}

func addLesson(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var request Lesson
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// fmt.Println(r)
	fmt.Println(request.UserID, request.ClientID, request.Price, request.LessonDateTime)

	// lessonDateTime = date + " " + time
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = db.Exec(
		`INSERT INTO lessons_2 (user_id, client_id,  price, lesson_date_time) VALUES (?, ?, ?, ?)`,
		request.UserID, request.ClientID, request.Price, request.LessonDateTime,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	lessonPackageID := request.LessonPackageID // Get lesson package ID from request or default to None
	clientID := request.ClientID

	// Update the lesson_package_tracks table
	// _, err = db.Exec(`
	//     UPDATE lesson_package_tracks_2
	//     SET remaining_lessons = remaining_lessons - 1
	//     WHERE client_id = ? AND lesson_package_id = ?`, clientID, lessonPackageID)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// Check if a record exists
	err = db.QueryRow(`
SELECT 1 FROM lesson_package_tracks_2
WHERE client_id = ? AND lesson_package_id = ?`, clientID, lessonPackageID).Scan(&recordExists)

	if err != nil && err != sql.ErrNoRows {
		// handle error
	}

	// If record exists, update it
	if err != sql.ErrNoRows {
		_, err = db.Exec(`
	UPDATE lesson_package_tracks_2
	SET remaining_lessons = remaining_lessons - 1 
	WHERE client_id = ? AND lesson_package_id = ?`, clientID, lessonPackageID)
	} else {
		// If record doesn't exist, insert a new one
		_, err = db.Exec(`
	INSERT INTO lesson_package_tracks_2 (client_id, lesson_package_id, remaining_lessons)
	VALUES (?, ?, ?)`, clientID, lessonPackageID, initialLessons-1)
	}

	// handle error if any

	w.WriteHeader(http.StatusCreated)
}

func ensureTableExists() {
	// Array of SQL statements to create tables
	createTableSQL := []string{
		`
        CREATE TABLE IF NOT EXISTS users_2 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `,
		`
        CREATE TABLE IF NOT EXISTS clients_2 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users_2(id)
        );
        `,
		`
        CREATE TABLE IF NOT EXISTS lessons_2 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            client_id INT NOT NULL,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            lesson_date_time DATETIME NOT NULL DEFAULT '2023-01-01 08:00:00',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users_2(id),
            FOREIGN KEY (client_id) REFERENCES clients_2(id)
        );
        `,
		`
		CREATE TABLE IF NOT EXISTS lesson_packages_2 (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL UNIQUE,
			total_lessons INT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);
        `,
		`
		CREATE TABLE IF NOT EXISTS lesson_package_tracks_2 (
			id INT AUTO_INCREMENT PRIMARY KEY,
			client_id INT NOT NULL,
			lesson_package_id INT NOT NULL,
			remaining_lessons INT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (client_id) REFERENCES clients_2(id),
			FOREIGN KEY (lesson_package_id) REFERENCES lesson_packages(id)
		);
        `,
	}

	// Execute each SQL statement
	for _, query := range createTableSQL {
		_, err := db.Exec(query)
		if err != nil {
			log.Fatalf("Failed to ensure that table exists: %v", err)
		}
	}
}

// INSERT INTO users_2 (username) VALUES ('Sergio');
// INSERT INTO clients_2 (user_id, name) VALUES (1, 'Nadia');
//TODO: Get the intial value and recor to check the lessonPacketId
//TODO: Check when th lesson package is None.
//TODO: Check when is lesson remain is zero and it needs to renew or wait to buy another one.
