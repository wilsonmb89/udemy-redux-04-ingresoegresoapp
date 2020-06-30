import { createReducer, on, Action } from '@ngrx/store';
import * as actions from './ingreso-egreso.actions';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

export interface State {
  items: IngresoEgreso[];
}

export const initialState: State = {
  items: []
};

const _ingresoEgresoReducer = createReducer(initialState,
  on(actions.addItem, (state, props) => ({ ...state, items: [...state.items, {...props.item}] })),
  on(actions.setItems, (state, props) => ({ ...state, items: [...props.items] })),
  on(actions.unSetItems, state => ({...state, items: []}))
);

export function ingresoEgresoReducer(state, action: Action) {
  return _ingresoEgresoReducer(state, action);
}
