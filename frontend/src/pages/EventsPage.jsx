import Header from "../components/Header";
import Footer from "../components/Footer";
import Events from "../components/Events";
import "../styles/events.css"

const EventsPage = () => {
    return (
        <div className="events">
            <Header />
                <main className="events-section">
                    <Events />
                </main>
            <Footer />
        </div>
    );
}

export default EventsPage;