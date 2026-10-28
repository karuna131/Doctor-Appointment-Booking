import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import '../reschedule.css'

async function updateData({ id, updatedData }) {
    const response = await fetch(`http://localhost:3000/BookingData/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedData)
        }
    )
    if (!response.ok) {
        throw new Error("Failed to reschedule appointment");
    }
    return response.json();
}


async function getDoctorData(id){
    const response = await fetch(`http://localhost:3000/doctorsInfo/${id}`)
    if(!response.ok){
        throw new Error('Data not found');
    }
    return response.json();
}


function Reschedule() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const location = useLocation();
    const appointment = location.state?.appointment;
    console.log('Appointment', appointment)


    const [date, setDate] = useState(appointment?.appointmentDate || "");
    const [slot, setSlot] = useState(appointment?.timeSlot || "");


    const {data: doctorData, isPending, isError, error} = useQuery({
        queryKey: ['doctorData', appointment?.doctorId],
        queryFn: () => getDoctorData(appointment.doctorId)
    })


    const mutation = useMutation({
        mutationFn: updateData,
        onSuccess: () => {
            alert("Appointment rescheduled successfully");
            queryClient.invalidateQueries({ queryKey: ["appointmentData"]});
            navigate("/myAppointments");
        }
    });

    if(isPending) return <h1>...Loading</h1>
    if(isError) return <h1>{error.message}</h1>


    function handleSubmit(e) {
        e.preventDefault();

        const updatedData = {
            appointmentDate: date,
            appointmentDay: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
            timeSlot: slot
        };

        mutation.mutate({
            id: appointment.id,
            updatedData
        });
    }


    return (
        <>
         <div className="reschedule-container">
            <h1>Reschedule Appointment</h1>
            <h2>{appointment.doctorName}</h2>
            <p>{appointment.specialization}</p>

            <form onSubmit={handleSubmit}>
                <label>Select New Date</label>
                <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />


                <label>Select New Time</label>
                <select name="timeSlot" value={slot} onChange={(e)=>setSlot(e.target.value)}>
                    <option value="">Select a slot</option>
                    {
                        doctorData.slots.map((ele, index)=>(
                            (ele.available == true) ? 
                            <option key={index} value={ele.time} style={{color: "green"}}>{ele.time}</option> :
                            <option key={index} value={ele.time} disabled>{ele.time}</option>
                        ))
                    }
                </select>

                <button type="submit">Reschedule</button>
            </form>

        </div>
        </>
    );
}

export default Reschedule;