
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
        <div style={{height: '50px', padding: "50px"}}>
            {/* {window.screen.width > 1000 ? ( */}
                <div className="whatIsWalletBtn">
                <p
                    className="whatIsWalletBtn link-btn"
                    onClick={() => {
                    }}
                >
                    What is a wallet?
                </p>
            </div>
            {/* ) : null} */}
        </div>
    )
}

export default Webinar
