import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CloudDeviceType } from '@app/definitions';
import { Observable, Subscription } from 'rxjs';
import { IotModuleState } from '@app/iot/iot.module.defs';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {

  private ref: Subscription = null;
  @Input('statistics') public statistics: Array<{title: string, value: any}> = [];
  constructor(
    private store: Store<IotModuleState>,
  ) { }

  ngOnInit() {
    this.InitDefaultStatistics();
  }

  private InitDefaultStatistics () {
    if (this.statistics.length) {
      return;
    }
    this.ref = combineLatest(
      this.store.select('iotModule'),
    ).subscribe((sink) => {
      this.statistics = [];
      this.statistics.push({
        title: 'Devices',
        value: sink[0].devices.length
      });
      this.statistics.push({
        title: 'Locations',
        value: sink[0].locations.length
      });
      this.statistics.push({
        title: 'Temperatures',
        value: sink[0].devices.filter(x => +x.type === CloudDeviceType.TemperatureSensor).length
      });
      this.statistics.push({
        title: 'Lights',
        value: 0
      });
    });
  }

  ngOnDestroy () {
    if (this.ref) {
      this.ref.unsubscribe();
    }
  }

}
