import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BING_KEY } from "../common/constants";
import AlertModal from "../components/AlertModal";

const GenerateRoute = ({ setPoints }) => {
  const [modal, setModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [route, setRoute] = useState({
    from: "",
    to: "",
  });

  const history = useHistory();

  const createRoute = (prop, value) => {
    setRoute({
      ...route,
      [prop]: value,
    });
  };

  async function getDurationRequest() {
    try {
      const response = await fetch(
        `http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=${route.from}&wp.1=${route.to}&routeAttributes=excludeItinerary&key=${BING_KEY}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        const result = await response.json();
        setPoints({
          duration: result.resourceSets[0].resources[0].travelDuration,
          from: route.from,
          to: route.to,
        });

        if (result.resourceSets[0].resources[0].travelDuration) {
          const path = `/generate-playlist`;
          history.push(path);
        }
      }
    } catch (error) {
      console.error(error.message);
      setAlertMsg(
        "Something went wrong! Make sure you enter valid city names."
      );
      setModal(true);
    }
  }

  return (
    <section className="input-page">
      <AlertModal
        openModal={modal}
        closeModal={() => setModal(false)}
        alertMsg={alertMsg}
      />
      <h1 className="input-page__text">
        Choose your
        <span className="input-page__text--accent"> route!</span>
      </h1>
      <form className="input-page__form">
        <div className="input-group">
          <label htmlFor="route-from">From:</label>
          <input
            id="route-from"
            type="text"
            name="from"
            value={route.from}
            onChange={(e) => createRoute("from", e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="route-to">To:</label>
          <input
            id="route-to"
            type="text"
            name="to"
            value={route.to}
            onChange={(e) => createRoute("to", e.target.value)}
          />
        </div>
        <div className="input-group">
          <p className="city-reminder-msg">
            * Travel locations should be valid city names
          </p>
          <button
            type="button"
            className="btn"
            disabled={route.from && route.to ? false : true}
            onClick={() => getDurationRequest()}
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
};

export default GenerateRoute;
