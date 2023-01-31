import React, {SyntheticEvent, useEffect, useState} from "react";
import logo from '../logo.svg'
import  {isRouteErrorResponse, useNavigate} from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../store";
import { setuser } from "../actions/loginAction";
import axios from "axios";
import { url } from "inspector";

interface FullName {
  firstName: string;
  set_user: CallableFunction;
  user: string;
  
}
const Login = (props:FullName) => {
  // states like properties in python class,  useState is react hook, inside this method we provide defualt value nd it return state var and a function to set it's value.
  // as we can not directly set a state value
  // in function which is returned by useState, let say setEmail,  we can pass a value diectly to set email value like this:
  // setEmail('sample.com');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  // getting dispatcher function and stats using redux hooks, another wy t fetch it using connect() high order componenet
  // which will pss these things as props.
  // var state = useSelector((state: RootState) => state)
  // from above varable we get get latest redux state

  // const dispatch = useDispatch()
  // dispatch(setuser('test'));
  // this dispatch is used to call actions for disptcher

  // subscribe i called when state is changed.
  // const unsubscribe = store.subscribe(() => console.log(store.getState()))
  // subscribe is not a good idea to use, beause it called multipe times when redux state chanes.
  // its a very low level, so instead of using this we can use connect() hogh order coponent, 
  // which  is used to pass states and redux dispatchers as props.
// see example at bottom of thi file
  

  const submit = async (e: SyntheticEvent) => {
    // avoid resetting of feilds after submit
    e.preventDefault();
    try{
      // const user = await axios.post('www.ath.com',JSON.stringify(email,password))
      localStorage.setItem('Refresh_token', 'data from API')
      sessionStorage.setItem('Access_token', 'data from api')
      props.set_user('test');
    }
    catch (error){
      // set login fail error msg
      console.log(error);
      localStorage.removeItem('Refresh_token')
      sessionStorage.removeItem('Access_token')
      props.set_user('')

    }
    

    // await fetch('http:localhost:8000/api/login',{
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     email,
    //     password
    //   })
    // });

      // when we navigate, props of this component will remain still but we will loose all states.
      // but globally defined redux will remain during navigation.
      // return nav('/audios');
  // another way is to use  this.props.history.push('/path'), we use use history prop only for protected routes.
  // note: props.history is not longer supported to insed use navigate() hook
  // so that unauthorized users won't get rountes detials. like /admin/audios is authorized path s we can use histroty prop here
  // but /login is not so to redirect ther directly use redirect()
  // redirecting to another page, in above line
  }

  useEffect(()=>
    
  console.log(props)
  );
  
    return (
<div className="text-center">
    <main className="form-signin w-100 m-auto">
      <form onSubmit={submit}>
        <img className="mb-4" src={logo} alt="" width="72" height="57" />
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
    
        <div className="form-floating">
          <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"   onChange={e => setEmail(e.target.value) } />  
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={e => setPassword(e.target.value) }  />
          <label htmlFor="floatingPassword">Password</label>
        </div>
    
        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
    </main>
    </div> );};

// if you want ot show some div conditionally then do this:
// {error.password && (<div> yo some error {error.password}</div>)}
// because in case of false/0/null/'' js will return first operand in && condition
// and in case of true/or some value it will return last operand.

//this mehtod is used to get data from redux state and store into props
//here first argument is redux state and secind argument is this current component props, here second aguement is optional
const mapStateToProps = (state:any, ownProps:any) => {
  return {
    user: state.loginReducer.user
  };
};


//this mehtod is used to add acions  into props
//here first argument is redux dispatch
const mapDispatchToPrpos = (dispatch: any) => {
  return {
    // here we specify the name of the action(deletePost) and inside that we pass an object which contain type and id property
    //basically inside dipatch we specify our action object
    //this will add a method deletepost the props of this component
    set_user: (username: string)  => {
      dispatch(setuser(username));
    }
  };
};

//connect() is a hig order component which will take current compooent as argument.
// note: adding connect is optional, if you want state or dispatch actions as props then only use it, otherwse no need.

// here mapStateToProps always first argument and mapDispatchToPrpos will be second argument
export default connect(mapStateToProps,mapDispatchToPrpos)(Login);