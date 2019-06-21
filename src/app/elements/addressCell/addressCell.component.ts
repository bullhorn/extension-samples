import { Component, Input, OnInit } from '@angular/core';
import { Address } from '@bullhorn/bullhorn-types';
import { StateUtil } from '../../util/stateUtil';

@Component({
  selector: 'app-address-cell',
  styleUrls: ['./addressCell.component.scss'],
  template: `
    <div class="address-cell">{{addressString}}</div>
  `,
})
export class AddressCellComponent implements OnInit {
  @Input() address: Address;
  addressString = '';

  constructor() {}

  private static isValid(addressComponent: string): boolean {
    return addressComponent && addressComponent !== 'null' && addressComponent !== 'undefined';
  }

  ngOnInit(): any {
    if (AddressCellComponent.isValid(this.address.city)) {
      this.addressString += this.address.city;
      if (AddressCellComponent.isValid(this.address.state)) {
        this.addressString += ', ';
      }
    }
    if (AddressCellComponent.isValid(this.address.state)) {
      this.addressString += StateUtil.getAbbreviation(this.address.state);
    }
  }
}
