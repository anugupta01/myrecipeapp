import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sideBar.css";

const Sidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    email: "",
    foodInterest: "",
  });
  const userData = localStorage.getItem("user");
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const [email, password] = userData.split(" ");
      const response = axios.get(`http://localhost:3030/users?email=${email}`)
        .then((res) => {
          const userArray = res.data;
          if (userArray.length > 0) {
            setUsers(userArray[0]);
          }
        })
        .catch((error) => {
          alert("Error fetching user:", error);
        });
    };
    fetchUser();
  }, []);

  useEffect(() => {}, [users]);

  return (
    <div>
      <span className="sidebar-toggle" onClick={toggleSidebar}>
        &#9776;
        {isOpen ? "" : ""}
      </span>
      {users && (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <p><strong>First Name:</strong> {users.firstName}</p>
          <p><strong>Last Name:</strong> {users.lastName}</p>
          <p><strong>Email:</strong> {users.email}</p>
          <p><strong>Email:</strong> {users.foodInterest}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
