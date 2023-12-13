import React, { useEffect } from "react";
import Image from './clock.jpg';
import { useNavigate } from "react-router-dom";
function Landing() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/");
    }

  }, []);
  const backgroundStyle = {
    backgroundImage: `url(${Image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "85vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  }
  return (
    <div style={backgroundStyle}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', }}>
        <h1 className="text-dark " style={{ fontSize: "3em" }}>
          Welcome to <span className="bg-dark text-light p-1">Skeddual</span>
        </h1>
        <h5>Your task companion</h5>
      </div>


    </div>
  )
};
export default Landing;

