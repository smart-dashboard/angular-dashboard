import { Component, OnInit } from '@angular/core';
import { IResponse } from 'response-type';
import { DataSource } from '@app/definitions';
import { environment } from 'environments/environment';
import { IsSuccessEntity } from '@app/common';
import { IotRequestsService } from '@app/iot/iot-requests.service';
declare var require: any;

@Component({
  selector: 'app-sending-information-https',
  templateUrl: './sending-information-https.component.html',
  styleUrls: ['./sending-information-https.component.scss']
})
export class SendingInformationHttpsComponent implements OnInit {

  public boardcastBodyExample: DataSource = {
    dataSourceId: 'device-1',
    value: 22.4,
    geo: {
      lat: 32.837298914,
      lng: 43.389482497
    }
  };
  public boardcastHeaderExample = {
    'x-token': '-token-',
  };
  public example: {
    dataSourceId?: string,
    value?: any
  } = {
    dataSourceId: 'device-1',
    value: 22.9
  };

  public boardcastResponseExample: IResponse<DataSource> = {
    params: {
      device: '3381947jjw',
      value: 22.4,
      geo: {
        lat: 32.837298914,
        lng: 43.389482497
      }
    } as any,
    data: {
      items: [
        {
          dataSourceId: '3920',
          geo: {
            lat: 32.837298914,
            lng: 43.389482497
          },
          value: 22.4
        }
      ],

    }
  };
  constructor(
    private requests: IotRequestsService,
  ) { }

  async ngOnInit() {
    const token = await this.requests.getDeviceToken();
    if (IsSuccessEntity(token)) {
      this.boardcastHeaderExample['x-token'] = token.data.items[0].hash;
    }
  }
  public ChangeExample () {
    this.boardcastBodyExample.dataSourceId = this.example.dataSourceId;
    this.boardcastBodyExample.value = this.example.value;
  }

  public GetUrl (affix: string) {
    return environment.api + environment.apiPrefix + '/' + affix;
  }

}
