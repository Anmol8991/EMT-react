import { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import useAuth from "../../../../hooks/useAuth";
import { notify } from "../../../../utils/toastify";
import {
  apiGetClockStatus,
  apiGetTime,
  apiClockEvents,
} from "../../../../api/user.api.js";

const useTime = ({ clockStatus, currentTimerId, setClockLoader }) => {
  const [time, setTime] = useState(0);
  const { signOut } = useAuth();

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
          const entryTime = new Date();
          let hours;
          if(parseInt(entryTimeParts[0])-4 >= 0 ){
            hours = parseInt(entryTimeParts[0])-4;
          }else{
            hours = 24 + parseInt(entryTimeParts[0])-4
          }
          entryTime.setHours(hours);
          entryTime.setMinutes(parseInt(entryTimeParts[1]));
          entryTime.setSeconds(parseInt(entryTimeParts[2]));
          console.log("Entry Time: ", entryTime);
          const entryTimeInSeconds =
            entryTime.getHours() * 3600 +
            entryTime.getMinutes() * 60 +
            entryTime.getSeconds();
          console.log("entryTimeInSeconds: ", entryTimeInSeconds);

          const currentTime = new Date();
          console.log("Current Time: ", currentTime);
          const currentTimeInSeconds =
            currentTime.getHours() * 3600 +
            currentTime.getMinutes() * 60 +
            currentTime.getSeconds();
          console.log("currentTimeInSeconds: ", currentTimeInSeconds);

          timeDifferenceInSeconds = currentTimeInSeconds - entryTimeInSeconds;
          console.log("timeDifferenceInSeconds: ", timeDifferenceInSeconds);

          }
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

  return time;
};

const Timer = () => {
  const [clockStatus, setClockStatus] = useState("clock-out");
  const [clockLoader, setClockLoader] = useState(false);
  const { signOut } = useAuth();
  const currentTimerId = useRef(null);
  const time = useTime({ clockStatus, currentTimerId, setClockLoader });

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
