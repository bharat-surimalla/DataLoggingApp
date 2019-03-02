import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DuartionService} from './duartion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  jsonData = {};
  eventData = {};
  logData = {};
  settings = {};
  durationByData : number;
  durationByEvents: number;
  constructor(private http: HttpClient,
              private duration : DuartionService
    ){

  }
  ngOnInit(){
    this.http.get('./assets/tripdata.json').subscribe((res:any)=>{
        this.jsonData = res;
        this.eventData = res.tripUploadEvents;   
        this.logData = res.tripUploadData;
        this.settings = res.tripSettings;
        this.durationByEvents = this.duration.durationBasedOnEvents(this.eventData, this.jsonData); 
        this.durationByData =this.duration.durationBasedOnData(this.logData, this.settings,this.jsonData);
    
    });
  }
}




