# 🐞 Issue Tracker System

A full-stack **Issue Tracking Web Application** built using **React, Spring Boot, and MySQL**.
This application helps users create, manage, and track issues efficiently with a modern UI and secure backend.

---

## 🚀 Features

### 🔐 Authentication

* Secure Login using JWT Authentication
* Token-based session management

### 📊 Dashboard

* Total Issues count
* Open vs Closed Issues tracking
* Interactive charts (status & priority)

### 🧾 Issue Management

* Create new issues
* Edit existing issues
* Delete issues
* Assign issues to users

### 🎯 Filters & Controls

* Filter issues by status (Open / Closed)
* Change issue status via dropdown
* Priority labels (High / Medium / Low)

### 📅 Additional Features

* Date tracking (issue creation date)
* Real-time updates after actions
* Toast notifications for better UX

---

## 🛠️ Tech Stack

### 💻 Frontend

* React.js
* Bootstrap
* Chart.js
* React Toastify

### ⚙️ Backend

* Spring Boot
* Spring Security
* JWT Authentication
* JPA / Hibernate

### 🗄️ Database

* MySQL

---

## 📁 Project Structure

```bash
issue-tracker/
├── Backend/                  # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/  # React Frontend
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## ▶️ Run Project Locally

### 🔹 Backend

```bash
cd Backend
mvn spring-boot:run
```

Runs on:

```
http://localhost:9090
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm start
```

Runs on:

```
http://localhost:3000
```

---

## 🔑 Default Login

```
Username: admin
Password: 1234
```

---

## 📊 Charts Included

* Issues by Status (Open vs Closed)
* Issues by Priority (High / Medium / Low)

---

## 💡 Future Enhancements

* Role-based access (Admin/User)
* Search functionality
* Pagination
* Email notifications
* Dark mode

---

## 👩‍💻 Author

**Dibyasmita Mohapatra**

---

## ⭐ Support

If you like this project:

* ⭐ Star this repository
* 📢 Share with others

---
