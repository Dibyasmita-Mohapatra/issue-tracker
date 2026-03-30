# 🐞 Issue Tracker System

A full-stack Issue Tracking Web Application built using **React, Spring Boot, and MySQL**.
This application helps users create, manage, and track issues efficiently with a modern UI, analytics dashboard, and secure backend.

---

# 🚀 Features

## 🔐 Authentication

* Secure Login using JWT Authentication
* Token-based session management
* Role-based access (Admin/User)

---

## 📊 Dashboard

* Total Issues count
* Open vs Closed Issues tracking
* Completion Rate (%)
* High / Medium / Low Priority analytics
* Issues assigned per user
* Issues created per day
* Interactive charts using Chart.js
* Real-time auto-refresh (every 10 seconds)

---

## 🧾 Issue Management

* Create new issues
* Edit existing issues
* Delete issues
* Assign issues to users
* Update issue status (Open / Closed)
* Upload and attach files to issues
* View uploaded files via link

---

## 🎯 Filters & Controls

* Filter by status (Open / Closed / All)
* Filter by priority (High / Medium / Low)
* Search issues by title & description
* Pagination for better data handling

---

## 💬 Comments System

* Add comments to issues
* View all comments per issue
* Real-time comment updates

---

## 📅 Additional Features

* Activity Logs tracking user actions
* Toast notifications for better UX
* Date tracking (issue creation date)
* Dark Mode 🌙 / Light Mode ☀ toggle
* Responsive and modern UI

---

# 🛠️ Tech Stack

## 💻 Frontend

* React.js
* Bootstrap
* Chart.js
* React Toastify

## ⚙️ Backend

* Spring Boot
* Spring Security
* JWT Authentication
* JPA / Hibernate

## 🗄️ Database

* MySQL

---

# 📁 Project Structure

```
issue-tracker/
├── Backend/                  # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                 # React Frontend
│   ├── src/
│   └── package.json
│
└── README.md
```

---

# ▶️ Run Project Locally

## 🔹 Backend

```bash
cd Backend
mvn spring-boot:run
```

Runs on:
👉 http://localhost:9090

---

## 🔹 Frontend

```bash
cd frontend
npm install
npm start
```

Runs on:
👉 http://localhost:3000

---

# 🔑 Default Login

* **Username:** admin
* **Password:** 1234

---

# 📊 Charts Included

* Issues by Status (Open vs Closed)
* Issues by Priority (High / Medium / Low)
* Issues per User
* Issues per Day
* Completion Rate (%)

---

# 💡 Future Enhancements

* Email notifications
* Advanced analytics dashboard
* Role-based permissions (Admin/User) improvements
* WebSocket real-time updates
* Export to Excel / PDF
* Cloud deployment (AWS / Vercel / Docker)

---

# 👩‍💻 Author

**Dibyasmita Mohapatra**

---

# ⭐ Support

If you like this project:

⭐ Star this repository
📢 Share with others
