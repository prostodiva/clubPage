import  Home from '../components/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
    console.log('LandingPage rendering'); // Debug log
    return (
            <div>
                <Header />
                <main>
                    <Home />
                </main>
                <Footer />
            </div>
    );
};

export default HomePage;