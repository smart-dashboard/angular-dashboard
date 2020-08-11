import { IImage } from '../interfaces/definitions';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { merge } from 'lodash';

export class Storage {

  private subject: Subject<any> = null;
  private searchSubject: Subject<any> = null;
  private items: Array<IImage> = [];
  private search: Array<IImage> = [];

  constructor (hash: string = null) {
    this.subject = new Subject();
    this.searchSubject = new Subject();
  }

  public ResetItems (items: Array<IImage> = []) {
    this.items = items;
    this.subject.next(this.items);
  }

  public GetSearcher (): Observable<any> {
    return this.searchSubject.asObservable();
  }
  public GetSubsriber (): Observable<any> {
    return this.subject.asObservable();
  }
  public DeleteItem(image: IImage) {
    this.items =  this.items.filter(x => x.id !== image.id);
    this.subject.next(this.items);
  }
  public UpdateItem(image: IImage) {
    this.items = this.items.map(item => {
      if (item.id === image.id) {
        return merge(item, image);
      }
      return item;
    });
    this.subject.next(this.items);
  }
  public CreateItem(image: IImage) {
    this.items = [image].concat(this.items);
    this.subject.next(this.items);
    this.subject.next(this.items);
  }
  /**
   * Updates all modules that are listening to the products
   */
  public forceRefresh () {
    this.subject.next(this.items);
  }
  public ResetSearch (items: Array<IImage> = []) {
    this.search = items;
    this.searchSubject.next(items);
  }
}
