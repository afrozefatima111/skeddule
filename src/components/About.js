import React, { useEffect } from "react";
import Image from './clock.jpg'
import { useNavigate } from "react-router-dom";

function About() {

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {
            navigate("/about");
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
        // justifyContent: "center",

    }

    return (
        <div style={backgroundStyle}>
            <div className="row" style={{ marginRight: "0", marginLeft: "40px" }}>
                <div className="col-lg-6 p-5 ">
                    <h1 className=" mb-3 ">Beyond Clocks and Calenders</h1>
                    <p>A schedule or a timetable, as a basic time-management tool, consists of a list of times at which possible tasks, events, or actions are intended to take place, or of a sequence of events in the chronological order in which such things are intended to take place. The process of creating a schedule — deciding how to order these tasks and how to commit resources between the variety of possible tasks — is called scheduling, and a person responsible for making a particular schedule may be called a scheduler. Making and following schedules is an ancient human activity.
                        The process of creating a schedule — deciding how to order these tasks and how to commit resources between the variety of possible tasks — is called scheduling, and a person responsible for making a particular schedule may be called a scheduler. Making and following schedules is an ancient human activity.
                    </p>
                </div>
                {/* <div className="col-lg-6 ">
                    <img src={Image} alt="clock" className="mx-3" width="85%" />
                </div> */}
            </div>
        </div>
    )
};

export default About;