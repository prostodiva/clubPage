import React from "react";
import "../styles/home.css"
import missionImage from "/src/static/images/mission.jpg"

const pic = [
    {
        image: missionImage,
        title: "mission"
    }
]

const Mission = () => {
    return (
        <section className="mission">
            <div>
                <h1 className="mission-title">MISSION</h1>
            </div>
            <div>
                <p className="mission-paragraph">
                    This is a club for people who are interested in joining GCC's
                    Computer Science community. Our main goal is to create an environment for
                    CS majors as well as people who want to gain experience in this field to
                    find connections and friends who can potentially help each other in
                    creating projects, getting internships, and exchanging knowledge.
                </p>
            </div>
            <div className="mission-photo">
                {pic.map((event) => (
                    <img src={event.image || "/placeholder.svg"} alt={event.title} className="mission-pic"/>
                ))}
            </div>
        </section>
    )
};

export default Mission;