// import logo from './logo.svg';
import './App.css';

import { Data, VictoryAxis, VictoryChart, VictoryContainer, VictoryGroup, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme } from 'victory';
import React, { useId, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

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
    <form className="var-in">
      <label> x:
        <div className='xin'>
          <input
            type='number'
            name='x'
            value={props.inp.x || ""}
            onChange = {handleChange}
            className="num-in"
          />
          <span className='underline'></span>
        </div>
      </label>
      <label> y:
        <div className='yin'>
          <input
            type='number'
            name='y'
            value={props.inp.y || ""}
            onChange = {handleChange} 
            className="num-in"
          />
          <span className='underline'></span>
        </div>
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
              stroke: "#041F1E",
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

  var data = [
    // A
    new DataPoint(1, 4, "A"), //A1
    new DataPoint(1, 1, "A"), //A2
    new DataPoint(-2, 1, "A"), //A3
    new DataPoint(3, 2, "A"), //A4
    new DataPoint(1, -1, "A"), //A5
    new DataPoint(-2, -1, "A"), //A6
    new DataPoint(0, 2, "A"), //A7
    new DataPoint(0, 0, "A"), //A8
    new DataPoint(-1, -0.3, "A"), //A9
    new DataPoint(2.5, 1.2, "A"), //A10
    //B 
    new DataPoint(3, 5, "B"), //B1
    new DataPoint(5, 7, "B"), //B2
    new DataPoint(4, 8, "B"), //B3
    new DataPoint(5, 6, "B"), //B4
    new DataPoint(2, 6, "B"), //B5
    new DataPoint(4, 4, "B"), //B6
    new DataPoint(7, 1, "B"), //B7
    new DataPoint(3, 4, "B"), //B8
    //C
    new DataPoint(-5, 5, "C"), //C1
    new DataPoint(-2, 3, "C"), //C2
    new DataPoint(-4, 2, "C"), //C3
    new DataPoint(-3.2, 3.5, "C"), //C4
    new DataPoint(-3.5, 4.2, "C"), //C5
    new DataPoint(-1.5, 4.4, "C") //C6 
    ];

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
    data.push(unc); // with every state change, data is reset and thus anything we push is removed allowing for dynamic movement
                    // of the example point
  }

  var dpAsOb = DataPoint.pointsToObjects(data);


  return (
    <>
      <Header />
      <div className='main'>
        <div className='container'>
          <div className='exp'>
            <h1>k-NN: K Nearest Neighbours (Classification)</h1>
            <p>
              A simple, <a href="https://en.wikipedia.org/wiki/Supervised_learning">supervised</a> machine learning algorithm.
              It classifies a data point using its <b>nearest k</b> number of <b>neighbours</b>.
            </p>

          </div>

          <UserInput 
          className="userin"
          inp={ inp }
          setInp={ setInp }
          />
        </div>

        <div className = "graph">

          <VictoryChart
            theme={VictoryTheme.material}
            domain={{
              x: [-7, 7],
              y: [-8, 8] 
            }}
          >
            <VictoryAxis 
              dependentAxis
              style={{
                grid: { stroke: "none" },
              }}
            />
            <VictoryAxis 
              independentAxis
              style={{
                grid: { stroke: "none" },
              }}
            />

            <NeighbourLines
              k={ 3 }
              inp={ inp }
              kNasOb={ kNasOb }
          />

            <VictoryScatter
              style={{
                data: { fill: ({datum}) => datum.x === inp.x && datum.y === inp.y ? "#40C9A2" : "#F26157"}, 
                labels: { fill: "white", fontSize: 10, fontFamily:  'Martian Mono'}, 
                grid: { stroke: "none" } }}
              size={ 7 }
              data={ dpAsOb }
              labels={ ({ datum }) => datum.c }
              labelComponent={ <VictoryLabel dy={
                                ({ datum }) => datum.y >= 0 ? 5 : -5 }
                                /> 
                              }
              x = "x"
              y = "y"
            />
          </VictoryChart>  
        </div>

      </div>
      <Footer />
    </>
  );
}

// plan is to have a hard coded spread of points with set classes and then let user place points as they please and see how the algorithm reacts
// spiral the color wheel? to distinguish classes. could be fun alg. to write
export default App;
