import { Link } from "react-router-dom";
import '../styles/header.css';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../components/ui/navigation-menu.jsx"

const Header = () => {

    return (
        <header className="header">
            <div className="header-container">
                <NavigationMenu className="nav-menu">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link to="/">
                                <NavigationMenuLink className="nav-link font-bold">
                                    GCC CS Club
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="nav-link-about">ABOUT</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="dropdown-content">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link to="/mission" className="dropdown-link">
                                                Our Mission
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link to="/team" className="dropdown-link">
                                                Our Team
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link to="/members" className="dropdown-link">
                                                Members
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/events">
                                <NavigationMenuLink className="nav-link">EVENTS</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/Meetings">
                                <NavigationMenuLink className="nav-link">MEETINGS</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/join">
                                <NavigationMenuLink className="nav-link">JOIN</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    )
}

export default Header