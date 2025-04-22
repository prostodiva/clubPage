import Footer from '../components/Footer';
import Header from '../components/Header';
import Members from '../components/Members';

const MembersPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Members />
            </main>
            <Footer />
        </div>
    );
};

export default MembersPage;

