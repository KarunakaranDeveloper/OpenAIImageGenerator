import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col} from 'react-bootstrap';
import { ImageGenerator } from './Components/ImageGenerator'

function App() {
  return (
    <div className="App">
      <Container>
      <ImageGenerator />

      </Container>
    </div>
  );
}

export default App;
