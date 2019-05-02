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

  // used for angular material table:
  displayedColumns: string[] = ['id', 'year', 'make', 'model'];

  public vehUrl = 'https://vehicle-data.azurewebsites.net/api/models?';
  public filterUrl = 'https://vehicle-data.azurewebsites.net/api';

  public makeList: string[] = [];
  public yearList: string[] = [];

  public vehicleList: IVehicle[] = [];


  // ngModel -> get input from the filter
  public make = '';
  public year = '';

  public offset = 0;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // call function to get all the makes and years for the comboboxes
    this.getMake();
    this.getYear();

    this.refreshData();
  }

  async getMake() {
    const makes = await this.httpClient.get<string[]>(this.filterUrl + '/makes').toPromise();
    this.makeList = makes;
  }

  async getYear() {
    const years = await this.httpClient.get<string[]>(this.filterUrl + '/years').toPromise();
    this.yearList = years;

  }

  async refreshData() {
    if (this.make !== '' && this.year !== undefined) {
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.vehUrl + 'make=' + this.make + '&year=' + this.year + '&offset=' + this.offset + '&fetch=10').toPromise();
    }

    if (this.make === '' && this.year === undefined) {
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.vehUrl + 'offset=' + this.offset + '&fetch=10').toPromise();
    }

    if (this.make === '' && this.year !== undefined) {

      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.vehUrl + 'year=' + this.year + '&offset=' + this.offset + '& fetch=10').toPromise();
    }

    if (this.make !== '' && this.year === undefined) {
      // tslint:disable-next-line:max-line-length
      this.vehicleList = await this.httpClient.get<IVehicle[]>(this.vehUrl + 'make=' + this.make + '&offset=' + this.offset + '&fetch=10').toPromise();
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

  // function for disabeling buttons
  get hasNext() {
    if (this.vehicleList.length === 10) {
      return false;
    }
    return true;
  }


}
