import { createReducer, on, Action } from '@ngrx/store';
import * as authActions from './auth.actions';
import { Usuario } from 'src/app/models/usuario.model';
import { AppState } from 'src/app/app.reducer';

export interface State {
  user: Usuario;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer(initialState,
  on(authActions.setUser, (state, action) => ({ ...state, user: {...action.user} })),
  on(authActions.unSetUser, state => ({ ...state, user: null }))
);

export function authReducer(state, action: Action) {
  return _authReducer(state, action);
}
