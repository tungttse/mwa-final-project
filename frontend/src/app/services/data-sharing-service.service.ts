import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  public userCreatedNewBoard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
}
