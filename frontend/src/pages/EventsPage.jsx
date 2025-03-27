import Header from "../components/Header";
import Footer from "../components/Footer";
import Events from "../components/Events";

const EventsPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
                <main className="flex-grow">
                    <Events />
                </main>
            <Footer />
        </div>
    );
}

export default EventsPage;