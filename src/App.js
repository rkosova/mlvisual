// import logo from './logo.svg';
// import './App.css';

class DataPoint {
  #x;
  #y;
  #classValue;

  constructor (x, y, classValue) {
    this.x = x;
    this.y = y;
    this.classValue = classValue;
  }

  setClass = (classValue) => {
    this.classValue = classValue;
  }

  getClass = () => {
    return this.classValue;
  }
}

/***
 * Gets two dimensional distance between two initialized DataPoint objects.
 */
const getDistance = (a, b) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y)**2);
}

const getKNeighbours = (unclassifiedPoint, classifiedPoints, k) => {
  
  /**
   * Issues
   * 
   * Will overwrite points with same distance. Possible solution is to split into two arrays or key value pair reversed
   */
  var distancePointPair = new Map();

  for (let i = 0; i < classifiedPoints.length; i++) {
    distancePointPair.set(getDistance(unclassifiedPoint, classifiedPoints[i]), classifiedPoints[i]);
  }

  var distances = Array.from(distancePointPair.keys());

  for (let i = 0; i < distances.length - 1; i++) {
    let current = distances[i];
    for (let j = i + 1; j < distances.length; j++) {
      if (current > distances[j]) {
        let temp = distances[j];
        distances[j] = current;
        distances[i] = temp;
        break;
      }
    }
  }

  var KNeighbours = [];

  for (let i = 0; i < k; i++) {
    KNeighbours[i] = distancePointPair.get(distances[i]);
  }

  return KNeighbours;
  
}


const classify = (KNeighbours) => {
  var classes = [];

  for (let i = 0; i < KNeighbours.length; i++) {
    classes[i] = KNeighbours[i].getClass();
  }

  var uniqueClasses = [...new Set(classes)] // not too demanding considering k is usually a small value. may be useless

  var uClassesCount = new Map();
  uClassesCount.set(classes[0], 1);

  for (let i = 1; i < classes.length; i++) {
    if (!uClassesCount.has(classes[i])) {
      uClassesCount.set(classes[i], 1);
    } else {
      uClassesCount.set(classes[i], uClassesCount.get(classes[i]) + 1);
    }
  } 

  var currentMostRepeatingClass = uniqueClasses[0];

  for (let i = 1; i < uniqueClasses.length; i++) {
    if (uClassesCount.get(currentMostRepeatingClass) < uClassesCount.get[uniqueClasses[i]]) {
      currentMostRepeatingClass = uniqueClasses[i];
    }
  }


  return currentMostRepeatingClass;
}

// const userInput = () => {

// }

const App = () => {
  var KNeighbours = getKNeighbours(new DataPoint(0, 0, null), 
                                   [new DataPoint(1, 4, "A"), new DataPoint(302, 343, "C"), new DataPoint(1, 1, "A"), new DataPoint(3, 5, "B")],
                                   3);


  console.log(classify(KNeighbours))
  
  return (
    <>
    </>
  );
}


export default App;
