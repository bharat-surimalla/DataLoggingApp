import { Injectable } from '@angular/core'

@Injectable()
export class DuartionService {

  outBoundTimeStamps= [];
  eventTimeStamps=[];
  totalDurationByData : number =0;;
  constructor() { }

   durationBasedOnEvents(eventData:any, jsonData:any){

      var durationByEvent =0;
      var endTime = jsonData.endTime;

      for(let i=0;i<eventData.length;i++){
        
          if(eventData[i].eventType ==8){
            let x1 = new Date(eventData[i].timestamp).getTime();
            let x2 :number;
            let flag = 0;
            for(let j=i+1; j< eventData.length;j++){
              if(eventData[j].eventType == 6)
              {
                 x2 = new Date(eventData[j].timestamp).getTime();
                 flag=1;
                 break;
              }    
            }
            if(flag==0){
              x2= new Date(endTime).getTime();
            }
            this.eventTimeStamps.push({stamp:eventData[i].timestamp,duration:(x1-x2)/1000});
            durationByEvent = durationByEvent + ((x1-x2)/1000);
          }
          if(eventData[i].eventType ==7){
            let x1 = new Date(eventData[i].timestamp).getTime();
            let x2 :number;
            let flag = 0;
            for(let j=i+1; j< eventData.length;j++){
              if(eventData[j].eventType == 9)
              {
                 x2 = new Date(eventData[j].timestamp).getTime();
                 flag =1;
                 break;
              }
            }
            if(flag==0){
              x2= new Date(endTime).getTime();
            }   
            this.eventTimeStamps.push({stamp:eventData[i].timestamp,duration:(x1-x2)/1000});
            durationByEvent = durationByEvent + ((x1-x2)/1000);
          }
      }
      return durationByEvent;
  }

   durationBasedOnData(logData:any, settings:any, jsonData:any){

     let hum_max: number;
     let hum_min : number;
     let temp_min:number;
     let temp_max :number;
     let startTime = jsonData.startTime;
     let endTime = jsonData.endTime;
  
     settings.forEach((element:any)=> {
       if(element.channelName == 'sensor1')
       {
         hum_max = element.max;
         hum_min = element.min;
       }
       else if(element.channelName == 'sensor2')
       {
         temp_max = element.max;
         temp_min = element.min;
       }   
     });

     for(let i=0; i<logData.length; i++)
     {

      if(logData[i].channel == "sensor1")
      {
        if(logData[i].data>hum_max || logData[i].data < hum_min )
        {
         let x1 = new Date(logData[i].timestamp).getTime();
         let x2 : any;
         if(logData[i].timestamp == startTime || logData[i].timestamp == endTime)
         {  
          this.outBoundTimeStamps.push({stamp:(logData[i].timestamp),duration:480000}); 
         }
         else
         {
            for(let j=i-1; j>0;j-- )
            {
              if(logData[j].data<temp_max || logData[j].data >temp_min)
              {
                 x2 = new Date(logData[j].timestamp).getTime();     
                 this.outBoundTimeStamps.push({stamp:(logData[i].timestamp),duration:(x2-x1)}); 
                 break;
              }            
            }
          } 

        }
      }
      else if (logData[i].channel == "sensor2")
      {
        if(logData[i].data>temp_max || logData[i].data < temp_min )
        {
         let x1 = new Date(logData[i].timestamp).getTime();
         let x2 : any;
         if(logData[i].timestamp == startTime || logData[i].timestamp == endTime)
         {     
          this.outBoundTimeStamps.push({stamp:(logData[i].timestamp),duration:480000}); 
         }
         else
         {
            for(let j=i-1; j>0;j-- )
            {
              if(logData[j].data<temp_max || logData[j].data >temp_min)
              {
                 x2 = new Date(logData[j].timestamp).getTime();      
                 this.outBoundTimeStamps.push({stamp:(logData[i].timestamp),duration:(x2-x1)}); 
                 break;
              }            
            }
          }        
         }   
        }    
      }
      var uniqueItems = Array.from(new Set(this.outBoundTimeStamps));
      uniqueItems.forEach((element)=>{
        this.totalDurationByData = this.totalDurationByData + element.duration;
      });
      return (this.totalDurationByData/1000);    
   } 
   
}
