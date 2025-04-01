import '../styles/home.css';
import homeImage from '../static/images/background3.jpg';
import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.6.2/+esm";

const handleJoinHoover = (isHovering) => {
    if (isHovering) {
        animate(".hero-button", {
            scale: [1, 1.5, 1],
            duration: 1,
            ease: "elastic"
        });
    } else {
        animate(".bounce", {
            scale: 0
        })
    }
};

const Home = () => {
    try {
        console.log('Home component rendering');
        return (
            <section
                className="hero-section"
                style={{
                    minHeight: "calc(95vh - 64px)",
                    backgroundImage: `url(${homeImage})`,
                    backgroundSize: "50%",
                    backgroundColor: "black",
                    backgroundPosition: "53% bottom",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    width: "100%",
                }}
            >
                <div>
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
                        <button
                            className="hero-button"
                            onMouseEnter={() => handleJoinHoover (true)}
                            style={{ cursor: "pointer" }}
                        >
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