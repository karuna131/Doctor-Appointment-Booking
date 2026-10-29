import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import "../AdminPanel.css";
import useGetAppointmentData from '../customFunction/commanQuery'


async function updateAppointment({id, status}) {
    const response = await fetch(`http://localhost:3000/BookingData/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status})
    });
    if (!response.ok) {
        throw new Error("Failed to update status");
    }
    return response.json();
}


function AdminPanel() {
    const queryClient = useQueryClient();

    const {data: appointments, isPending, isError, error} = useGetAppointmentData();


    const mutation = useMutation({
        mutationFn: updateAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["appointmentData"]});
        }
    });


    function changeStatus(id, status) {
        mutation.mutate({id, status});
    }

    if(isPending) return <h1>...Loading</h1>
    if(isError) return <h1>{error.message}</h1>


    return (
       <>
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <section className="admin-section">
                <h2>Appointments</h2>

                {appointments.length === 0 ? ( <p>No appointments available.</p>) 
                : (
                    appointments.map((appointment) => (
                        <div key={appointment.id} className="admin-appointment">
                            <div>
                                <h3>{appointment.doctorName}</h3>
                                <p>Patient: {appointment.patientDetails.patientName}</p>
                                <p>Date: {appointment.appointmentDate}</p>
                                <p>Time: {appointment.timeSlot}</p>
                                <p>Status: {(appointment.status == "Confirmed") ? (
                                    <span style={{color:"green"}}><b>{appointment.status}</b></span>
                                ) : (appointment.status == "Completed") ? (
                                    <span style={{color:"Blue"}}><b>{appointment.status}</b></span>
                                ) : (
                                    <span style={{color:"red"}}><b>{appointment.status}</b></span>)}</p>
                            </div>

                            <div className="appointment-actions">
                                <button disabled={mutation.isPending} onClick={() => changeStatus(appointment.id, "Completed")}>
                                    Completed
                                </button>

                                <button disabled={mutation.isPending} onClick={()=>changeStatus(appointment.id, "Cancelled")}>
                                    Cancelled
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
       </>
    );
}

export default AdminPanel;
