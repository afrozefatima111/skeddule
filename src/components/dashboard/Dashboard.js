import React, { useEffect, useRef, useState } from "react";
import Form from 'bootstrap';
import { useNavigate } from "react-router-dom";
import $, { data } from "jquery";
import 'datatables.net';
import 'datatables.net-bs4';
function Dashboard() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/login");
    }

  }, []);

  const [tasks, setTasks] = new useState([]);
  const [successMessage, setSuccessMessage] = new useState([]);
  const [errorMessage, setErrorMessage] = new useState([]);

  useEffect(() => {
    const cleanupMessages = setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 2000);

    return () => clearTimeout(cleanupMessages);

  }, [errorMessage, successMessage]);

  const [showUpdateBtn, setShowUpdateButton] = new useState(false);

  const [taskData, setTaskData] = useState({
    task: "",
    taskDescription: "",
    dueDate: new Date(),
    priority: null,
    id: null,
    status: ""
  });

  const dataTableRef = useRef(null);

  function formatDate(date) {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = `0${dateObject.getMonth() + 1}`.slice(-2);
    const day = `0${dateObject.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  }

  async function getTasks() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const url = `http://localhost:5000/api/task/all?id=${userId}`;
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      },
      credentials: "include",
    };
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      const data = await response.json();
      setTasks(data.data);
    } else {
      console.log("Error fetching deck");
    }
  }

  useEffect(() => {

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if (!token) {
      navigate("/login");
    }
    getTasks();
  }, []);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#example")) {
      initializeDataTable();
    } else {
      // If DataTable is already initialized, just update the data
      updateDataTable();
    }

    return () => {
      const datatable = dataTableRef.current;
      if (datatable) {
        datatable.destroy();
      }
    };
  }, [tasks]);


  const initializeDataTable = () => {
    let counter = 1;
    const datatable = $("#example").DataTable({
      data: tasks.map(task => {
        task.id = counter++;
        return task;
      }),
      columns: [
        { data: "id" },
        { data: "taskName" },
        { data: "dueDate" },
        { data: "status" },
        { data: "priority" },
        { data: null, defaultContent: "" }, // Action column
      ],
      searching: true,
      ordering: true,
      paging: true,
      lengthMenu: [5, 10, 25, 50],
      pageLength: 5,
      responsive: true,
      columnDefs: [
        {
          targets: 2,
          render: function (data, type, row) {
            return formatDate(data);
          },
        },
        {
          targets: 3,
          render: function (data, type, row) {
            return (
              '<select class="form-control ' +
              (data === 1 ? "btn-primary" : data === 2 ? "btn-info" : "btn-success") +
              '">' +
              '<option value="1" ' +
              (data === 1 ? "selected" : "") +
              '>Todo</option>' +
              '<option value="2" ' +
              (data === 2 ? "selected" : "") +
              '>In Progress</option>' +
              '<option value="3" ' +
              (data === 3 ? "selected" : "") +
              '>Completed</option>' +
              "</select>"
            );
          },
        },
        {
          targets: 4,
          render: function (data, type, row) {
            return data === 1 ? "High" : data === 2 ? "Medium" : "Low";
          },
        },
        {
          targets: 5,
          createdCell: (td, cellData, rowData, row, col) => {
            const showButton = document.createElement('button');
            showButton.type = 'button';
            showButton.className = 'btn btn-sm ml-1 btn-primary';
            showButton.innerHTML = '<i class="fas fa-eye"></i>';

            showButton.addEventListener('click', () => {
              const taskId = rowData._id;
              const newPageUrl = `/dashboard/task/${taskId}`;
              navigate(newPageUrl);
            });

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-sm ml-1 btn-info';
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.addEventListener('click', () => handleEdit(rowData));

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-sm ml-1 btn-danger';
            deleteButton.title = 'Delete';
            deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
            deleteButton.addEventListener('click', () => delBtnClick(rowData._id));

            td.appendChild(showButton);
            td.appendChild(editButton);
            td.appendChild(deleteButton);
          },
        },

      ],
    });

    dataTableRef.current = datatable;
  };

  const updateDataTable = () => {
    const datatable = dataTableRef.current;
    if (datatable) {
      datatable.clear();
      datatable.rows.add(tasks);
      datatable.draw();
    }
  };

  async function delBtnClick(id) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5000/api/task/delete/${id}`;

    const fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      }
    };

    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        setSuccessMessage("Task deleted successfully");
        getTasks();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    if (!showUpdateBtn) {
      const url = `http://localhost:5000/api/task?id=${userId}`;

      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(taskData)
      };

      try {
        const response = await fetch(url, fetchOptions);
        if (response.ok) {
          setTaskData({
            task: "",
            taskDescription: "",
            dueDate: new Date(),
            priority: null,
            id: null,
            status: ""
          });

          setSuccessMessage("Task added successfully");
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const url = `http://localhost:5000/api/task/update/${taskData.id}`;

      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(taskData)
      };

      try {
        const response = await fetch(url, fetchOptions);
        if (response.ok) {
          setTaskData({
            task: "",
            taskDescription: "",
            dueDate: new Date(),
            priority: null,
            id: null,
            status: ""
          });

          setSuccessMessage("Task updated successfully");
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTasks();
  }

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (task) => {
    setShowUpdateButton(true);
    setTaskData({
      task: task.taskName,
      taskDescription: task.taskDescription,
      dueDate: task.dueDate,
      priority: task.priority,
      id: task._id,
      status: task.status
    });
  };


  const dataTable = $('#example').DataTable();

// Event delegation for the onchange event
$('#example').on('change', '.status-select', function () {
  const selectedValue = $(this).val();
  const rowData = dataTable.row($(this).closest('tr')).data();
  const rowId = rowData.yourIdField; // Replace 'yourIdField' with the actual field name

  console.log(`Selected value: ${selectedValue} for row with ID: ${rowId}`);

  // Perform any actions you need based on the selected value and rowId
  // For example, update the data in the DataTable:
  // dataTable.row($(this).closest('tr')).data({ status: selectedValue }).draw();
});

  return (
    <>
      <div className="container mb-5 pb-5">
        <header className="bg-info" >
          <div className="container mb-4">
            <h3 className="text-center text-light pt-2"><u>WELCOME TO SKEDDULE</u></h3>
            <span className="text-center d-block pb-4 text-light tag-line">Your task companion</span>
            <div >
              <form method="post" className="text-light" onSubmit={e => onSubmit(e)}>
                <div className="row pb-2">
                  <div className="col-lg-6 d-flex">
                    <label className="col-sm-3 col-form-label">Title</label>
                    <div className="col-sm-9">
                      <input type="text" name="task" id="task" value={taskData.task} required className="form-control"
                        placeholder="Enter task title" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex">
                    <label className="col-sm-3 col-form-label">Description</label>
                    <div className="col-sm-9">
                      <textarea className="form-control" name="taskDescription" id="taskDescription" required
                        placeholder="Enter task description" rows="2" onChange={handleChange} value={taskData.taskDescription} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 d-flex">
                    <label className="col-sm-3 col-form-label">Due Date</label>
                    <div className="col-sm-9">
                      <input type="date" name="dueDate" id="dueDate" value={formatDate(new Date(taskData.dueDate))} onChange={handleChange} required className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex">
                    <label className="col-sm-3 col-form-label">Priority</label>
                    <div className="col-sm-9">
                      <select className="form-control" onChange={handleChange} id="priority" required name="priority">
                        <option value="">Select</option>
                        <option value="1" selected={taskData.priority === 1}>
                          High
                        </option>
                        <option value="2" selected={taskData.priority === 2}>
                          Medium
                        </option>
                        <option value="3" selected={taskData.priority === 3}>
                          Low
                        </option>

                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 d-flex">
                    <label className="col-sm-3 col-form-label"></label>
                    <div className="col-sm-9">
                      {errorMessage && (
                        <span className="text-white mt-4 pt-4">
                          {errorMessage}
                        </span>
                      )}
                      {successMessage && (
                        <span className="text-white mt-4 pt-4">
                          {successMessage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 text-right">
                    <input className="btn btn-dark m-3" type="submit" value={showUpdateBtn ? "Update Task" : "Add Task"} />
                  </div>

                </div>
              </form>
            </div>
          </div>
        </header >

        <div className="mb-5">
          <table id="example" className="table mb-5">
            <thead className="bg-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Task Name</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div >
    </>
  )
};
export default Dashboard;