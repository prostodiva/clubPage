import  Home from '../components/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
    console.log('HomePage rendering');
    return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Home />
                </main>
                <Footer />
            </div>
    );
};

export default HomePage;