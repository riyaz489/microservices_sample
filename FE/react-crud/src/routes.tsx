import {Route, Routes} from 'react-router-dom';
import Login from './login/login';

import Audios from './components/audios/audios';
import Page404 from './pages/404page';
import Sample from './components/sample';
import InfiScroll from './components/infinitescroll';
// import Audio from './components/audio_eff/audio';
const Routers = (props:any) => (
    <Routes>
        <Route path="login" element={<Login firstName="shakira" {...props}/>} />
        <Route path="audios" element={<Audios/>} />
        <Route path="sample" element={<Sample/>} />

        <Route path="infi" element={<InfiScroll/>} />
        {/* <Route path="audio" element={<Audio/>} /> */}

        
        <Route path='*' element={<Page404  x={props.testNumber} /> } />
    </Routes>
)

export default Routers;

// now props are removed from Route tag encoded componenets, 
//so we can't use history prop inside route tagged componenets, like in sample, audios, etc we can't use 
// history prop, to navigae now we will either use, link (which will be used as html tag) or useNavigate, which will return
// callback to navigate to diff locations.
// const navigate = useNavigate();
  
// navigate("/home");
// navigate(-1)   // v5's history.go(-1) or history.goBack()
// navigate(1)    // v5's history.go(1) or history.goForward()
// navigate('/home', { replace: true }); // replace curent path with given path

// similarly navigate is html tag like link to perform smilar task
//<Navigate to="/dashboard" replace={true} />
// also withRouter is also depricated so we can use navigate in any function now
// but it's always better to use  hooks which is useNavigate