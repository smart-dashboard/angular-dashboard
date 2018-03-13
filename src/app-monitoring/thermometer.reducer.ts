import { Action } from '@shared/core/definitions';
import UpdateOrInsert from '@shared/core/functions/UpdateOrInsert';

export function thermometerReducer (state = [], action: Action) {
    switch (action.type) {
        case 'UPDATE_THERMOMETER':
            return UpdateOrInsert(action.payload , state, 'id');
        case 'INSERT_THERMOMETER':
            return state.concat(action.payload);
    }
    return state;
}
