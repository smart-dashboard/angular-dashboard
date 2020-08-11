import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { IResponse, IResponseErrorItem } from 'response-type';
import { ILocation, CloudDevice, ICloudDeviceDailyHistory, DataSource } from '@app/definitions';
import { random, times } from '@lodash';
import { TranslateService } from '@ngx-translate/core';
import { handleRoute, urlMatch, API } from '@app/common';
import { IotSvgService } from '@services/iot-svg/iot-svg.service';
import { IotDevices } from './iot-mocks';
const devices = IotDevices;
const validateLocation = (location: ILocation) => {
  const errors: Array<IResponseErrorItem> = [];
  if (!location.name) {
    errors.push({
      message: 'Please provide a name for location',
      location: 'name'
    });
  }
  if (!location.level) {
    errors.push({
      message: 'Please select a level',
      location: 'level'
    });
  }
  if (!location.icon) {
    errors.push({
      message: 'Please select an icon for location',
      location: 'icon'
    });
  }
  return errors;
};

@Injectable()
export class IotMockService {

  public handleRoute = handleRoute.bind(this);
  public urlMatch = urlMatch.bind(this);
  public routes = {
    [API.get('locations')]: 'getLocations',
    [API.get('devices/daily-history/:id')]: 'GetDeviceDailyHistory',
    [API.get('devices/token')]: 'getDevicesToken',
    [API.get('devices/day-history/:date/:id')]: 'GetDeviceDayHistory',
    [API.get('device/:id')]: 'getDevice',
    [API.get('devices')]: 'getDevices',
    [API.get('unconnected')]: 'getUnconnected',
    [API.post('device')]: 'postDevice',
    [API.post('location')]: 'postLocation',
    [API.delete('location/:id')]: 'deleteLocation',
    [API.delete('device/:id')]: 'deleteDevice',
  };

  constructor (
    private translate: TranslateService,
  ) {}

  public getLocations (): IResponse<any> {
    return {
      data: {
        items: [
          {
            id: 1,
            name: 'Kitchen',
            'icon': IotSvgService.kitchen,
            level: '2',
            temperatureDevice: 1
          },
          {
            id: 2,
            name: 'Bathroom',
            'icon': IotSvgService.pathtub,
            level: '3',
            temperatureDevice: 2
          },
          {
            id: 3,
            name: 'Master bedroom',
            'icon': IotSvgService.masterBedroom,
            level: '2',
            temperatureDevice: 1
          },
        ]
      }
    };
  }

  public GetDeviceDayHistory(req: HttpRequest<any>): IResponse<number> {
    return {
      data: {
        items: times(24 , () => random (10, 30)),
      }
    };
  }

  public deleteRole (req: HttpRequest<any>): IResponse<any> {
    return {
      data: {
        items: [
          {
          }
        ]
      }
    };
  }
  public getUnconnected (req: HttpRequest<any>): IResponse<DataSource> {
    return {
      data: {
        items: [
          {
            dataSourceId: 'device-36',
            date: new Date(),
            value: 22
          }
        ]
      }
    };
  }
  public getDevices (): IResponse<CloudDevice> {
    return {
      data: {
        items: devices
      }
    };
  }
  public getDevice (req: HttpRequest<any> , params): IResponse<CloudDevice> {
    const id = req.url.split('/').reverse()[0];
    return {
      data: {
        items: devices.filter(device => device.id === +id)
      }
    };
  }

  public postDevice( req: HttpRequest<any> ): IResponse<CloudDevice> {
    const device: CloudDevice = req.body;
    if (! device.id) {
      device.id = random(1000, 999999);
    }
    const validations = DeviceValidator(device);
    if (validations.length) {
      return {
        error: {
          message: 'Device cannot be created. Please currect the fields are highlighted',
          errors: validations,
          code: 34
        }
      };
    }
    return {
      data: {
        items: [
          device
        ]
      }
    };
  }
  public postLocation(req: HttpRequest<any>): IResponse<ILocation> {
    const location: ILocation = req.body;
    if ( ! location.id) {
      location.id = random(100, 9999);
    }
    if (validateLocation(location).length) {
      return {
        error: {
          message: 'Cannot create a device. Please fix the following issues',
          code: 294,
          errors: validateLocation(location)
        }
      };
    }
    return {
      data: {
        items: [
          {
            icon: location.icon,
            id: location.id,
            name: location.name,
            level: location.level,
            temperatureDevice: location.temperatureDevice
          }
        ]
      }
    };
  }

  public GetDeviceDailyHistory (req: HttpRequest<any>): IResponse<ICloudDeviceDailyHistory> {
    // const id = req.body.id;
    return {
      data: {
        items: [
          {
            date: new Date('2018-09-10'),
            average: 33.5
          },
          {
            date: new Date('2018-09-09'),
            average: 35.2
          },
          {
            date: new Date('2018-09-08'),
            average: 31.5
          }
        ]
      }
    };
  }

  public getDevicesToken (req: HttpRequest<any>): IResponse<any> {
    return {
      data: {
        items: [
          {
            hash: 'ei923040'
          }
        ]
      }
    };
  }
  public deleteDevice (req: HttpRequest<any>): IResponse<any> {
    return {
      data: {
        items: [
          {

          }
        ]
      }
    };
  }

  public deleteLocation (req: HttpRequest<any>): IResponse<any> {
    return {
      data: {
        items: [
          {

          }
        ]
      }
    };
  }
}



function DeviceValidator (device: CloudDevice) {
  const errors: Array<IResponseErrorItem> = [];

  if ( ! device.name) {
    errors.push({
      location: 'name',
      message: 'Device must have a name to be identified'
    });
  }
  if ( ! device.datasource) {
    errors.push({
      location: 'datasource',
      message: 'You must connect device to a data source'
    });
  }
  return errors;
}
