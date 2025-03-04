import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

const ResultsDetails = () => {
    const { gameId } = useParams();
    const location = useLocation();
    const eventTitle = location.state?.event
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2 className="section-header">Results Details for {eventTitle}: {gameId}</h2>
            <div style={{ textAlign: "center", color: "white" }}>
                <img src="/ConstructionFranny.png" alt="Construction Franny" style={{ width: "180px" }} />
                <h1>Results Details page under construction!</h1>
                <p>Franny is hard at work to get it up and running!</p>
                <p>Mostly due to the limited amount of data TheSportsDB has for post game information.</p>
            </div>
        </div>
    );


};

export default ResultsDetails;