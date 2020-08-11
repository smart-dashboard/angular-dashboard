import { Injectable } from '@angular/core';
import {
  CloudDevice,
  ICloudDeviceDailyHistory,
  ILocation
 } from '@app/definitions';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { IotMockService } from './iot-mocks.service';
import { IResponse } from 'response-type';
import { GetNetworkError, IsSuccessEntity, GetUrl } from '@app/common';
import { IotModuleState } from '@app/iot/iot.module.defs';
import { random } from '@lodash';

declare var io: any;

@Injectable()
export class IotRequestsService {
  constructor(
    private mocks: IotMockService,
    private store: Store<IotModuleState>,
    private http: HttpClient,
  ) { }

  public getLocations() {
    this.http.get(GetUrl('locations')).subscribe(
      (response: any) => {
        const collections = response.data.items;
        for (const item of collections) {
          this.store.dispatch({
            type: 'UPDATE_LOCATION',
            payload: item
          });
        }
      },
      (response) => {
      }
    );
  }
  public getUnconnected () {
    this.http.get(GetUrl('unconnected')).subscribe(
      (response: any) => {
        const collections = response.data.items;
        for (const item of collections) {
          this.store.dispatch({
            type: 'UPDATE_UNCONNECTED_DATA_SOURCE',
            payload: item
          });
        }
      },
      (response: any) => {
      },
    );
  }

  public async getDevice (id: number) {
    try {
      const response: IResponse<CloudDevice> = await (this.http.get(GetUrl('device/' + id)).toPromise());
      const collections = response.data.items;
      for (const item of collections) {
        this.store.dispatch({
          type: 'UPDATE_DEVICE',
          payload: item
        });
      }
      return collections[0];
    } catch (error) {

    }
  }
  public getDevices () {
    this.http.get(GetUrl('devices')).subscribe(
      (response: any) => {
        const collections = response.data.items;
        for (const item of collections) {
          this.store.dispatch({
            type: 'UPDATE_DEVICE',
            payload: item
          });
        }
      },
      (response: any) => {
      },
    );
  }

  public async GetDeviceDayHistory(id: number, date: Date): Promise<IResponse<number>> {
    const url = GetUrl('devices/day-history/' + date + '/' + id);
    const ref = this.http.get(url).toPromise();
    try {
      const response: IResponse<number> = await ref;
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }

  public async getDeviceDailyHisotry (id: number): Promise<IResponse<ICloudDeviceDailyHistory>> {
    const url = GetUrl('devices/daily-history/' + id);
    const ref = this.http.get(url).toPromise();
    try {
      const response: IResponse<ICloudDeviceDailyHistory> = await ref;
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }


  public async PostDevice (device: CloudDevice): Promise<IResponse<CloudDevice>> {
    const ref = this.http.post(GetUrl('device') , device).toPromise();
    try {
      const response: IResponse<CloudDevice> = await ref;
      if (response && response.data && response.data.items && response.data.items[0]) {
        const $device = response.data.items[0];
        if ($device) {
          this.store.dispatch({
            type: 'UPDATE_DEVICE',
            payload: $device
          });
          this.store.dispatch({
            type: 'CLEAR_UNCONNECTED_SOURCE',
            payload: $device.datasource
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }

  public async PostLocation (location: ILocation): Promise<IResponse<ILocation>> {
    const ref = this.http.post(GetUrl('location') , location).toPromise();
    try {
      const response: IResponse<ILocation> = await ref;
      if (IsSuccessEntity(response)) {
        const $location = response.data.items[0];
        if (! $location.id) {
          $location.id = random(1000, 999999);
        }
        if ($location) {
          this.store.dispatch({
            type: 'UPDATE_LOCATION',
            payload: $location
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  async deleteLocation (id: number ) {
    const ref = this.http.delete(GetUrl('location/' + id)).toPromise();
    try {
      const response: IResponse<ILocation> = await ref;
      if (IsSuccessEntity(response)) {
        const $location = response.data.items[0];
        if (! $location.id) {
          $location.id = random(1000, 999999);
        }
        if ($location) {
          this.store.dispatch({
            type: 'DELETE_LOCATION',
            payload: id
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  async deleteDevice (id: number ) {
    const ref = this.http.delete(GetUrl('device/' + id)).toPromise();
    try {
      const response: IResponse<ILocation> = await ref;
      if (IsSuccessEntity(response)) {
        const $location = response.data.items[0];
        if (! $location.id) {
          $location.id = random(1000, 999999);
        }
        if ($location) {
          this.store.dispatch({
            type: 'DELETE_DEVICE',
            payload: id
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  async getDeviceToken (): Promise<IResponse<any>> {
    return await this.http.get(GetUrl('devices/token')).toPromise();
  }

  async changeComplexBoardOutput (dataSourceId, pin, value): Promise<IResponse<any>> {
    const data = {
      dataSourceId, pin, value
    };
    return await this.http.post(GetUrl('devices/complex-terminal'), data).toPromise();
  }

  async createHash ({description}): Promise<IResponse<any>> {
    const data = {
      description
    };
    return await this.http.post(GetUrl('hashtable'), data).toPromise();
  }

}
