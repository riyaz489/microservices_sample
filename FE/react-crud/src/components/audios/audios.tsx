// just import css and it will be automatcaly loaded to your componenet
import { useEffect, useRef, useState } from 'react';
import './audios.scss';
import { useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';

// states lifecycle are till component is rendered once it's unmount states will be destroyed.
//React components automatically re-render whenever there is a change in their state or props.
// so if we change state inside useEffect function, then react will infinitely do rendering and keeps calling useEffect infinitely.
// so to avoid that either pass a second argument in useEffect or or use some normal datatype list, number etc,like we used below 'k'.
const Audios = ()=>  {
    const k =[1,2,3,4,5,6,7,8,9,11];
    const [audios_data, set_audios] = useState([]);
    // const [page_no , set_pageNo] = useState<number[]>([]);
    const [page_no , set_pageNo] = useState<number>(1);
    const [audio_id, set_audio] = useState<number>();
    var [wavesurfer, set_wavesurefer] = useState<WaveSurfer>();
    
    // in above line we are type casting s from never list to inetger list
    // example 
    // let x: unknown = 'hello';
    //console.log((<string>x).length);

    var contet_type: string|null; 
    var audio_src:Array<ArrayBuffer> = [];
    async function  get_aaray_bufer_from_url(){
        // const audio_src = blob4.addSourceBuffer('audio/mpeg');
         await fetch('https://cdn.pixabay.com/download/audio/2022/02/18/audio_bf80c561fe.mp3?filename=always-with-me-always-with-you-piano-long-21257.mp3').then(
                res=>{

                    if (res.headers.has('content-type')){
                         contet_type = res.headers.get('content-type')}


                    return res.arrayBuffer();
                    // it will download audio in chunks, whenever we receive new data this will be called
                    }).then(function(audio_data){
                        audio_src.push(audio_data)
                        // console.log(audio_url) // in case of audio url it will automatically create a audio tag indside div
                        
                    });
        
        
        
    }


    const nav = useNavigate();
    //useeffect is Similar to componentDidMount and componentDidUpdate hooks and f we return a function inide it ,it will do th job of unmoinct as well:
    // as we can't pass aync directly to useEffetc, so we created a async inside normal func and called it
    // second argument in useeffect is optional(second argument accepts list), if we don't pass anything then it will be called mount and update of componenet, i.e in each render
    // if we pass empty list then useEffect will be called only in mount, i.e only in first render.
    // if we pass any item in second argument as list, then effect func will be called on first render and when that item value is updated.
    // let's say we passed [temp1,temp2], so whenever temp1 or temp2 changes then effect will be called
    useEffect(()=> {(
        async ()=> {
            
        // const audio =  await fetch('https://cdn.pixabay.com/download/audio/2022/02/18/audio_bf80c561fe.mp3?filename=always-with-me-always-with-you-piano-long-21257.mp3').then(
        //     res=>{

        //         // to download large files with streaming, this saves ram //////////////////////////////
        //         const contentDisposition = res.headers.get('Content-Disposition');
        //         fileName = contentDisposition?.substring(contentDisposition.lastIndexOf('=') + 1);
        //         // If the WritableStream is not available (Firefox, Safari), take it from the ponyfill
        //         if (!window.WritableStream) {
        //             streamSaver.WritableStream = WritableStream;
        //             window.WritableStream = WritableStream;
        //         }
        //         const filestream = streamSaver.createWriteStream(fileName? fileName:'test.mp3');
        //         const readableStream = res.body;

        //         if (readableStream?.pipeTo){
        //             return readableStream.pipeTo(filestream);
        //         }
        //         const writer = filestream.getWriter();
        //         const reader = res.body?.getReader();
        //         function pump  () { 
        //         reader?.read()
        //             .then(res => 
        //                 res.done? writer.close() : writer.write(res.value).then(pump));}

        //         pump();
        //     });
            

        const audio_elem = document.querySelector('#waveform');
        if (audio_elem){

            // if I don't put await in  below line then it won't wait for get_aaray... function to complete and start running below code
            // then again i forced to put await in fetch of get_aaray_bufer_from_url, otherwise it will go inside get_aaray_bufer_from_url
            // and saw fetch() does not have await and come out from get_aaray_bufer_from_url and execute fetch later. so as of now then()
            // inside get_aaray_bufer_from_url  does not make any sense, but I just kep it there for learning purpose(to see how then() syntax look like)
            // which is creating blob and loading audio
            await get_aaray_bufer_from_url();
            console.log(contet_type)
            var content_type = ''
            if (contet_type) content_type=contet_type

            const audio_bob = new Blob(audio_src,{type: content_type})
            const audio_src_url = URL.createObjectURL(audio_bob);
            wavesurfer?.load(audio_src_url);
            // we can directly pass audio url as well to above load funtion
            console.log(audio_src_url);
            


        // while (! wavesurfer?.isReady) console.log(wavesurfer);
        wavesurfer?.on('finish', ()=>{
            const play_btn = document.querySelector('#playbtn');
            if (play_btn?.innerHTML.includes('pause')){
                play_btn.innerHTML = 'play_arrow';
            }
        })
    }

        // wavesurfer?.on('ready', function () {wavesurfer.play();});
            
            
            // await is alternative of .then()  promise, we can use either then() or await to fetch data from async func 
            //(note: we can use await and then() both togeather but then then() will make no sense as we are waiting for output)
            // if we are using await then it will wait for this current function to complete and then only it will run below lines,
            // and meanwhile it will run other outer functions. (when the function execution encountered an await then other function is given a chance to execute untill await in encountered.)
            // if we don't use await, then code below this line will run and now to fetch result from this function we need to use then() function,
            // then() will accept callback and it's arg is result of main function
            // const res = await fetch('http://localhost:8000/api/ prod');
            // const data = await res.json();
            // set_audios(data);
            
            // in python we are restrcited to use async in method def if we are using await inside body and we can't call async ethod without await, so ultimately all chained
            // methods become async, in python also with await keyword we current method will stop there, then other methods which are present in our asynio loop will get chance to run
        } )();
    }, [wavesurfer]);

    // we can call async functions directly from inside html elements as well
    // unlike python we can use await in front of any function we want to wait.
    // also it not mandatory to await for async funcitons like we did in python
    // i.e below function can be called directly like this: `del(1)`and we can do this as well `await del(1)`
    const del = async(id:number) => {
        await fetch(`http://localhost:8000/api/products/${id}`, {method: 'DELETE'});

    }
    const showDiv = (audio_id:number)=>{
        const pop_up = document.querySelector('#popup1');
        pop_up?.classList.add('show');
        const x= WaveSurfer.create({
            container: '#waveform',
            waveColor: '#dde5ec',
            progressColor: '#03cebf',
            barWidth: 2,
            height:80,
            responsive:true,
            partialRender:true,
            hideScrollbar: true,
            barRadius: 4,
            maxCanvasWidth: 10
        
        })
        // setting state and creating will take som time, plus we need to re-render once waveform is added to dom, so to do that
        // we set waveform obj in state and created a useEffect hook who will monitor this wveform state value and once it is changed
        // then it will load audio. 
        set_wavesurefer(x);
        set_audio(audio_id);
        
    
    }
    const hideDiv = ()=>{
        const pop_up = document.querySelector('#popup1');
        pop_up?.classList.remove('show');
        wavesurfer?.destroy();
        set_wavesurefer(undefined);

    }


    
const play_func = ()=>{
    wavesurfer?.playPause();
    const play_btn = document.querySelector('#playbtn');
    if (play_btn?.innerHTML.includes('play_arrow')){
        play_btn.innerHTML = 'pause';
    }
    else{    
        if(play_btn)  play_btn.innerHTML = 'play_arrow';
    }

}
const stop_func = ()=>{
    console.log('stop!!!!!!!!!!!!!!')
    wavesurfer?.stop();
    const play_btn = document.querySelector('#playbtn');
    if (play_btn?.innerHTML.includes('pause')){
        play_btn.innerHTML = 'play_arrow';
    }
    
}
//
const vol_func = ()=>{
    wavesurfer?.toggleMute();
    const play_btn = document.querySelector('#volumebtn');
    if (play_btn?.innerHTML.includes('volume_up')){
        play_btn.innerHTML = 'volume_mute';
    }
    else{    
        if(play_btn)  play_btn.innerHTML = 'volume_up';
    }
}



    // we can do only js function calls inside below tsx html code
    return (<div className='audio_page'>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />


        <div className="content">
      
            <div className="row">
                {/* in react it is mandatory to pass unique key in iterating html elements */}
            {k.map( (p:number) =>{return (

                    <div key={p} className="card col-md- " onClick={()=>showDiv(p)}>
                                
                    <div className="icon"><i className="material-icons md-36">library_music</i></div>
                    <p className="title">Profile</p>
                    <p className="text">Click to see or edit your profile page.</p>

        </div>

            )})
            

        
}

</div> 
   </div>



   

{/* hidden part */}
<div id="popup1"  className="overlay">
	<div className="popup">
		<a className="close" onClick={hideDiv}>&times;</a>
		
        
        <div className='music-container content2'>      
        <div className='music'>
            <img src="song.png" />
            <div className='info'>
                <h2>yo {}</h2>
                <p>Pulished on - {}</p>
                < div id='waveform' ></div>
                <div className='controls'>
                <i className="material-icons md-36" id='playbtn' onClick={play_func}>play_arrow</i>
                <i className="material-icons md-36" id='stopbtn' onClick={stop_func}>stop</i>
                <i className="material-icons md-36" id='volumebtn' onClick={vol_func}>volume_up</i>
                </div>
                
            </div>
        </div>
    </div>


	</div>
</div>



</div>)
};

export default Audios;
