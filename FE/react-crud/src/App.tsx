import React, { useEffect } from 'react';
import logo from './logo.svg';
import Login from './login/login';
import './App.css';
import  {BrowserRouter, HistoryRouterProps} from 'react-router-dom';
import Routers from './routes';
// props is just a way to pass data between componenets.
// lets take a exmape of tool component.

// function Tool(props) {

//   return (
//     <div>
//       <h1>My name is {props.name}.</h1>
//       <p>My favorite design tool is {props.tool}.</p>
//     </div>
//   );

// }

// setting default value to prop
// Tool.defaultProps = {
//   name: "Designer",
//   tool: "Adobe XD"
// }
// export default Tool

// setting props value while calling componenet
// function App() {
//   return (
//     <div className="App">
//       <Tool name="Ihechikara" tool="Figma"/>
//     </div>
//   )
// }
// apart from name and tool other props will also be passed like history, etc

function App(props:any) {
  // we can call auth checking function here or may be in below effect
  console.log('I am app file outside effect');
  useEffect(()=>{
    // we can call a function here to check if token we set in our localstorage is expied or not.
    // or may be before making a call to api we can always check the token validity and call refresh token to set new access token
    
    console.log('I am app file');
  });

  return (
    <BrowserRouter>
    <div className="App">
      {/* passing default props to routers*/}
      <Routers {...props}/>


    {/* <p>{props.testNumber}</p> */}
  </div>
  </BrowserRouter>
  );
}

// default props to pass to all childs
App.defaultProps = {
  testNumber:3
}
export default App;


// // object destructuring
// const e = [1,2];
// const [x,y] = e
// // x will be 1

// const et = {er:1, bt:2};
// const {er, bt} = et;

// const vehicleOne = {
//   brand: 'Ford',
//   model: 'Mustang',
//   type: 'car',
//   year: 2021, 
//   color: 'red'
// }

// myVehicle(vehicleOne);

// function myVehicle({type , brand, model}:{type:string, brand:string, model:string}):string {
//   const message = 'My ' + type + '   ' + brand + ' ' + model + '.';
//   return message;
// }

// // or rename args in function def
// function myVehicle({ model, registration: { state } }) {
//   const message = 'My ' + model + ' is registered in ' + state + '.';
// }

// // spread operator like *args in python
// function mydef(...a:number[]){
//   const x = a;
// }

// mydef(1,2,3);
// or const x = [1,2,3]
// mydef(...x);


// memos in react
// these are used to avoid rerendering of componenets. 
// in this case react will memorize the result of render, and avoid re rendering unluess props of components is not changed.
// let say we called same comp with same props with multiple times in that case it will be renderd only once.
// but whenever any prop changes it will be called. also it has to do nothing with states of comp, whenever state changed comp will be rendered.

// function moviePropsAreEqual(prevMovie, nextMovie) {
//   return prevMovie.title === nextMovie.title
//     && prevMovie.releaseDate === nextMovie.releaseDate;
// }
// const MemoizedMovie2 = React.memo(Movie, moviePropsAreEqual);
// second argument is optional, there we will pass callback which should return bool value.

// usememo -> similarly we have this usememo function which will call passed callback when it's dependencies(second arg) are changed
// const calculation = React.useMemo(() => expensiveCalculation(count), [count]);
// so whenever count arg changes then only we will call this function otherwise we will use same cached result


// we can modify state of parent comp uing child comp, just pass the state_modification_function as prop to child comp.
// props are unidirectional flow for data transfer, i.e you can pass data only from parent to child, but by using above mentioned approach u can change parent state,
// which is indrectly passing data to parent. by chainging it's states.

// note: we can use maps instead of js objects sometimes, maps acts as like python dict, u can iterate over their key-value pairs
// maps take list of list , second list can have only 2 value fist will be key and second will be value.