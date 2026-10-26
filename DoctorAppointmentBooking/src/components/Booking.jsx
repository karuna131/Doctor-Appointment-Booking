import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router";
import '../Booking.css'

async function addData(newData){
    const response = await fetch('http://localhost:3000/BookingData', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newData)
    })
    if (!response.ok) {
        throw new Error("Failed to save booking data");
    }

    return response.json();
}


function Booking(){
    const navigate = useNavigate();
    const [isdate, setDate] = useState('');
    const [day, setDay] = useState('');
    const [slot, setSlot] = useState('')
    const [reviewDetails, setReviewDetails] = useState(false);
    const [bookingConfirmation, setBookingConfirmation] = useState(null);

    const location = useLocation();
    const doctor = location.state?.doctor;

     const [patient, setPatient] = useState({
        patientName: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        reason: ""
    });


    useEffect(()=>{
        const date = new Date(isdate);
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        const dayName = days[date.getDay()];
        setDay(dayName);
        console.log(dayName);
    }, [isdate])

    const mutation = useMutation({
        mutationFn: addData,
        onSuccess: (data) =>{
            console.log("Appointment Booked Successfully")
            console.log("Saved booking:", data);

            setBookingConfirmation(data);
        },
        onError: (error) => {
            alert(error.message);
        }
    })

    function handlePatientInfo(e){
        const { name, value } = e.target;
        setPatient((prev) => ({...prev, [name]: value }))
    }

    function handleReview() {
        setReviewDetails(true);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const bookingDetails = {
            id : crypto.randomUUID(),
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialization: doctor.specialization,
            appointmentDate: isdate,
            appointmentDay: day,
            timeSlot: slot,
            patientDetails: patient,
            status: "Confirmed"
        };

        console.log(bookingDetails);
        mutation.mutate(bookingDetails)
    }

    function handleAnotherBooking(){
        navigate('/find_doctor')
    }


    if (bookingConfirmation) {
        return (
            <>
            <div className="confirmation">
                <h1>Your Appointment is Confirmed</h1>
                <h2>Appointment Details</h2>
                <p>Appointment Id: {bookingConfirmation.id}</p>
                <p>Doctor: {bookingConfirmation.doctorName}</p>
                <p>Specialization: {bookingConfirmation.specialization}</p>
                <p>Date: {bookingConfirmation.appointmentDate}</p>
                <p>Day: {bookingConfirmation.appointmentDay}</p>
                <p>Time: {bookingConfirmation.timeSlot}</p>

                <h2>Patient Details</h2>
                <p>Name: {bookingConfirmation.patientDetails.patientName}</p>
                <p>Age: {bookingConfirmation.patientDetails.age}</p>
                <p>Gender: {bookingConfirmation.patientDetails.gender}</p>
                <p>Phone Number: {bookingConfirmation.patientDetails.phone}</p>
                <p>Email Id: {bookingConfirmation.patientDetails.email}</p>
                <p>Reason: {bookingConfirmation.patientDetails.reason}</p>

                <button className="print-btn" onClick={() => window.print()}>Print</button>
                <button className="print-btn" onClick={handleAnotherBooking}>Book Another Oppointment</button>
            </div>
            </>
        )
    }

    if(reviewDetails){
        return (
            <>
            <div className="booking-review">
                <h1>Review Your Details</h1>
                <h2>Doctor Details</h2>
                <p>Doctor: {doctor.name}</p>
                <p>Specialization: {doctor.specialization}</p>
                <p>Consultation Fee: {doctor.consultationFee}</p>

                <h2>Appointment Details</h2>
                <p>Date: {isdate}</p>
                <p>Day: {day}</p>
                <p>Time: {slot}</p>

                <h2>Patient Details</h2>
                <p>Name: {patient.patientName}</p>
                <p>Age: {patient.age}</p>
                <p>Gender: {patient.gender}</p>
                <p>Phone: {patient.phone}</p>
                <p>Email: {patient.email}</p>
                <p>Reason: {patient.reason}</p>

                <div className="booking-review-actions">
                    <button onClick={() => setReviewDetails(false)}>Edit Details</button>
                    <button onClick={handleSubmit} disabled={mutation.isPending}>{
                        mutation.isPending
                            ? "Booking..."
                            : "Confirm Booking"
                        }
                    </button>
                </div>
            </div>
            </>
        )
    }

    return (
        <>
        <h1 className="booking-heading">Required Booking Details</h1>
        <form onSubmit={handleReview} className="booking-form">
            <h2>Select Booking date</h2>
            <label>Choose a date</label>
            <input type="date" id="date" name="date" value={isdate} onChange={(e)=>setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}/>

            <label>Select Time Slot</label>
            <select name="timeSlot" value={slot} onChange={(e)=>setSlot(e.target.value)}>
                <option value="">Select a slot</option>
                {
                    doctor.slots.map((ele, index)=>(
                        (ele.available == true) ? 
                        <option key={index} value={ele.time} style={{color: "green"}}>{ele.time}</option> :
                        <option key={index} value={ele.time} disabled>{ele.time}</option>
                    ))
                }
            </select>

            <h2>Patient Details</h2>
            <label>Patient Name</label>
            <input type="text" name="patientName" placeholder="Enter name" value={patient.patientName} onChange={handlePatientInfo} required/>
            <label>Age</label>
            <input type="number" name="age" placeholder="Enter age" value={patient.age} onChange={handlePatientInfo} min={1} max={120} required/>
            <label>Gender</label>
            <select name="gender" value={patient.gender} onChange={handlePatientInfo} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="Enter 10 digit phone number" value={patient.phone} onChange={handlePatientInfo} maxLength={10} pattern="[0-9]{10}" required/>
            <label>Email ID</label>
            <input type="email" name="email" placeholder="Enter email Id" value={patient.email} onChange={handlePatientInfo} required/>
            <label>Reason for Visit</label>
            <textarea name="reason" placeholder="Enter reason" value={patient.reason} onChange={handlePatientInfo} required/>
            <button type="submit">Review Booking</button>
        </form>
        </>
    )
}

export default Booking;