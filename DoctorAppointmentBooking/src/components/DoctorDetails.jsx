import { useEffect, useState } from "react";
import { useParams } from "react-router";
import '../doctorDetails.css'
import {useNavigate} from 'react-router';

function DoctorDetails(){
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const {id} = useParams();
    const navigate = useNavigate();
    
    useEffect(()=>{
        async function fetchData(){
           try {
                const respone = await fetch(`http://localhost:3000/doctorsInfo/${id}`)
                if(!respone.ok){
                    throw new Error('Details Not Found')
                }
                const getData = await respone.json()
                setData(getData)
           } catch (error) {
                setError(error.message)
           }finally{
                setLoading(false);
           }
        }
        fetchData();
    }, [])

    if(isLoading) return <h1>....Loading</h1>
    if(error) return <h1>{error.message}</h1>

    function handleBooking(id){
        navigate(`/booking/${id}`, {
        state: { doctor: data }
        })
    }

    return (
        <>
           <div key={data.id} className="doctor-details">
            <img src={data.profileImage} alt="Doctor Image"/>

            <h1>{data.name}</h1>
            <h2>Specialization: {data.specialization}</h2>

            <p><strong>Experience:</strong> {data.experience} years</p>
            <p><strong>Qualification:</strong> {data.qualification}</p>
            <p><strong>Hospital:</strong> {data.hospital}</p>
            <p><strong>Location:</strong> {data.location}</p>
            <p><strong>Rating:</strong> ⭐ {data.rating}</p>
            <p><strong>Total Reviews:</strong> {data.totalReviews}</p>
            <p><strong>Consultation Fee:</strong> ₹{data.consultationFee}</p>
            <hr />

            <h3>About Doctor</h3>
            <p>{data.about}</p>

            <h3>Languages Spoken</h3>
            <p>{data.languages.join(', ')}</p>

            <h3>Available Timings</h3>
            <p>{data.availableTime.start} - {data.availableTime.end}</p>

            <h3>Services Offered</h3>
            {data.services.map((ele, index) => (
                <p key={index}>{ele}</p>
            ))}
            <button onClick={()=>handleBooking(data.id)}>Book Now</button>
            </div>
        </>
    )
}

export default DoctorDetails;