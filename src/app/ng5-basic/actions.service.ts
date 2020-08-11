import { Injectable } from '@angular/core';
declare var SimpleBar: any;

@Injectable()
export class ActionsService {
  public scrollTop () {
    console.log('#5');
    try {
      const el = new SimpleBar(document.getElementById('layout'));
      el.scrollContentEl.scrollTop = 0;
    } catch (error) {
      // intentionally empty
    }
    console.log('#6');

  }
}
