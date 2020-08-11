import { Component, OnInit, Input } from '@angular/core';
import { random } from '@lodash';
import { CloudDevice } from '@app/definitions';

@Component({
  selector: 'app-output-pin-view',
  templateUrl: './output-pin-view.component.html',
  styleUrls: ['./output-pin-view.component.scss']
})
export class OutputPinViewComponent implements OnInit {

  @Input('device') public device: CloudDevice = null;
  public precent: any;
  public precentStyle: any;

  constructor() { }

  setPrecent(precent) {
    const increment = 360 / 100;
    const half = Math.round(100 / 2);
    let nextdeg = 0;
    let bgGradient = '';
    if (precent < half) {
        nextdeg = 90 + ( increment * precent );
        // tslint:disable-next-line:max-line-length
        bgGradient = 'linear-gradient(90deg, #f2f2f2 50%, transparent 50%, transparent), linear-gradient(' + nextdeg + 'deg, #777 50%, #f2f2f2 50%, #f2f2f2)';
    } else {
        nextdeg = -90 + ( increment * ( precent - half ));
        // tslint:disable-next-line:max-line-length
        bgGradient = 'linear-gradient(' + nextdeg + 'deg, #777 50%, transparent 50%, transparent), linear-gradient(270deg, #777 50%, #f2f2f2 50%, #f2f2f2)';
    }

    const styles = {
        'background-image': bgGradient
    };
    return styles;
  }


  round (input: any): Number {
    return Math.floor(input);
  }

  ngOnInit() {
    this.precent = random(20, 90);
    this.precentStyle = this.setPrecent(this.precent);
  }

}
