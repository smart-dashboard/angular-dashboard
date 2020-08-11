import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudDevice, CloudDeviceType } from '@app/definitions';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IResponse } from 'response-type';
import { error } from '@app/common';
import { NotificationService } from '@app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

import { IotModuleState } from '@app/iot/iot.module.defs';
import { IotRequestsService } from '@app/iot/iot-requests.service';
import { ActionsService } from '@app/ng5-basic/actions.service';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-device-single',
  templateUrl: './device-single.component.html',
  styleUrls: ['./device-single.component.scss']
})
export class DeviceSingleComponent implements OnInit, OnDestroy {

  public isRequesting = false;
  public response: IResponse<CloudDevice> = null;
  public locations: Array<any> = [];
  public form: CloudDevice = {
    type: CloudDeviceType.TemperatureSensor,
    preferences: {},
  };

  public error = error;
  constructor(
    private route: ActivatedRoute,
    private store: Store<IotModuleState>,
    private router: Router,
    private actions: ActionsService,
    private requests: IotRequestsService,
    private notification: NotificationService,
    private translate: TranslateService,
  ) {
   }

  async ngOnInit() {
    combineLatest(
      this.store.select('iotModule'),
      this.route.params
    ).subscribe(([{devices}, params]) => {
       if (params.sourceId) {
        this.form.datasource = params.sourceId;
      }
      if ( ! params.id ) {
        return ;
      }
      this.form.id = params.id;
      const form = devices.find(dev => dev.id === +params.id);
      if (!form) {
        return;
      }
      this.form = Object.assign({}, form);
    }).unsubscribe();
    const device = await this.requests.getDevice(this.form.id);
    if ( device ) {
      this.form = device;
    }
  }
  ngOnDestroy () {

  }
  public IsTemperature () {
    return +this.form.type === CloudDeviceType.TemperatureSensor;
  }
  public IsLamp () {
    return +this.form.type === CloudDeviceType.LampBridge;
  }
  public IsHumidity () {
    return +this.form.type === CloudDeviceType.HumiditySensor;
  }
  public IsCo2 () {
    return +this.form.type === CloudDeviceType.CO2Sensor;
  }
  public async SubmitForm () {
    delete this.form.value;
    this.actions.scrollTop();
    this.isRequesting = true;
    const device = Object.assign({}, this.form);
    try {
      const response: IResponse<CloudDevice> = await this.requests.PostDevice(device);
      if (response.data && response.data.items && response.data.items[0]) {
        this.router.navigateByUrl('/devices');
        if (this.form.id) {
          this.notification.InvokeDeviceUpdate(response.data.items[0]);
        } else {
          this.notification.InvokeDeviceCreate(response.data.items[0]);
        }

      }
      this.response = response;
    } catch (error) {
      this.response = error;
    }
    this.isRequesting = false;
  }

  public DeleteDevice () {
    if (confirm( this.translate.get('Are you sure to delete this device?')['value'])) {
      this.requests.deleteDevice(this.form.id);
      this.notification.InvokeDeviceDelete(this.form);
      this.router.navigateByUrl('/devices');
    }
  }
  public DeviceGeneralChange (data: any) {
    this.form = Object.assign(this.form, data);
  }
  public DeviceCustomizationChange (value) {
    this.form.preferences = value;
  }

}
