// created a action which we can dispatch later
export const setuser = (username:string) => {
    return {
        type: 'Login',
        username: username

    };
;}
