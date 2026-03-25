import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {

    const response = await fetch("http://localhost:9090/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const token = await response.text();

    localStorage.setItem("token", token);

    alert("Login Successful");
    navigate("/dashboard");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card p-4 shadow" style={{ width: "350px" }}>

        <h3 className="text-center mb-3">Login</h3>

        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={login}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;