import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataTransferService, ResultData, SVG } from 'src/app/services/data-transfer.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {

  subscription1: Subscription;
  loaded = false;

  subscription: Subscription;
  sequenceName: string;
  parentName: string;
  result: SVG;
  sequenceArray: string[];
  queryArray: string[]
  matchArray: string[]
  constructor(private route: ActivatedRoute, private dataTransferService: DataTransferService) { }

  ngOnInit() {
    // this.subscription = this.route.params.subscribe(params => {
    //   this.sequenceName = params['sequenceName']
    // })

    // this.requestData(this.sequenceName);
    console.log("Detail loaded");
    this.subscription1 = this.dataTransferService.detailUpdated.subscribe(
      (sequenceName: string) =>{
        this.sequenceName = sequenceName;
        this.requestData(this.sequenceName);
        console.log(this.sequenceName);
        this.loaded = true;
      }
    );
  }

  requestData(seqName: string){

    let data: [string, SVG]  = this.dataTransferService.getData(seqName);
    console.log("HIHIHI");
    console.log(data);

    this.parentName = data[0];
    this.result = data[1];

    this.sequenceArray = this.divideLongSequence(this.result.sbjct);
    this.queryArray = this.divideLongSequence(this.result.query);
    this.matchArray = this.divideLongSequence(this.result.match);

  }

  divideLongSequence(input){
    console.log(input)
    return input.match(/.{1,80}/g);

  }

  ngOnDestroy(){
    //this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
  }

}
