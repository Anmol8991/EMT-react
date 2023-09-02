import { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import useAuth from "../../../../hooks/useAuth";
import { notify } from "../../../../utils/toastify";
import {
  apiGetClockStatus,
  apiGetTime,
  apiClockEvents,
} from "../../../../api/user.api.js";

const Timer = () => {
  const [clockStatus, setClockStatus] = useState("clock-out");
  const [clockLoader, setClockLoader] = useState(false);
  const [time, setTime] = useState(0);
  const { signOut } = useAuth();
  const currentTimerId = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStatus = async () => {
      try {
        setClockLoader(true);
        const response = await apiGetClockStatus({ signal: controller.signal });
        console.log(
          "Last clockStatus in Db: ",
          response?.data?.data?.clockStatus
        );
        // Change Status
        setClockStatus(response?.data?.data?.clockStatus);
      } catch (error) {
        if (error?.name !== "CanceledError") {
          console.log("Error in useEffect hook in Timer Component: ", error);
          if (error?.response?.data?.status === 401) {
            signOut();
          }
        } else {
          console.log("Request Aborted!");
        }
      } finally {
        // Stop Loader
        setClockLoader(false);
      }
    };

    fetchStatus();

    return () => {
      controller.abort();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    // {signal: controller.signal}
    const fetchTime = async () => {
      try {
        setClockLoader(true);
        const response = await apiGetTime({ signal: controller.signal });
        console.log("Response of GetTime Request: ", response?.data?.data);
        const totalTime = parseInt(response?.data?.data?.totalSeconds);

        let timeDifferenceInSeconds = 0;

        if (clockStatus === "clock-in") {
          if(response?.data?.data?.entryTime !== null){
            const entryTimeParts = response?.data?.data?.entryTime.split(":");
            const currentUTC = new Date(); // Get the current date and time in UTC

            // Construct the entryTime object in UTC/GMT timezone
            const entryTime = new Date(
              currentUTC.getUTCFullYear(),
              currentUTC.getUTCMonth(),
              currentUTC.getUTCDate(),
              parseInt(entryTimeParts[0]),
              parseInt(entryTimeParts[1]),
              parseInt(entryTimeParts[2])
            );

            console.log("Entry Time (GMT): ", entryTime.toUTCString());

            // Calculate the time difference in seconds
            const entryTimeInSeconds =
              entryTime.getUTCHours() * 3600 +
              entryTime.getUTCMinutes() * 60 +
              entryTime.getUTCSeconds();

            console.log("Entry Time in Seconds (GMT): ", entryTimeInSeconds);

            const currentTimeInSeconds =
              currentUTC.getUTCHours() * 3600 +
              currentUTC.getUTCMinutes() * 60 +
              currentUTC.getUTCSeconds();

            console.log("Current Time in Seconds (GMT): ", currentTimeInSeconds);

            const timeDifferenceInSeconds = currentTimeInSeconds - entryTimeInSeconds;
            console.log("Time Difference in Seconds (GMT): ", timeDifferenceInSeconds);

          }
          console.log("Total Time in seconds: ",totalTime);
          setTime(totalTime + timeDifferenceInSeconds);
          currentTimerId.current = setInterval(refreshClock, 1000);
        } else {
          setTime(totalTime + timeDifferenceInSeconds);
          clearInterval(currentTimerId.current);
        }
      } catch (error) {
        if (error?.name !== "CanceledError") {
          console.log("Error in useTime hook in Timer Component: ", error);
          if (error?.response?.data?.status === 401) {
            signOut();
          }
        } else {
          console.log("Request Aborted!");
        }
      } finally {
        setClockLoader(false);
      }
    };
    fetchTime();

    // this function is called when component in unmounted.
    return () => {
      clearInterval(currentTimerId.current);
      controller.abort();
    };
  }, [clockStatus, currentTimerId]);

  const refreshClock = () => {
    setTime((prevTime) => {
      // localStorage.setItem("timer", prevTime + 1);
      return prevTime + 1;
    });
  };

  const handleClock = async (event) => {
    event.preventDefault();
    // Start Loader
    try {
      setClockLoader(true);
      const newStatus = clockStatus === "clock-in" ? "clock-out" : "clock-in";
      const response = await apiClockEvents({ clockStatus: newStatus });
      console.log(response?.data?.message);
      // Change Status
      setClockStatus(newStatus);
    } catch (error) {
      console.log("Error in Timer Component: ", error);
      if (error?.response?.data?.status === 401) {
        signOut();
      }
    } finally {
      // Stop Loader
      setClockLoader(false);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor((time / 3600) % 24);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const attendanceStatus = (time) => {
    if(time >= 28800){
      return "Present";
    }else{
      return "Absent";
    }
  }

  return (
    <Card className="h-100">
      <Card.Header className="text-center">
        <h4>Timer</h4>
      </Card.Header>
      <Card.Body>
        <div className="container h-100 text-center">
          <div className="row h-100">
            <div className="col-12 align-self-center">
              <h5>
                {new Date().toLocaleString("default", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h5>
            </div>
            <div className="col-12 align-self-center">
              {clockLoader ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  <h5>{formatTime(time)}</h5>
                  <ol className="breadcrumb mb-0 justify-content-center">
                    <li className="breadcrumb-item active">
                      Today's Status: {attendanceStatus(time)} 
                    </li>
                  </ol>
                </>
              )}
            </div>
            <div className="col-12 align-self-center">
              {clockLoader ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button
                  className={`btn ${
                    clockStatus === "clock-in" ? "btn-danger" : "btn-primary"
                  } w-75`}
                  onClick={handleClock}
                >
                  {clockStatus === "clock-in" ? "Clock-Out" : "Clock-In"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Timer;

// useEffect(()=>{
//   const controller = new AbortController()

//   const fetchStatus =  async () => {
//     try{
//       const response = await api({signal: controller.signal})
//   }catch(error){
//     if(error?.name !== "CanceledError"){
//       console.log("Error in useTime hook in Timer Component: ", error);
//       if(error?.response?.data?.status === 401){
//         signOut()
//       }
//     }else{
//       console.log("Request Aborted!")
//     }
//   }
//   }
//   fetchStatus()

//   return ()=> {
//     controller.abort()
//   }
// },[])
