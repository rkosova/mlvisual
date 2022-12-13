// import logo from './logo.svg';
import './App.css';

import { Data, VictoryAxis, VictoryChart, VictoryContainer, VictoryGroup, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme } from 'victory';
import React, { useId, useState } from 'react';

class DataPoint {
  #x;
  #y;
  #classValue;

  constructor (x, y, classValue) {
    this.x = x;
    this.y = y;
    this.classValue = classValue;
  }

  static pointsToObjects = (dataPoints = []) => {
    var objects = [];

    dataPoints.forEach(e => {
      objects.push({
        x: e.getX(),
        y: e.getY(),
        c: e.getClass()
      });
    })

    return objects;
  }

  setClass = (classValue) => {
    this.classValue = classValue;
  }

  getClass = () => {
    return this.classValue;
  }

  setX = (x) => {
    this.x = x;
  }

  getX = () => {
    return this.x;
  }

  setY = (y) => {
    this.y = y;
  }

  getY = () => {
    return this.y;
  }

  // static method that returns array of objects with x and y values created by passing an array of DataPoints
}

/***
 * Gets two dimensional distance between two initialized DataPoint objects.
 */
const getDistance = (a, b) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y)**2);
}


const getKNeighbours = (unclassifiedPoint, classifiedPoints, k) => {
  
  var distancePointPair = [];

  for (let i = 0; i < classifiedPoints.length; i++) {
    distancePointPair.push(
      {
        point: classifiedPoints[i],
        distance: getDistance(unclassifiedPoint, classifiedPoints[i])
      }
    );
  }

  distancePointPair.sort(
    (a, b) => {
      return a.distance - b.distance // ascending order  
    }
  )


  var KNeighbours = [];

  for (let i = 0; i < k; i++) {
    KNeighbours[i] = distancePointPair[i];
  }

  return KNeighbours;
  
}


const classify = (KNeighbours) => {

  var classes = [];

  for (let i = 0; i < KNeighbours.length; i++) {
    classes[i] = KNeighbours[i].point.getClass();
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
    if (uClassesCount.get(currentMostRepeatingClass) < uClassesCount.get(uniqueClasses[i])) {
      currentMostRepeatingClass = uniqueClasses[i];
    }
  }


  if (uClassesCount.get(currentMostRepeatingClass) === 1) {
    return KNeighbours[0].point.getClass();
  }

  return currentMostRepeatingClass; 
}


const UserInput = (props) => {

  const handleChange = (event) => {
    const name = event.target.name;
    const value = Number(event.target.value);
    props.setInp((values) => ({...values, [name]: value}))
  }

  return (
    <form>
      <label> x:
        <input
          type='number'
          name='x'
          value={props.inp.x || ""}
          onChange = {handleChange}
        />
      </label>
      <label> y:
        <input
          type='number'
          name='y'
          value={props.inp.y || ""}
          onChange = {handleChange} 
        />
      </label>
    </form>
  );
}


const NeighbourLines = ({kNasOb, k, inp, ...other}) => {
  var lines = []
  
  if (kNasOb != undefined && kNasOb.length != 0){
    for(let i = 0; i < k; i++) {
      lines.push(
        <VictoryLine
          style={{
            data: {
              stroke: "#e1e2e3",
              strokeWidth: 1.3
            }
          }}
          data={[
            inp,
            kNasOb[i]
          ]}
          key={i}
        /> 
      );
    }
  }


 //  other passes everything VictoryChart needs to identify and render its children
  return (
    <VictoryGroup
    {...other}> 
      { lines }
    </VictoryGroup>
    );
}


const App = () => {
  const [inp, setInp] = useState({});

  var data = [new DataPoint(1, 4, "A"), new DataPoint(5, 7, "C"), new DataPoint(1, 1, "A"), new DataPoint(3, 5, "B")];

  if (inp.x != undefined && inp.y != undefined) {
    const unc = new DataPoint((inp.x), (inp.y), null)
    var KNeighbours = getKNeighbours(
      unc, 
      data,
      3
    );
    unc.setClass(classify(KNeighbours))
    var kNDataPoints = KNeighbours.map(a => a.point);
    var kNasOb = DataPoint.pointsToObjects(kNDataPoints);
    data.push(unc); 
  }

  var dpAsOb = DataPoint.pointsToObjects(data);


  return (
    <>
      <div className = "graph">
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, 5], y: [0, 7] }}
        >
          <VictoryAxis 
            dependentAxis
            style={{
              grid: { stroke: "none" }
            }}
          />
          <VictoryAxis 
            independentAxis
            style={{
              grid: { stroke: "none" }
            }}
          />

          <NeighbourLines
            k={ 3 }
            inp={ inp }
            kNasOb={ kNasOb }
         />

          <VictoryScatter
            style={{ data: { fill: "#c43a31" }, labels: { fill: "white", fontSize: 12 }, grid: { stroke: "none" } }}
            size={ 7 }
            data={ dpAsOb }
            labels={ ({ datum }) => datum.c }
            labelComponent={ <VictoryLabel dy={5}/> }
            x = "x"
            y = "y"
          />
        </VictoryChart>  

        <UserInput 
          inp={ inp }
          setInp={ setInp }
        />
      </div>
    </>
  );
}

// plan is to have a hard coded spread of points with set classes and then let user place points as they please and see how the algorithm reacts
// spiral the color wheel? to distinguish classes. could be fun alg. to write
export default App;
