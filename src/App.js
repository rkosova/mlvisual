// import logo from './logo.svg';
// import './App.css';

class DataPoint {
  constructor (x ,y) {
    this.x = x;
    this.y = y;
  }
}

/***
 * Gets two dimensional distance between two initialized DataPoint objects.
 */
const getDistance = (a, b) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y)**2)
}

// const userInput = () => {

// }

const App = () => {
  var dataPoints = [new DataPoint(12, 3), new DataPoint(13, 4)]
  console.log(getDistance(dataPoints[0], dataPoints[1]))
  return (
    <>
    </>
  );
}


export default App;
