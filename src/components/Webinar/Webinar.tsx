import React, { FC } from "react"
import "./Webinar.scss"
// import WebinarImg from "../../images/Webinar.png"

const oneDayInSeconds = 86400;
const startingDateTimeStamp = 1650608400; // 2022-04-22 00:00:00 GMT

interface ComponentProps {
    handleWebinarClose: any
    style: any
}

const Webinar: FC<ComponentProps> = ({ handleWebinarClose, style }) => {

    const bookMySeat = () => {
        let currentTime = Date.now()/1000;
        let timeDiff = currentTime - startingDateTimeStamp;
        let diffInDays = timeDiff / oneDayInSeconds;
        let refId = Math.floor(diffInDays + 4) ;
        window.open(`https://superworld.eventcalendarapp.com/u/33679/162282?repeatId=${refId}`, "_blank");
    }

    return (
        <>
            {window.screen.width > 1000 ? (
                <div className={`webinar`} >
                    <div className="close-icon" onClick={handleWebinarClose}>x</div>
                    <div className="mainInfo">
                        <img src={'null'} alt="Webinar" />
                        <div className="webinarInfo">
                            <h2>3 Steps to Acquire Your First Metaverse Land</h2>
                            <p>With Peggy Everyday at 10 PM EST </p>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button
                            onClick={() => window.open("https://www.youtube.com/watch?v=gQI8XsKxEfs", "_blank")}
                            className="transparent-button"
                        >
                            Watch Video
                        </button>
                        <button onClick={bookMySeat}>Book My Seat</button>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Webinar
