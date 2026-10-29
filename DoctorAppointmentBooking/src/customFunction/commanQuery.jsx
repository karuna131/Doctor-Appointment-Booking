import { useQuery } from "@tanstack/react-query";

async function getAppointments() {
    const response = await fetch("http://localhost:3000/BookingData");
    if (!response.ok) {
        throw new Error("Not able to fetch appointments data");
    }
    return response.json();
}

function useGetAppointmentData(){
    const query = useQuery({
        queryKey: ["appointmentData"],
        queryFn: getAppointments
    });

    return query;
}

export default useGetAppointmentData;