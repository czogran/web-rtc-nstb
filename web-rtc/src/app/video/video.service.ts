import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  videoState: Subject<any> = new Subject()

  constructor() { }

  startVideoCall (){
    this.videoState.next('VIDEO')
  }
}
