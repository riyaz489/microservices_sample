const rootReducer = (state={user:null}, action:any)=>{
// whenever dispatcher is called, then this method is called and choose appropriate dispatch action and change global states
    if (action.type === "Login"){
        var user_name = action.username
        return {
            ...state,
            user: user_name
        };
    }
// return updated state
return state;
};


export default rootReducer;