import  Home from '../components/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
    console.log('LandingPage rendering'); // Debug log
    return (
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow bg-white">
                    <Home />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    </div>
                </main>
                <Footer />
            </div>
    );
};

export default HomePage;