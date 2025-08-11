
import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const register = async () => {
    const res = await axios.post("http://localhost:5000/api/register", form);
    console.log(res.data);
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={register} className="btn btn-primary">Register</button>
    </div>
  );
}
