import {Link} from 'react-router'


function Header() {
    return (
        <header>
            <nav>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/find_doctor">Find a Doctor</Link>
                    <Link to="/myAppointments">My Appointments</Link>
                    <Link to="/about">About Us</Link>
                    {/* <Link to="/contact">Contact</Link> */}
                </div>
                <div>
                   
                    <Link to="/admin">Admin Dashboard</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;