import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/share";
import { Observer } from "rxjs/Observer";

@Injectable()
export class RootScopeService {
  data: any;
  dataChange: Observable<any>;
  dataChangeObserver: Observer<any>;

  constructor() {
    this.dataChange = new Observable((observer: Observer<any>) => {
      this.dataChangeObserver = observer;
    });
  }

  setData(data: any) {
    this.data = data;
    this.dataChangeObserver.next(this.data);
  }
}
