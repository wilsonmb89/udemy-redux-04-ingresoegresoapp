import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ngrx/ui.reducer';
import * as auth from './auth/ngrx/auth.reducer';

export interface AppState {
  ui: ui.State;
  user: auth.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  user: auth.counterReducer
};
