import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// axios is also like fetch command, but using axios we will
// create a interceptor, interceptor is like middleware. we can update
// request and response , or perorm some action while sending request of getting response.

// below we have created a interceptor  to check if access token is expired and then we will
// generate a new one using refresh token

const CusotomAxios = axios.create({});

CusotomAxios.interceptors.request.use(
    req=> {
        // Add access token automaticall to all request
        req.headers['x-access-token'] = sessionStorage.getItem('access_token');

        return req;},
    error=> {return Promise.reject(error);}
);



CusotomAxios.interceptors.response.use(
    res=> { 
        // check for user-access token expiry,if it is expired then get new access toke here itself, like we did below using refresh token
        // and then update store and sessionStorage
        // note: store token payload in redux store, from there we will fethc token expiry time and check expiry       
        return res;},
    err=>{
        const orginal_req = err.config;
        const status = err.response ? err.response.status: null;
        if (status==401){
            return axios.post(
                'auth/getTokenFromRefresh',{
                 refresh_token:localStorage.getItem('refresh_token')   
                }
            ).then(response=> {
                sessionStorage.setItem('acces_token', response.data.token);
                // callng orignal failed request again
                // todo: dispatch login action also to set user-details, if needed
                return CusotomAxios(orginal_req);
            }).catch(err=>{
                // if access new token request failes it means refreh token is expired.
                // so we will simply log out in that case
                localStorage.removeItem('refresh_token')
                // our persistent store
                localStorage.removeItem('persists:main-root')
                sessionStorage.removeItem('access_token')
                // todo: dispatch lougout action also if needed
                const nav = useNavigate();
                nav('/');
                
            })
        }
        return Promise.resolve(err);}
);

export default CusotomAxios;

// to use it, simply import it and then use below sample
// await CusotomAxios.get('uri');