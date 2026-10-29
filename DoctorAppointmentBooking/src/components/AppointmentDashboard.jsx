import {useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import '../Appointments.css'
import { useNavigate } from "react-router";

async function fetchData(){
    const response = await fetch('http://localhost:3000/BookingData');
    if(!response.ok){
        throw new Error('Not able to fetch data');
    }
    return response.json();
}


async function updateData({id, updatedData}){
    const response = await fetch(`http://localhost:3000/BookingData/${id}`, {
        method : 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedData)
    })
    return response.json();
}


function Appointments(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['appointmentData'],
        queryFn: fetchData
    })

    const mutation = useMutation({
        mutationFn : updateData,
        onSuccess : ()=>{
            queryClient.invalidateQueries({queryKey : ['appointmentData']})
        },
        onError : (error) =>{
            alert(error.message);
        }
    })
    
    if(isPending) return <h1>...Loading</h1>
    if(isError) return <h1>{error.message}</h1>


    function handleCancel(ele) {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) return;

        mutation.mutate({
            id: ele.id,
            updatedData: {
                status: "Cancelled"
            }
        })
    }

    function handleReschedule(ele) {
        navigate(`/reschedule/${ele.id}`, {
            state: { appointment: ele }
        });
    }

    return (
        <>
        <div className="appointments-container">
            <h1>Appointments Details</h1>
            {
                data.map((ele)=>(
                    <div key={ele.id} className="appointment-card">
                       <div>
                            <h2>Appointment Id - <span>{ele.id}</span></h2>
                            <h2>{ele.doctorName}</h2>
                            <p>{ele.specialization}</p>
                        </div>
                        <div>
                            <p>Date: {ele.appointmentDate}</p>
                            <p>Day: {ele.appointmentDay}</p>
                            <p>Time: {ele.timeSlot}</p>
                            <p>Patient Name: {ele.patientDetails.patientName}</p>
                        </div>
                        <div>
                            {ele.status === "Confirmed" && new Date(ele.appointmentDate) < new Date() ? (
                                <span style={{ color: "Red" }}>Missed Appointment</span>
                            ) : ele.status === "Confirmed" ? (
                                <>
                                    <span style={{color: "Green", marginLeft:"50px"}}>{ele.status}</span>
                                    <div>
                                        <button onClick={() => handleReschedule(ele)}> Reschedule </button>
                                        <button onClick={() => handleCancel(ele)}> Cancel </button>
                                    </div>
                                </>
                            ) : (
                                <span style={{color: "Red"}}>{ele.status}</span>
                            )}                
                        </div>
                    </div>
                ))
            }
        </div>
        </>
    )
}


export default Appointments;