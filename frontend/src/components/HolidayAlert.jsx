// src/components/HolidayAlert.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Alert } from "react-bootstrap"; 

const HolidayAlert = () => {
  const [holiday, setHoliday] = useState(null);

  useEffect(() => {
    const fetchHoliday = async () => {
      try {
        const res = await axios.get("/holidays");
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const todayHoliday = res.data.find(h => h.date === today);
        if (todayHoliday) {
          setHoliday(todayHoliday);
        }
      } catch (err) {
        console.error("❌ Failed to fetch holidays:", err);
      }
    };

    fetchHoliday();
  }, []);

  if (!holiday) return null;

  return (
    <Alert variant="danger" className="text-center fw-bold">
      🚨Today is a holiday at the clinic due to: <strong>{holiday.reason}</strong>
    </Alert>
  );
};

export default HolidayAlert;
