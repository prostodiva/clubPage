import  Home from '../components/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Announcement from '../components/Announcement';

const HomePage = () => {
    console.log('HomePage rendering');
    return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Home />
                    <Announcement />
                </main>
                <Footer />
            </div>
    );
};

export default HomePage;