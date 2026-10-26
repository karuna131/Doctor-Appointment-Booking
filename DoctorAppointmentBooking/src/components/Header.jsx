import {Link} from 'react-router'


function Header() {
    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/find_doctor">Find a Doctor</Link>
                <Link to="/myAppointments">Appointment Dashboard</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
            </nav>
        </header>
    );
}

export default Header;