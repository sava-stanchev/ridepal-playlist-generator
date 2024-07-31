import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BING_KEY } from "../common/constants";
import AlertModal from "../components/AlertModal";

const cityNameVerificationError = {
  properCityName: false,
};

const GenerateRoute = ({ setPoints }) => {
  const [cityNameOneError, setCityNameOneError] = useState(
    cityNameVerificationError
  );
  const [cityNameTwoError, setCityNameTwoError] = useState(
    cityNameVerificationError
  );
  const [isOpen, setIsOpen] = useState(false);
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

    if (prop === "from") {
      const properCityName =
        /^([a-zA-Z\u0080-\u024F]+(?:(\. )|-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(
          value
        );
      setCityNameOneError({ ...cityNameOneError, properCityName });
    }

    if (prop === "to") {
      const properCityName =
        /^([a-zA-Z\u0080-\u024F]+(?:(\. )|-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(
          value
        );
      setCityNameTwoError({ ...cityNameTwoError, properCityName });
    }
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
      setAlertMsg("Something went wrong!");
      setIsOpen(true);
    }
  }

  return (
    <section className="main">
      <AlertModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        alertMsg={alertMsg}
      />
      <h1 className="main__text">
        Choose your
        <span className="main__text--accent"> route!</span>
      </h1>
      <form className="main__form">
        <div className="input-group">
          <label>From:</label>
          <input
            type="text"
            name="from"
            value={route.from}
            onChange={(e) => createRoute("from", e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>To:</label>
          <input
            type="text"
            name="to"
            value={route.to}
            onChange={(e) => createRoute("to", e.target.value)}
          />
        </div>
        <div className="input-group">
          <p
            className="city-reminder-msg"
            style={{
              color:
                cityNameOneError.properCityName &&
                cityNameTwoError.properCityName
                  ? "white"
                  : "red",
            }}
          >
            * Travel locations should be valid city names
          </p>
          <button
            type="button"
            className="btn"
            disabled={
              cityNameOneError.properCityName && cityNameTwoError.properCityName
                ? false
                : true
            }
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
