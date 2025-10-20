# 🧩 Task 1 - Java Backend and REST API Implementation


A complete **Spring Boot REST API application** for managing shell command tasks with MongoDB integration, fulfilling **Task 1** requirements of the Kaiburr LLC technical assessment.

---

## 📘 Overview

This project implements a **REST API** for creating, executing, and managing shell command tasks stored in **MongoDB Atlas**.  
Each task includes metadata and a record of previous executions with timestamps and output logs.

---

## ✅ Features

- 🗂️ Task Management (Create, Read, Update, Delete)
- 💻 Command Execution with Output Capture
- ☁️ MongoDB Atlas Integration
- 🔒 Command Validation & Security Filters
- 🧠 Error Handling with Proper HTTP Codes
- ⚙️ Cross-Platform Shell Support (Windows & Unix)
- 🧪 Fully Tested via Postman

---

## 🧱 API Endpoints

| Method | Endpoint | Description |
|:--------|:----------|:-------------|
| `GET` | `/api/tasks` | Retrieve all tasks or by ID |
| `PUT` | `/api/tasks` | Create or update a task |
| `DELETE` | `/api/tasks/{id}` | Delete task by ID |
| `GET` | `/api/tasks/search?name={name}` | Search tasks by name |
| `PUT` | `/api/tasks/{id}/execute` | Execute shell command for a task |

---

## 📦 Prerequisites

- **Java 21+**
- **Gradle 8.14.3+** or **Maven 3.9+**
- **MongoDB Atlas or Local MongoDB**
- **Postman** (for testing)
- **IntelliJ IDEA / Eclipse** (recommended IDEs)

---

## 🚀 How to Run

### **Method 1 — Using IntelliJ IDEA**
```bash
git clone <repository-url>
cd task1
```
- Open project in IntelliJ  
- Wait for Gradle sync  
- Run `Task1Application.java`

Application will start at:  
👉 `http://localhost:8080`


## 🌐 MongoDB Configuration

Set environment variables:
```bash
export SPRING_DATA_MONGODB_URI=mongodb+srv://taskmanager_user:caoGCppwEEoUIu2g@cluster0.hwlz1t0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
export SPRING_DATA_MONGODB_DATABASE=taskmanager
```

Or configure directly in `application.properties`:
```properties
spring.application.name=task1
spring.data.mongodb.uri=mongodb+srv://taskmanager_user:caoGCppwEEoUIu2g@cluster0.hwlz1t0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
spring.data.mongodb.database=taskmanager
server.port=8080
```

---

## 🔧 Example API Usage

### 1️⃣ Create Task
```bash
curl -X PUT http://localhost:8080/api/tasks -H "Content-Type: application/json" -d '{
  "id": "123",
  "name": "Print Hello",
  "owner": "Mani",
  "command": "echo Hello World!",
  "taskExecutions": []
}'
```

### 2️⃣ Execute Task
```bash
curl -X PUT http://localhost:8080/api/tasks/123/execute
```

### 3️⃣ Get All Tasks
```bash
curl -X GET http://localhost:8080/api/tasks
```

### 4️⃣ Search Tasks
```bash
curl -X GET "http://localhost:8080/api/tasks/search?name=Hello"
```

### 5️⃣ Delete Task
```bash
curl -X DELETE http://localhost:8080/api/tasks/123
```

---

## 🧪 Testing with Postman

| Test Case | Method | Endpoint | Description |
|:-----------|:--------|:----------|:-------------|
| Create Task | PUT | `/api/tasks` | Create new task |
| Execute Task | PUT | `/api/tasks/{id}/execute` | Run shell command |
| Get All Tasks | GET | `/api/tasks` | Retrieve all |
| Search Tasks | GET | `/api/tasks/search?name=Hello` | Search by name |
| Delete Task | DELETE | `/api/tasks/{id}` | Remove task |

---

## 🔒 Security

### Blocked Commands:
- `rm -rf`, `del /f`
- `format`, `fdisk`, `sudo`
- `passwd`, `useradd`
- `curl`, `wget`, `nc`, `ssh`
- `shutdown`, `reboot`

## 📂 Project Structure
```
task1/
├── src/
│   ├── main/java/com/example/task1/
│   │   ├── Task1Application.java
│   │   ├── controller/TaskController.java
│   │   ├── model/{Task.java, TaskExecution.java}
│   │   ├── repository/TaskRepository.java
│   │   └── service/TaskService.java
│   └── resources/application.properties
├── build.gradle
├── pom.xml
├── Dockerfile
└── README.md
```

---

## 🖼️ Screenshots
<img width="1004" height="490" alt="Screenshot 2025-10-20 105714" src="https://github.com/user-attachments/assets/9e1f02ca-2bf4-45e1-b7d4-40dbeb3c9de9" />

<img width="1213" height="637" alt="Screenshot 2025-10-20 110046" src="https://github.com/user-attachments/assets/221ba10e-9dd3-4ab2-915b-150e15a6da6c" />
<img width="1219" height="719" alt="Screenshot 2025-10-20 110326" src="https://github.com/user-attachments/assets/adf74841-a639-48d3-8a42-8f0f23375d9f" />
<img width="1283" height="743" alt="Screenshot 2025-10-20 110405" src="https://github.com/user-attachments/assets/c9f569b6-e092-44f3-902b-523724d0a48d" />
<img width="1271" height="694" alt="Screenshot 2025-10-20 110450" src="https://github.com/user-attachments/assets/6dbd8fd0-92fe-4a4b-ba30-8c0410893f1c" />
<img width="1265" height="705" alt="Screenshot 2025-10-20 110539" src="https://github.com/user-attachments/assets/8c42ed2d-0280-4387-99be-6c6eddc7b6f1" />
<img width="1259" height="502" alt="Screenshot 2025-10-20 110717" src="https://github.com/user-attachments/assets/ba26d82e-3b55-47c2-bf4a-391f4b79255b" />
<img width="1187" height="719" alt="Screenshot 2025-10-20 110843" src="https://github.com/user-attachments/assets/a13bed5d-e37d-4434-83d1-534779c8b631" />
