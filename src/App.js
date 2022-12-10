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

const getKNeighbours = (unclassifiedPoint, classifiedPoints, k) => {
  
  /**
   * Issues
   * 
   * Will overwrite points with same distance. Possible solution is to split into two arrays
   */
  var distancePointPair = new Map()

  for (let i = 0; i < classifiedPoints.length; i++) {
    distancePointPair.set(getDistance(unclassifiedPoint, classifiedPoints[i]), classifiedPoints[i]) 
  }

  var distances = Array.from(distancePointPair.keys())

  for (let i = 0; i < distances.length - 1; i++) {
    let current = distances[i]
    for (let j = i + 1; j < distances.length; j++) {
      if (current > distances[j]) {
        let temp = distances[j]
        distances[j] = current
        distances[i] = temp
        break
      }
    }
  }

  var KNeighbours = []

  for (let i = 0; i < k; i++) {
    KNeighbours[i] = distancePointPair.get(distances[i])
  }

  return KNeighbours;
  
}

// const userInput = () => {

// }

const App = () => {
  var KNeighbours = getKNeighbours(new DataPoint(0, 0), [new DataPoint(1, 4), new DataPoint(302, 343), new DataPoint(1, 1), new DataPoint(3, 5)], 3)
  console.log(KNeighbours[2].x, KNeighbours[2].y)
  return (
    <>
    </>
  );
}


export default App;
