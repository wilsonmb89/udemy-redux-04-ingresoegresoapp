import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ngrx/ui.reducer';
import * as auth from './auth/ngrx/auth.reducer';
import * as ingresoEgreso from './ingreso-egreso/ngrx/ingreso-egreso.reducer';

export interface AppState {
  ui: ui.State;
  userData: auth.State;
  ingresoEgresos: ingresoEgreso.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  userData: auth.counterReducer,
  ingresoEgresos: ingresoEgreso.ingresoEgresoReducer
};
