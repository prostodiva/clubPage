import { Link } from 'react-router-dom';

function Header() {

    return(
        <div>
            <h1>header</h1>
            <Link to='/'>LOGO</Link>
        </div>
    );
}

export default Header;