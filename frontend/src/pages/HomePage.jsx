import Home from '../components/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Announcement from '../components/Announcement';
import Mission from "../components/Mission";
import Team from '../components/Team';
import Members from '../components/Members';

const HomePage = () => {
    console.log('HomePage rendering');
    return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Home />
                    <Announcement />
                    <Mission />
                    <Team />
                </main>
                <Footer />
            </div>
    );
};

export default HomePage;