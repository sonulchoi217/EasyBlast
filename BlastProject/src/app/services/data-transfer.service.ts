import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface SVG {
  query_start: number;
  align_length: number;
  title: string;
  e_value: string;
  sbjct: string;
  sbjct_start: number;
  query: string;
  match: string;
  identities: number;
  gaps: number;
  positives: number;
  strand: string;
  frame: string;
  score: number;
}
export interface ResultData{
  name: string;
  hits: SVG[];
}

export interface QueryData{
  name: string;
  sequence: string;
  length: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {


  called = false;
  map = new Map();
  dataChanged = new Subject <ResultData[]>();
  queryUpdated = new Subject<QueryData[]>();
  detailUpdated = new Subject<string>();
  constructor() { }

  saveData(blastData){
    this.dataChanged.next(blastData);
  }

  query(queryData){
    this.queryUpdated.next(queryData);

  }

  storeData(seqName: string, info: [string, SVG]){
    this.map.set(seqName, info);
    console.log("storeData called")
    this.called =true;
  }
  

  getHitNames(){
    return this.map.keys();
  }

  getData (seqName: string): [string, SVG]{
    console.log("getData called")

    return this.map.get(seqName);
  }

  updateDetail(detailData){
    console.log("updated called"+detailData);
    this.detailUpdated.next(detailData);

  }

}
