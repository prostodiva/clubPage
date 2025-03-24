import '../styles/home.css';
const Home = () => {
    try {
        console.log('Home component rendering');
        return (
            <section className="hero" style={{ minHeight: '400px' }}>
                <div className="hero-gradient">
                    <div className="hero-content">
                        <h1 className="text-4xl font-bold mb-6">
                            Welcome to
                        </h1>
                        <h1 className="text-5xl font-bold mb-6">
                            Computer Science Club
                        </h1>
                        <p className="text-xl mb-8">
                            Empowering GCC students in computer science
                        </p>
                        <button className="hero-button">
                            Join Now
                        </button>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error in Hero component:', error);
        throw error;
    }
};

export default Home;