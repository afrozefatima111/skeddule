import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {
      navigate("/dashboard");
    }

  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState('')

  const {
    email,
    password
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    const url = `http://localhost:5000/api/user/login`;
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email, 
        password
      })
    };

    try {
      const response = await fetch(url, fetchOptions);
      if (response.ok) {
        const data = await response.json();
        const token = data.data.token;
        const username = data.data.name;
        const userId = data.data.id;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('id', userId);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.data.error);
      }
    } catch (error) {
      console.log(error);
    }
    
}

  return (
    <div className="pt-5 mt-4">
      <form className="w-25 mx-auto my-5 bg-dark p-5" onSubmit = { e=> onSubmit(e) }>
      <h3 className="text-light"><u>Login Form</u></h3>
        <div className="mb-3 text-light">
          <label htmlFor="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" name="email" required onChange = {e=>onChange(e)} id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div className="text-light">
          <label htmlFor="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" name="password" required onChange = {e=>onChange(e)} id="exampleInputPassword1" />
        </div>
        {error && (
              <div className="text-danger" role="alert">
                {error}
              </div>
            )}
        <button type="submit" class="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  )
}

export default Login;