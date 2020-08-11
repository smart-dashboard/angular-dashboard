import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { IDialogConfiguration, IDialogResult } from '../interfaces/definitions';
import { NgMediaSelectorComponent } from '../components/ng-media-selector/ng-media-selector.component';
import { Subject } from 'rxjs';

@Injectable()
export class NgMediaService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  public open (configuration: IDialogConfiguration = null): IDialogResult {
    const componentRef = this.resolver.resolveComponentFactory(NgMediaSelectorComponent);
    const panel = componentRef.create(this.injector);
    this.appRef.attachView(panel.hostView);
    const domElm = (panel.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElm);
    panel.instance.subject = new Subject<any>();

    // panel.instance.image = item;
    // panel.instance.appRef = this.appRef;
    panel.instance._ref = panel;
    panel.instance.config = configuration;
    panel.instance.storage = configuration.storage;
    return {
      afterClose: function () {
        return panel.instance.subject.asObservable();
      }
    };
  }
}
