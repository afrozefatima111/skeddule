import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {
      navigate("/dashboard");
    }

  }, []);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password not matched.");
      return; 
    }

    if(formData.password.length < 6) {
      setErrorMessage('Password length must be greater than 6 characters.');
      return;
    }

    
    const url = `http://localhost:5000/api/user`;
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    };

    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="pt-2">
        <form className="w-25 mx-auto mt-4 bg-dark p-5" onSubmit={handleSubmit}>
          <h3 className="text-light"><u>Register Form</u></h3>
          <div className="mb-3 text-light">
            <label htmlFor="exampleName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              onChange = {e=>onChange(e)}
            />
          </div>
          <div className="mb-3 text-light">
            <label  className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange = {e=>onChange(e)}
            />
          </div>
          <div className="mb-3 text-light">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange = {e=>onChange(e)}
            />
          </div>
          <div className="mb-3 text-light">
            <label className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              onChange = {e=>onChange(e)}
            />
            {errorMessage && (
              <div className="text-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default Register;
