import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { BING_KEY } from "../common/constants";
import AlertModal from "../components/AlertModal";

const GenerateRoute = ({ setPoints }) => {
  const history = useHistory();
  const [isModalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [route, setRoute] = useState({
    from: "",
    to: "",
  });

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setRoute((prevRoute) => ({ ...prevRoute, [name]: value }));
  }, []);

  const fetchRouteDuration = useCallback(async () => {
    const { from, to } = route;

    try {
      const response = await fetch(
        `https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${encodeURIComponent(
          from
        )}&wp.1=${encodeURIComponent(
          to
        )}&routeAttributes=excludeItinerary&key=${BING_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      const travelData = result.resourceSets[0]?.resources[0];

      if (travelData?.travelDuration) {
        setPoints({
          duration: travelData.travelDuration,
          from,
          to,
        });

        history.push("/generate-playlist");
      }
    } catch (error) {
      console.error("Error fetching route duration:", error);
      setAlertMessage(
        "Failed to generate route. Please enter valid city names."
      );
      setModalOpen(true);
    }
  }, [route, setPoints, history]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setAlertMessage(null);
  }, []);

  const isFormValid = route.from.trim() !== "" && route.to.trim() !== "";

  return (
    <section className="input-page">
      <AlertModal
        openModal={isModalOpen}
        closeModal={closeModal}
        alertMsg={alertMessage}
      />
      <h1 className="input-page__text">
        Choose your
        <span className="input-page__text--accent"> route!</span>
      </h1>
      <form className="input-page__form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label htmlFor="route-from">From:</label>
          <input
            id="route-from"
            type="text"
            name="from"
            value={route.from}
            onChange={handleInputChange}
            aria-required="true"
            placeholder="Enter starting location"
          />
        </div>
        <div className="input-group">
          <label htmlFor="route-to">To:</label>
          <input
            id="route-to"
            type="text"
            name="to"
            value={route.to}
            onChange={handleInputChange}
            aria-required="true"
            placeholder="Enter destination"
          />
        </div>
        <div className="input-group">
          <p className="input-page__city-reminder-msg">
            * Travel locations should be valid city names
          </p>
          <button
            type="button"
            className="btn"
            disabled={!isFormValid}
            onClick={fetchRouteDuration}
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
};

export default GenerateRoute;
