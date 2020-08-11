import { Injectable, ApplicationRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { CloudDevice, DataSource } from '@app/definitions';
import { random, isNumber } from '@lodash';
import { environment } from 'environments/environment';
import { IsDataSource, GetUrl } from '@app/common';
import { NotificationService } from '@app/services/notification.service';
import { IotModuleState } from '@app/iot/iot.module.defs';
import { IotRequestsService } from './iot-requests.service';
(window as any).global = window;

declare var Pusher: any;

declare var require: any;
let io: any = {};
io = require('sails.io.js')( require('socket.io-client') );
if ( ! environment.production) {
  io.sails.autoConnect = true;
}

window['io'] = io;

@Injectable()
export class RealtimeService {

  public channel: any = null;
  public devices: Array<CloudDevice> = [];
  public unconnectedDevices: Array<DataSource> = [];
  constructor(
    private store: Store<IotModuleState>,
    private ref: ApplicationRef,
    private requests: IotRequestsService,
    private notification: NotificationService,
  ) {
    this.store.select('iotModule').subscribe(({devices}) => {
      this.devices = devices;
    });
  }

  public ActivateRealtime () {
    if (environment.production) {
      this.StartSailsSocket();
    } else {
      this.ActivateMockIncomingMessages();
    }
  }
  /**
   * For people who have developed their backend service in sails.js
   */
  public StartSailsSocket () {
    // io.sails.url = environment.socket;
    // io.sails.useCORSRouteToGetCookie = false;
    io.sails.url = 'https://iot.pixelplux.com';
    // io.sails.path = '/api-iot/socket.io';
    io.sails.autoConnect = true;
    io.socket.on('DataSourceChange', (data: DataSource) => {
      if (!IsDataSource(data)) {
        console.warn('Recieved a data source which is not valid: ', data);
        return false;
      }
      this.RecieveDataSourceIncoming(data);
    });
  }

  async connectToRoom (token) {
    console.log('Requesting to get a room:', token);
    const options = {
      url: GetUrl('get/a/room'),
      method: 'get',
      headers: {
        'x-token': token
      }
    };
    io.socket.request(options, (data) => {
      console.log('Connected to room!');
      this.notification.InvokeRoomConnect();
    });
  }

  /**
   * For development purposes, we simulate the incoming messages from server socket.
   */
  protected ActivateMockIncomingMessages () {
    setInterval(() => {
      this.MockDataIncome();
    }, 1000);
  }

  /**
   * Whenever for any sort of reason if the device is changed, either by user details changes
   * api call for value change, and a cron job, all instances of the the dashboard will recieve this function
   */
  public RecieveDeviceChange (device: any) {
    this.store.dispatch({
      type: 'UPDATE_DEVICE',
      payload: device
    });
  }

  public RecieveDataSourceIncoming (data: DataSource) {

    if (!data.date) {
      data.date = (new Date()).getTime() as any;
    }
    if (!isNumber(data.value)) {
      data.value = +data.value;
    }
    const deviceWithThisSource = this.devices.find(x => x.datasource === data.dataSourceId);
    if ( ! deviceWithThisSource) {
      this.store.dispatch({
        type: 'UPDATE_UNCONNECTED_DATA_SOURCE',
        payload: data
      });
    } else {
      this.store.dispatch({
        type: 'DEVICE_GET_DATA_SOURCE',
        payload: data
      });
    }
    this.ref.tick();
  }

  public MockDataIncome () {
    const data: DataSource = {
      date: new Date(),
      value: random (1100, 1799) / 100,
      geo: {
        lat: 22,
        lng: 21
      },
      dataSourceId: 'device-' + random(1, 2)
    };
    this.RecieveDataSourceIncoming(data);
  }

  /**
   * @description triggers when user wants to change a complex board (boards having more than one I/O)
   * using socket.io/mqtt protocol.
   */
  public ChangeComplexOutputValue (deviceDataSourceId, pin, value) {
    this.store.dispatch({
      type: 'UPDATE_COMPLEX_DEVICE',
      payload: {
        device: deviceDataSourceId,
        pin,
        value
      }
    });
    this.requests.changeComplexBoardOutput(deviceDataSourceId, pin, value).then((response) => {
    }). catch(error => {
      console.error('Errro on sending data');
    });
  }
}
