import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">GCC CS Club</h3>
                        <p className="text-gray-400">
                            Building the next generation of software developers
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-400 hover:text-white">
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-gray-400">
                            Email: csclub@gcc.edu<br />
                            Location: 1500 N Verdugo Rd, Glendale, CA, 91208
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;