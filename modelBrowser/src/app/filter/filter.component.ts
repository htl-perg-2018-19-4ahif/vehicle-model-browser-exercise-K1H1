import { Component, OnInit, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface IVehicle {
  id: number;
  year: number;
  make: string;
  model: string;
}



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  public url = 'https://vehicle-data.azurewebsites.net/api';

  public makeList: string[];
  public yearList: string[];

  @Output() public vehicleList: IVehicle[];


  // ngModel -> get input from the filter
  @Input() public make = '';
  @Input() public year = '';

  public offset = 0;




  constructor(private httpClient: HttpClient) { }


  ngOnInit() {
    // call function to get all the makes and years for the comboboxes
    this.getMake();
    this.getYear();


  }

  get hasNoNext() {

    if (this.vehicleList.length === 10) {
      return false;
    }

    return true;

  }

  async getMake() {
    const makes = await this.httpClient.get<string[]>(this.url + '/makes').toPromise();
    this.makeList = makes;
  }


  async getYear() {
    const years = await this.httpClient.get<string[]>(this.url + '/years').toPromise();
    this.yearList = years;

  }

  async refreshData() {
    if (this.make === '' && this.year === undefined) {
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.url + '/models?offset=' + this.offset + '&fetch=10').toPromise();
    }

    if (this.make === '' && this.year !== undefined) {    // filter after year
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.url + '/models?year=' + this.year + '&offset=' + this.offset + '& fetch=10').toPromise();
    }

    if (this.make !== '' && this.year === undefined) {     // filter after make
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.url + '/models?make=' + this.make + '&offset=' + this.offset + '&fetch=10').toPromise();
    }

    if (this.make !== '' && this.year !== undefined) {    // filter after make and year
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.url + '/models?make=' + this.make + '&year=' + this.year + '&offset=' + this.offset + '&fetch=10').toPromise();
    }
  }



  // show next ten models
  async next() {
    this.offset += 10;
    this.refreshData();
  }

  // show previous models
  async previous() {
    if (this.offset !== 0) {
      this.offset -= 10;
    }
    this.refreshData();

  }


}
