import {useQuery} from '@tanstack/react-query';
import '../doctorCard.css'
import {useState } from 'react';
import {useNavigate} from 'react-router';

async function fetchData(){
    const response = await fetch('http://localhost:3000/doctorsInfo')
    if(!response.ok){
        throw new Error('Data not found');
    }
    const data = await response.json()
    return data;
}

function DoctorCards(){
    const [userSearch, setUserSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const navigate = useNavigate();

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['doctors'],
        queryFn : fetchData
    })


    if(isPending) return <h1>...Loading</h1>
    if(isError) return <h1>{error.message}</h1>


    const filterData = data.filter((ele)=>{
        const matchesSearch = ele.name.toLowerCase().includes(userSearch.toLowerCase());
        const matchesSpecialization = specialization === '' || ele.specialization === specialization;

        return matchesSearch && matchesSpecialization;
    })


    function handleViewDetails(id){
        navigate(`/doctorDetailsPage/${id}`)
    }

    return(
        <>
        <div className='searchSection'>
            <input type='text' placeholder='Search by doctor name' value={userSearch} onChange={(e)=>setUserSearch(e.target.value)} />
            <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                <option value="">Select Specializations</option>
                {
                    data.map((ele, index) => (
                        <option key={index} value={ele.specialization}>{ele.specialization}</option>
                    ))
                }
            </select>
        </div>
        <div className="doctorGrid">
            {   
                filterData.map((ele)=>(
                    <div key={ele.id} className='doctorCard'>
                        <img className='doctorImage' src={ele.profileImage} alt='Doctor Image'/>
                        <h1>{ele.name}</h1>
                        <h2>Specialization - {ele.specialization}</h2>
                        <p>{ele.experience} years experience</p>
                        <p>⭐️{ele.rating}</p>
                        <p>Consultation Fee - {ele.consultationFee}</p>
                        <button onClick={() => handleViewDetails(ele.id)} style={{marginRight:"5px"}}>View Details</button>
                        {/* <button>Book Now</button> */}
                    </div>
                ))
            }
        </div>
        </>
    )
}


export default DoctorCards;