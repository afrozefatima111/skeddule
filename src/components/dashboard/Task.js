import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Task() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [task, setTask] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/login");
    }

    async function getTasks() {
        const token = localStorage.getItem('token');
        const url = `http://localhost:5000/api/task/${id}`;
        const fetchOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token" : token
          },
          credentials: "include",
        };
        const response = await fetch(url, fetchOptions);
        if (response.ok) {
          const data = await response.json();
          setTask(data.data);
        } else {
          console.log("Error fetching deck");
        }
      }
      getTasks();
  }, [id, navigate]);

  return (
    <>
       <div className="container">
            <h1>{task.taskName}</h1>
       </div>
    </>
  );
}

export default Task;