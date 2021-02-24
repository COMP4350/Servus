import React from 'react';
import ReactDOM from 'react-dom';
import Container from '@material-ui/core/Container';
import ServiceList from './ServiceList';

const Home = () => {
    return (
        <Container className="Home" maxWidth="lg">
            <ServiceList></ServiceList>
        </Container>
    );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Home />, rootElement);

export default Home;
