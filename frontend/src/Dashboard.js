import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [file, setFile] = useState(null);

  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [logs, setLogs] = useState([]);

  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;

  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleFile = (e) => {
      setFile(e.target.files[0]);
  };

  const openComments = (id) => {
    setSelectedIssueId(id);
  };

  // ✅ CREATE
  const createIssue = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", "HIGH");
    formData.append("status", "OPEN");
    formData.append("assignedTo", assignedTo);

    if (file) {
      formData.append("file", file);
    }

    await fetch("http://localhost:9090/issues", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    toast.success("Issue Created");
    setLogs(prev => [...prev, "Created new issue: " + title]);

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setFile(null);

    loadIssues();
  };

  // ✅ LOAD
  const loadIssues = useCallback(async () => {
    setLoading(true);

    const res = await fetch("http://localhost:9090/issues", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (Array.isArray(data)) setIssues(data);
    else if (Array.isArray(data.data)) setIssues(data.data);
    else if (Array.isArray(data.content)) setIssues(data.content);
    else setIssues([]);

    setLoading(false);
  }, [token]);

  useEffect(() => {
      loadIssues();

      const interval = setInterval(() => {
        loadIssues();
      }, 10000);

      return () => clearInterval(interval);
    }, [loadIssues]);

  // ✅ DELETE
  const deleteIssue = async (id) => {
    await fetch(`http://localhost:9090/issues/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });

    toast.success("Issue Deleted");
    setLogs(prev => [...prev, "Deleted issue ID: " + id]);

    loadIssues();
  };

  // ✅ EDIT (inline)
  const updateIssue = async (issue) => {
    await fetch(`http://localhost:9090/issues/${issue.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(issue)
    });

    toast.success("Issue Updated");
    setLogs(prev => [...prev, "Updated issue ID: " + issue.id]);

    setEditId(null);
    loadIssues();
  };

  const exportCSV = () => {
    const headers = ["ID", "Title", "Status", "Priority"];

    const rows = issues.map(i =>
      [i.id, i.title, i.status, i.priority].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "issues.csv";
    link.click();
  };

  // ✅ FILTER + SEARCH LOGIC
  const filteredIssues = issues
    .filter(i => filterStatus === "ALL" || i.status === filterStatus)
    .filter(i => filterPriority === "ALL" || i.priority === filterPriority)
    .filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * issuesPerPage;
    const indexOfFirst = indexOfLast - issuesPerPage;

    const currentIssues = filteredIssues.slice(indexOfFirst, indexOfLast);

    // 📊 STATUS DATA
    const statusData = {
      labels: ["OPEN", "CLOSED"],
      datasets: [
        {
          label: "Issues",
          data: [
            issues.filter(i => i.status === "OPEN").length,
            issues.filter(i => i.status === "CLOSED").length
          ],
          backgroundColor: [
                  "rgba(40,167,69,0.8)",   // green
                  "rgba(220,53,69,0.8)"    // red
          ],
          borderRadius: 10
        }
      ]
    };

    // 📊 PRIORITY DATA
    const priorityData = {
      labels: ["HIGH", "MEDIUM", "LOW"],
      datasets: [
        {
          label: "Priority",
          data: [
            issues.filter(i => i.priority === "HIGH").length,
            issues.filter(i => i.priority === "MEDIUM").length,
            issues.filter(i => i.priority === "LOW").length
          ],
          backgroundColor: [
                  "rgba(220,53,69,0.8)",
                  "rgba(255,193,7,0.8)",
                  "rgba(108,117,125,0.8)"
          ],
          borderRadius: 8
        }
      ]
    };

    const userDataMap = {};

    issues.forEach(i => {
      const user = i.assignedTo || "Unassigned";
      userDataMap[user] = (userDataMap[user] || 0) + 1;
    });

    const issuesPerUserData = {
      labels: Object.keys(userDataMap),
      datasets: [
        {
          label: "Issues per User",
          data: Object.values(userDataMap),
          backgroundColor: "rgba(54, 162, 235, 0.7)"
        }
      ]
    };

    const dateMap = {};

    issues.forEach(i => {
      if (i.createdAt) {
        const date = new Date(i.createdAt).toLocaleDateString();
        dateMap[date] = (dateMap[date] || 0) + 1;
      }
    });

    const issuesPerDayData = {
      labels: Object.keys(dateMap),
      datasets: [
        {
          label: "Issues per Day",
          data: Object.values(dateMap),
          backgroundColor: "rgba(255, 99, 132, 0.7)"
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      animation: {
        duration: 1500,
        easing: "easeInOutQuart"
      }
    };

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light min-vh-100"}>

      <Navbar />

      <div className="container py-2">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="container py-4">

        {/* 🌟 STATS */}
        <div className="row mb-4">

          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-primary text-white">
              <h6>Total Issues</h6>
              <h2>{issues.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-success text-white">
              <h6>Open Issues</h6>
              <h2>{issues.filter(i => i.status === "OPEN").length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-danger text-white">
              <h6>Closed Issues</h6>
              <h2>{issues.filter(i => i.status === "CLOSED").length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-dark text-white">
              <h6>Completion Rate</h6>
              <h2>
                {issues.length === 0
                  ? "0%"
                  : Math.round(
                      (issues.filter(i => i.status === "CLOSED").length / issues.length) * 100
                    ) + "%"}
              </h2>
            </div>
          </div>

        </div>

        <div className="row mb-4">

          {/* HIGH PRIORITY */}
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-warning text-dark">
              <h6>High Priority Issues</h6>
              <h2>{issues.filter(i => i.priority === "HIGH").length}</h2>
            </div>
          </div>

          {/* MEDIUM PRIORITY */}
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-info text-white">
              <h6>Medium Priority</h6>
              <h2>{issues.filter(i => i.priority === "MEDIUM").length}</h2>
            </div>
          </div>

          {/* ASSIGNED */}
          <div className="col-md-4">
            <div className="p-4 rounded-4 shadow bg-secondary text-white">
              <h6>Assigned Issues</h6>
              <h2>{issues.filter(i => i.assignedTo).length}</h2>
            </div>
          </div>

        </div>

        <div className="row mb-4">

          <div className="col-md-6">
            <div className="card shadow p-3 border-0">
              <h5 className="text-center mb-3">Issues by Status</h5>
              <Pie data={statusData} options={chartOptions} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow p-3 border-0">
              <h5 className="text-center mb-3">Issues by Priority</h5>
              <Bar data={priorityData} options={chartOptions} />
            </div>
          </div>

        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card shadow p-3 border-0">
              <h5 className="text-center mb-3">Issues per User</h5>
              <Bar data={issuesPerUserData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card shadow p-3 border-0">
              <h5 className="text-center mb-3">Issues per Day</h5>
              <Bar data={issuesPerDayData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* 🔍 SEARCH */}
        <input
          className="form-control mb-3 rounded-pill shadow-sm"
          placeholder="🔍 Search issues..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🎛 FILTERS */}
        <div className="row mb-3">
          <div className="col-md-6">
            <select className="form-select rounded-pill shadow-sm"
              onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="col-md-6">
            <select className="form-select rounded-pill shadow-sm"
              onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="ALL">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* ✨ CREATE ISSUE */}
        <div className="card border-0 shadow rounded-4 p-4 mb-4">
          <h5 className="mb-3">Create Issue</h5>

          <input
            className="form-control mb-2 shadow-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="form-control mb-2 shadow-sm"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {role === "ADMIN" && (
            <input
              className="form-control mb-3 shadow-sm"
              placeholder="Assign To"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          )}

          <input
            type="file"
            className="form-control mb-3 shadow-sm"
            onChange={handleFile}
          />


          <button className="btn btn-primary rounded-pill" onClick={createIssue}>
            ➕ Create Issue
          </button>
        </div>

        <button className="btn btn-success mb-3 rounded-pill shadow-sm" onClick={loadIssues}>
          🔄 Load Issues
        </button>

        <button
          className="btn btn-dark mb-3 ms-2 rounded-pill shadow-sm"
          onClick={exportCSV}
        >
          ⬇ Export CSV
        </button>

        {/* ⏳ LOADING */}
        {loading && <p className="text-center">Loading...</p>}

        {/* 📭 EMPTY */}
        {!loading && filteredIssues.length === 0 && (
          <p className="text-center text-muted">No issues found</p>
        )}

        {/* 💎 TABLE */}
        {!loading && filteredIssues.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover bg-white shadow rounded-4 overflow-hidden">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Assigned</th>
                  <th>Attachment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentIssues.map((issue) => (
                  <tr key={issue.id}>

                    <td>{issue.id}</td>
                    <td>
                      {editId === issue.id ? (
                        <input
                          value={issue.title}
                          onChange={(e) =>
                            setIssues(prev =>
                              prev.map(i =>
                                i.id === issue.id
                                  ? { ...i, title: e.target.value }
                                  : i
                              )
                            )
                          }
                        />
                      ) : (
                        issue.title
                      )}
                    </td>
                    <td>{issue.description}</td>

                    <td>
                      <span className={`badge px-3 py-2 ${
                        issue.priority === "HIGH"
                          ? "bg-danger"
                          : issue.priority === "MEDIUM"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}>
                        {issue.priority}
                      </span>
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={issue.status}
                        onChange={(e) =>
                          updateIssue({
                            ...issue,
                            status: e.target.value
                          })
                        }
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>

                    <td>
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>{issue.assignedTo || "Unassigned"}</td>

                    <td>
                      {issue.fileUrl ? (
                        <a href={issue.fileUrl} target="_blank" rel="noreferrer">
                          📎 View
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>

                    <td>

                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => openComments(issue.id)}
                      >
                        💬
                      </button>

                      {editId === issue.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => updateIssue(issue)}
                          >
                            Save
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => setEditId(issue.id)}
                          >
                            ✏️
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteIssue(issue.id)}
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </td>

                    <td>
                      { (role === "ADMIN" || issue.assignedTo === username) && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => setEditId(issue.id)}
                        >
                          ✏️
                        </button>
                      )}

                      {role === "ADMIN" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteIssue(issue.id)}
                        >
                          🗑
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-secondary"
            disabled={indexOfLast >= filteredIssues.length}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>

        {selectedIssueId && (
          <div className="card shadow p-4 position-fixed top-50 start-50 translate-middle bg-white" style={{ width: "400px", zIndex: 1000 }}>

            <h5>Comments (Issue ID: {selectedIssueId})</h5>

            {/* Comment Input */}
            <input
              className="form-control mb-2"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <button className="btn btn-primary mb-2">
              Add Comment
            </button>

            {/* Close */}
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedIssueId(null)}
            >
              Close
            </button>

          </div>
        )}

        <div className="card p-3 mt-4 shadow">
          <h5>Activity Logs</h5>

          {logs.length === 0 ? (
            <p>No activity yet</p>
          ) : (
            logs.map((log, index) => (
              <p key={index}>• {log}</p>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
