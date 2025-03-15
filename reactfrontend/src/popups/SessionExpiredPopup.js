import React from "react";


const SessionExpiredPopup = ({ onHandleOkay }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Session Expired</h3>
                <p>Your session expired. Please log back in!</p>
                <button onClick={onHandleOkay}>Okay</button>
            </div>
        </div>
    );
};

export default SessionExpiredPopup;