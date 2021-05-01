import { SET_POSITION } from '../constants/positionConstants';

export const setPosition = (position) => async (dispatch) => {
    try {
        dispatch({ 
            type: SET_POSITION, 
            payload: position
        })
    } catch (err) {
        console.log(err);
    }
}