import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  public totalIngresos: number;
  public totalEgresos: number;
  public countIngresos: number;
  public countEgresos: number;
  public ingresoEgresosSubscription: Subscription;

  // Doughnut
  public doughnutChartLabels: Label[] = ['Ingreso', 'Egreso'];
  public doughnutChartData: MultiDataSet = [[]];

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.ingresoEgresosSubscription =
      this.store.select('ingresoEgresos').subscribe(ingresoEgresos => {
        this.generarEstadistica(ingresoEgresos.items);
      });
  }

  ngOnDestroy(): void {
    if (!!this.ingresoEgresosSubscription) {
      this.ingresoEgresosSubscription.unsubscribe();
    }
  }

  public generarEstadistica(items: IngresoEgreso[]): void {
    this.totalIngresos = this.totalEgresos = this.countIngresos = this.countEgresos = 0;
    items.forEach(item => {
      switch (item.tipo) {
        case 'ingreso':
          this.countIngresos += 1;
          this.totalIngresos += item.monto;
          break;
        case 'egreso':
          this.countEgresos += 1;
          this.totalEgresos += item.monto;
          break;
      }
    });
    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }
}
