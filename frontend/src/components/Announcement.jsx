import "../styles/announcement.css"
import { Card } from "./ui/card"
import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.6.2/+esm";

const announcements = [
    {
        id: 1,
        title: "Announcement",
        date: Date,
        content: "the content example/the content example/the content example/the content example",
        priority: "high"
    },
];

const handleAnnouncementHover  = (isHovering) => {
    if (isHovering) {
        animate(".Stay-updated", {
            translateX: [0, 10, -10, 10, -10, 0],
            duration: 0.5,
            ease: "easeInOut"
        });
    } else {
        animate(".shake", {
            translateX: 0,
            duration: 0.3,
        })
    }
};

const handleClick = () => {
    //need to redirect to the announcement card
};

const Announcement = () => {
    try {
        console.log("Announcement component rendered");
        return (
            <section className="announcement-section">
                <div>
                    <p className="Stay-updated"
                        onMouseEnter={() => {handleAnnouncementHover(true)}}
                        onMouseLeave={() => {handleAnnouncementHover(false)}}
                        onClick={handleClick}
                    >
                    Stay updated with our latest news</p>
                </div>
                <div className="announcement">
                    {announcements.map((announcement) => (
                        <Card
                            key={announcement.id}
                            className="card-announcement"
                        >
                            <div className="announcement-content">
                                <h3>
                                    {announcement.title}
                                </h3>
                                <span>
                                {announcement.date}
                            </span>
                            </div>
                            <p>
                                {announcement.content}
                            </p>
                        </Card>
                    ))}
                </div>


            </section>
        )
    } catch (error) {
        console.log("error in announcement component", error);
        throw error;
    }
};

export default Announcement;