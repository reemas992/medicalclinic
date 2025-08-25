import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctors";
import { getAvailableSlots, bookSlot } from "../api/appointments";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // جلب الأطباء عند تحميل المكون
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // جلب الـ slots عند اختيار دكتور + تاريخ
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDoctor?.id && date) {
        try {
          const data = await getAvailableSlots(selectedDoctor.id, date);
          setSlots(data);
        } catch (err) {
          console.error("❌ Error fetching slots:", err);
        }
      }
    };
    fetchSlots();
  }, [selectedDoctor, date]);

  // حجز الموعد
  const handleBook = async () => {
    if (!selectedSlot) return alert("⚠️ Please select a slot first");
    try {
      await bookSlot(selectedSlot.id);
      alert("✅ Appointment booked!");
      setSelectedSlot(null);
      const updatedSlots = await getAvailableSlots(selectedDoctor.id, date);
      setSlots(updatedSlots);
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Failed to book appointment");
    }
  };

  return (
    <div>
      <h2>📅 Book Appointment</h2>

      {/* اختيار الطبيب */}
      <div>
        <label>Choose Doctor: </label>
        <select
          onChange={(e) => {
            const doc = doctors.find((d) => d.id === parseInt(e.target.value));
            setSelectedDoctor(doc || null);
            setSlots([]);
            setSelectedSlot(null);
          }}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.user?.name || doc.name} ({doc.specialty})
            </option>
          ))}
        </select>
      </div>

      {/* اختيار التاريخ */}
      <div>
        <label>Select Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null);
          }}
        />
      </div>

      {/* قائمة الـ Slots */}
      <div>
        <h3>Available Slots</h3>
        {slots.length === 0 ? (
          <p>No slots available for this doctor on this date.</p>
        ) : (
          slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              style={{
                backgroundColor: selectedSlot?.id === slot.id ? "green" : "",
                color: selectedSlot?.id === slot.id ? "white" : "",
                margin: "5px",
                padding: "10px",
              }}
            >
              {slot.startTime} - {slot.endTime}
            </button>
          ))
        )}
      </div>

      {/* زر الحجز */}
      <div>
        <button disabled={!selectedSlot} onClick={handleBook}>
          Book Appointment
        </button>
      </div>
    </div>
  );
}
