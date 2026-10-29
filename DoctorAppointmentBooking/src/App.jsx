import { Routes, Route } from 'react-router';
import DoctorCards from './components/DoctorCard';
import DoctorDetails from './components/DoctorDetails'
import Booking from './components/Booking'
import Home from './components/Home'
import MainLayout from './components/MainLayout';
import About from './components/About';
import Contact from './components/ContactUs'
import Appointments from "./components/AppointmentDashboard";
import Reschedule from './components/Reschedule';
import AdminPanel from './components/AdminPanel';
import './App.css'

function App(){
    return (
        <>
        <Routes>
            <Route path='/' element={<MainLayout />}>
                <Route index element={<Home />}/>
                <Route path='/find_doctor' element={<DoctorCards />}/>
                <Route path='/doctorDetailsPage/:id' element={<DoctorDetails />}/> 
                <Route path='/booking/:id' element={<Booking />} />
                <Route path="/myAppointments" element={<Appointments />}/>
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/reschedule/:id' element={<Reschedule />} />
                <Route path="/admin" element={<AdminPanel />}/>
            </Route>
        </Routes>
        </>
    )
}


export default App;