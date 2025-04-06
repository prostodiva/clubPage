import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.6.2/+esm";
import homeImage from '../static/images/background3.jpg';
import '../styles/home.css';

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
    const handleJoinClick = () => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSf2ixtflO5nFqhLUgOVfIwnnEEowW79q8QctsWTpGUHRwECCg/viewform?usp=header', '_blank', 'noopener,noreferrer');
    };

    try {
        console.log('Home component rendering');
        return (
            <section
                className="hero-section"
                style={{
                    minHeight: "calc(95vh - 64px)",
                    backgroundImage: `url(${homeImage})`,
                    backgroundSize: "60%",
                    backgroundColor: "black",
                    backgroundPosition: "53% 45%",
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
                            onClick={handleJoinClick}
                            className="hero-button"
                            onMouseEnter={() => handleJoinHoover(true)}
                            style={{ cursor: "pointer" }}
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error in Home component:', error);
        return null;
    }
};

export default Home;