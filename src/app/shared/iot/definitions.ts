import { IRole } from '@shared/core/definitions';

/**
 * A pin is any kind of I/O port of a device.
 * it has a type, which can be input, or output
 * also there is a unique id on device.
 * value, is the current status of device, can be TRUE,FALSE for digital
 * or can be a float number for analog data, such as temperature, humidity, light
 */
export interface IPin {
  type: any;
  id: any;
  value: any;
}

/**
 * A device is consisting an array of pins.
 */
export interface IDevice {
  uniqueid: string;
  pins: Array<IPin>;
}


export interface IWidgetForm {
  name: string;
  location: any;
}

/**
 * A place, defines the area of modules and infrustructure
 */
export interface ILocation {
  id: Number;
  name: string;
  icon: string;
  temperatureDevice: any;
  level: string;
}

export interface IPermission {
  title: string;
  key: string;
  group: string;
}

/**
 * Represents the application store structure
 */
export interface AppState {
  devices: Array<CloudDevice>;
  roles: Array<IRole>;
  locations: Array<any>;
  activities: Array<IActivity>;
}

/**
 * Occures when a device changes
 */
export enum ActivityTypes {
  DevicePinChange
}
/**
 * This represents if an activity occures in application
 */
export interface IActivity {
  id: Number;
  description: string;
  type: ActivityTypes;
  meta: any;
  icon: string;
  iconType: string;
  reason: string;
  time: string;
}


export interface IVPCInformation {
  administrator: string;
  administratorPassword: string;
  vpcname: string;
  vpcregion: string;
}
export interface WorkspaceUser {
  Email: string;
  Name: string;
  LastActivity: string;
  Access: string;
}

/**
 * Represents a change in device data, when happens inside a analog device reader;
 * such as temperature, pressure, and humidity.
 */

export enum TemperatureCustomization {
  SidebarRealTimeValue,
  SidebarLastWeekAverage
}

export interface IDeviceDisplayPreference {
  DisplayRealTimeTemperatureInSidebar?: boolean;
  DisplayAverageLastWeekInSidebar?: boolean;
}

export interface DataSource {
  device: string;
  value: any;
  geo?: {
    lat: number;
    lng: number;
  };
  date?: Date;
}

export enum CloudDeviceType {
  TemperatureSensor
}

export interface CloudDevice {
  id?: any;
  name?: string;
  datasource?: string;
  type: CloudDeviceType;
  description?: string;
  model?: string;
  location?: any;
  preferences: IDeviceDisplayPreference;
  value?: any;
}
