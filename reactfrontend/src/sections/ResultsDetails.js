import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ResultsDetails = () => {
    const { gameId } = useParams();
    const location = useLocation();
    const eventTitle = location.state?.event
    const pageVariants = {
        initial: { x: "100vw", opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 60 } },
        exit: { x: "-100vw", opacity: 0, transition: { ease: "easeInOut", duration: 0.3 } }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div style={{ padding: "20px" }}>
                <h2 className="section-header">Results Details for {eventTitle}: {gameId}</h2>
                <div style={{ textAlign: "center", color: "white" }}>
                    <img src="/ConstructionFranny.png" alt="Construction Franny" style={{ width: "180px" }} />
                    <h1>Results Details page under construction!</h1>
                    <p>Franny is hard at work to get it up and running!</p>
                    <p>Mostly due to the limited amount of data TheSportsDB has for post game information.</p>
                </div>
            </div>
        </motion.div>
    );


};

export default ResultsDetails;