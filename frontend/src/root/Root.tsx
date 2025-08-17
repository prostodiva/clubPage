import Header from "../components/Header.tsx";
import Footer from "../components/Footer";
import { Outlet } from 'react-router-dom';

function Root() {
    return(
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Root;