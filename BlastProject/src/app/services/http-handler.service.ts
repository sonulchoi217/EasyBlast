import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {

  constructor(private httpClient: HttpClient) {
   }
  
  sendSequence(data){
    console.log("request will send");
    return this.httpClient.post('http://localhost:8081/', data);
  }
}

