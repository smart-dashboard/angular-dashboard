import { Observable } from 'rxjs';
import { Storage } from '../services/storage';

export interface IRectangle {
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface IImage {
  $meta?: {
    selected: boolean;
    editing?: boolean;
  };
  id: string;
  name: string;
  src: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  title?: string;
  alt?: string;
  description?: string;
  caption?: string;
  createdAt?: Date;
  updatedAt?: Date;
  uploadedBy?: string;
}

export interface AppState {
  mediaItems: Array<any>;
  searchMediaItems: Array<IImage>;
}

export interface IEvent {
  type: 'SEARCH_START' | 'SEARCH_END' | 'SEARCH_CLEAR';
}

export interface ImageScale {
  width: number;
  height: number;
}

export enum IInteractionType {
  Edit, SingleSelect, MultipleSelect
}

export interface IDialogConfiguration {
  title?: string;
  interactionType?: IInteractionType;
  storage?: Storage;
}

export interface IDialogResult {
  afterClose(): Observable<string>;
}

export interface IFile {
  filename?: string;
  user?: number;
  id?: any;
  publicUrl?: string;
  diskname?: string;
  storage?: 'ng-cloud' | 's3';
}
