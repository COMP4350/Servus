import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import '../stylesheets/styles.css'
import Container from "@material-ui/core/Container";


const Home = () =>  {
  const [services, setServices] = useState(null);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:5000/services/");
    setServices(response.data.result);
  };
  if(!services)
  {
    fetchData();
  }
  return (
    <Container className="Home" maxWidth="lg">
        <h1>List of Services</h1>
        <h2>Fetch a list from an API and display it</h2>
      

      {/* Display data from API */}
      <div className="services">
        {services &&
          services.map((service, index) => {
            return (
                <Container  maxWidth="med" className="service" key={index} >
                <h3>Service {index + 1}</h3>
                <h2>{service.name}</h2>

                <div className="details">
                  <p>👨: {service.provider}</p>
                  <p>📖: {service.description}</p>
                  <p>💰: {service.cost}</p>
                  <p>⏰: {service.duration}</p>
                </div>
              </Container>
              
            );
          })}
      </div>
    </Container>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Home />, rootElement);

export default Home;