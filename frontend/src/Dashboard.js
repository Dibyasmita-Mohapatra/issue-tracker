import React, { useState } from "react";
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

  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ CREATE
  const createIssue = async () => {
    await fetch("http://localhost:9090/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        title,
        description,
        priority: "HIGH",
        status: "OPEN",
        assignedTo
      })
    }
    );
    toast.success("Issue Created");

    setTitle("");
    setDescription("");
    setAssignedTo("");

    loadIssues(); // auto refresh
  };

  // ✅ LOAD
  const loadIssues = async () => {
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
  };

  // ✅ DELETE
  const deleteIssue = async (id) => {
    await fetch(`http://localhost:9090/issues/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });

    toast.success("Issue Deleted");

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

    setEditId(null);
    loadIssues();
  };

  // ✅ FILTER + SEARCH LOGIC
  const filteredIssues = issues
    .filter(i => filterStatus === "ALL" || i.status === filterStatus)
    .filter(i => filterPriority === "ALL" || i.priority === filterPriority)
    .filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );

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
    <div className="bg-light min-vh-100">

      <Navbar />

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

          <input
            className="form-control mb-3 shadow-sm"
            placeholder="Assign To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <button className="btn btn-primary rounded-pill" onClick={createIssue}>
            ➕ Create Issue
          </button>
        </div>

        <button className="btn btn-success mb-3 rounded-pill shadow-sm" onClick={loadIssues}>
          🔄 Load Issues
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.map((issue) => (
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
                      <span className="badge bg-danger px-3 py-2">
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

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;