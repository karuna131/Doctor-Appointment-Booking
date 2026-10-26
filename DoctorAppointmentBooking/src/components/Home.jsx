import {useNavigate} from 'react-router'


function Home(){
    const navigate = useNavigate();

    function handleHome(){
        navigate('/find_doctor')
    }
    return (
        <>
        <main>
            <h1>Book Your Doctor Appointment Online.</h1>
            <p>A Healthier Tomorrow starts Today: Schedule your Appointment! Your Wellness, Our Expertise: Set Up Your Appointment Today.</p>
            <button onClick={handleHome}>Book An Appointment</button>
        </main>
        </>
    )
}


export default Home;