import Header from "../components/Header.tsx";
import { Outlet } from 'react-router-dom';

function Root() {
    return(
        <div>
            <Header />
            <Outlet />
        </div>
    );
}

export default Root;