import "../styles/home.css"

const Announcement = () => {
    try {
        console.log("Announcement component rendered");
        return (
            <section className="announcement-section">
                <div>
                    <h1>Announcement section</h1>
                </div>
            </section>
        )
    } catch (error) {
        console.log("error in announcement component", error);
        throw error;
    }
};

export default Announcement;