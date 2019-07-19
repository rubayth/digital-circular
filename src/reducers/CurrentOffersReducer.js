import { UPDATE_OFFERS } from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case UPDATE_OFFERS:
            return action.payload || false;
        default: return state;
    }
}