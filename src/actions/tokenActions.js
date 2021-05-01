import {
    TOKEN_REQUEST,
    TOKEN_REQUEST_SUCCESS,
    TOKEN_REQUEST_FAIL
} from '../constants/tokenConstants';

import Firebase from 'firebase';

// TODO: put data in .env file
const firebaseConfig = {
    apiKey: "AIzaSyBOY25NETibN4tsg9znW3oD20ix1AhYUOA",
    authDomain: "pawnchain-d761c.firebaseapp.com",
    databaseURL: "https://pawnchain-d761c-default-rtdb.firebaseio.com",
    projectId: "pawnchain-d761c",
    storageBucket: "pawnchain-d761c.appspot.com",
    appId: "1:299850907196:web:e527badad8242f6f7b8d39"
};

Firebase.initializeApp(firebaseConfig);

export const listTokens = () => async (dispatch) => {
    try {
        dispatch({ type: TOKEN_REQUEST })
        
        Firebase.database()
            .ref('/')
            .once('value')
            .then(snapshot => dispatch({
                type: TOKEN_REQUEST_SUCCESS,
                payload: snapshot.val()
            }))
            .catch(error => {
                dispatch({
                    type: TOKEN_REQUEST_FAIL,
                    payload: error.response && error.response.data.message 
                                ? error.response.data.message 
                                : error.message
                })
            })
    } catch (error) {
        dispatch({
            type: TOKEN_REQUEST_FAIL,
            payload: 
                error.response && error.response.data.message 
                    ? error.response.data.message 
                    : error.message
        })
    }
}
