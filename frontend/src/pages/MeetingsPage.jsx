import Meetings from '../components/Meetings';
import Header from "../components/Header";
import Footer from "../components/Footer";

const MeetingsPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Meetings />
            </main>
            <Footer />
        </div>
    );
}

export default MeetingsPage;