import { SET_POSITION } from '../constants/positionConstants';

export const positionReducer = (state = { position: '' }, action) => {
    switch (action.type) {
        case SET_POSITION:
            return { position: action.payload }
        default:
            return state;
    }
}