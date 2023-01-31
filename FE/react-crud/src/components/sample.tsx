import { ElementRef, useEffect } from "react";
import { findDOMNode } from "react-dom";
import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
const Sample = ()=> {
    // we don't have sleep method so it's a trcik to create one
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


    // to change any dom element we use refs here.
    // will call the ref callback with the DOM element when the component mounts, and call it with null when it unmounts. 
    //Refs are guaranteed to be up-to-date before componentDidMount or componentDidUpdate fires.
    // but if we use document.getElementById('t1') inside useEffect, it case give us null, in case of componenetUnmount, which could cause errors.
    // so to se document.getElementById('t1') we need to use if codition to guard null case, then only it will work i ts
    const sampleMethod = async (e:HTMLDivElement)=>{

        if (e){
           
           
        e.innerHTML = 'in-prcoess';
        await sleep(5*1000);
        e.innerHTML = 'done';
        console.log('print after done')

        }
    };
    
    
    // or we can access ref html dom element like below:
    
    // textInput must be declared here so the ref can refer to it
    //   const textInput = useRef(null);
    
    //   function handleClick() {
    //     textInput.current.focus();
    //   }

    //   return (
    //     <div>
    //       <input
    //         type="text"
    //         ref={textInput} />);

    
    useEffect(
        ()=> {
            (
                 async ()=> {    
                    // ideally below line will print after sampleMethod is done executing, i.e     
                    //  console.log('print after done') should print before 'yo hoo' msg, but due to await method,
                    // its execution just stop there and useEffect is called.and react rendered whatever was pending.
                    // if we comment `await sleep` then 
                  console.log('yo hoo, printed before sleep')
                  
                 } 
            )();
    }
    );
    return (
        <div>
            <div id='t1' ref ={sampleMethod}>yo</div>
            <h1>Hello</h1>
        </div>
    );
};


export default Sample;
export function er(){console.log('sample named export')};

/* Named exports - for example export function func() {} is a named export with the name of func.
 Named modules can be imported using import { exportName } from 'module';. In this case, the name of the import
  should be the same as the name of the export. To import the func in the example, you'll have to use import
   { func } from 'module';. There can be multiple named exports in one module.

Default export - is the value that will be imported from the module, if you use the simple import statement
 import X from 'module'. X is the name that will be given locally to the variable assigned to contain the value, 
 and it doesn't have to be named like the origin export. There can be only one default export.
 */

// 1. in normal arrow functions `this` is referneced to  outer block this object.
 // arrow functions does not have their own `this`.
//  var variable = “Global Level Variable”;
// let myObject = { 
//  variable: “Object Level Variable”, 
// arrowFunction:() => { 
//  console.log(this.variable); 
//  },
// regularFunction(){ 
//  console.log(this.variable); 
//  } 
// };
// myObject.arrowFunction(); 
// it will print “Global Level Variable”

 // 2. in strcit mode(ES6 or typescript) normal/arrow  functions  `this` is undefined 
// 3. in  normal functions `this` is global object or object who called current function. which could be the window,
// the document, a button or whatever. 
// in class methods it will repesent to current object.


// let vs const vs var

// var is buggy, becuase there is no scope for vr defined variables. a var with same name inside a
// block can update var outside the block. so instead of var we use const and let which comes in es6

// let will create different objects in different scopes if they have same name, also once a let variable is defined
// we can can not redefine it again, but we can update value of same variable.
let greeting = "say Hi";
greeting = "say Hello instead";
// will work

// let greeting = "say Hi";
// let greeting = "say Hello instead";
// will return error

// Hositing: Just like  var, let declarations are hoisted to the top. Unlike var which is initialized as undefined,
// the let keyword is not initialized. So if you try to use a let variable before declaration, you'll get a Reference Error.

// const is just like var, only difference is we can not update it's value
// const  greeting = "say Hi";
// greeting = "say Hello instead";
// will throw error

// we should use functional components instead of class componenets
// 1. as functions components requires less code.
// 2. in class compoenent we need to bind methods otherwise this keyword inside methods will be undefined
// class ClassComponent extends React.Component{
//     constructor(){
//         super();
//         this.state={
//             count :0
//         };
//         this.increase=this.increase.bind(this);
//     }
     
//    increase(){
//        this.setState({count : this.state.count +1});
//    }

//we don't requires this in case of functional comp as we can wasily use hooks and states.
// Hooks can be easily used in functional components to make them Stateful.
// example: const [name,SetName]= React.useState(‘ ‘)

// It requires different syntax inside a class component to implement hooks.
// example: constructor(props) {
//    super(props);
//    this.state = {name: ‘ ‘}
// }

// 3. React lifecycle methods (for example, componentDidMount) cannot be used in functional components. but we have useEffect hook
// which provied similar functionality. 

// usually useEffect is called when any componenet mounted or changed, but if we return a function from 
// useEffect then it will be called when component is unmount
// import React, { useEffect } from 'react';
// const ComponentExample => () => {
//     useEffect(() => {
//         // Anything in here is fired on component mount/update.
//         return () => {
//             // Anything in here is fired on component unmount.
//         }
//     }, [])
// }
