import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTransferService, ResultData, QueryData, SVG } from '../../services/data-transfer.service';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {

  resultData: ResultData[] = [];
  queryData: QueryData[] = [];
  loaded = false;
  resultTab = true;
  queryName = "";
  queryLength =1000;
  std = 1000;
  seqToDownload = {};
  selectedAllSelected = false;

  private subscription1: Subscription; //subscription for result data
  private subscription2: Subscription; //subscription for query data

  constructor(private dataTransferService: DataTransferService, private httpHandlerService: HttpHandlerService) { }

  ngOnInit() {
    console.log("created");

    this.subscription1 = this.dataTransferService.dataChanged.subscribe(
      (resultData: ResultData[]) =>{
        this.resultData = resultData;
        this.loaded = true;

        //update the values in dataTransferService
        for(let i=0; i<resultData.length; i++){
          for(let j=0; j<resultData[i].hits.length; j++){
            let parentName = resultData[i].name;
            let infoList: [string, SVG] = [parentName, resultData[i].hits[j]];
            this.dataTransferService.storeData(resultData[i].hits[j].title, infoList)
            this.seqToDownload[resultData[i].hits[j].title] = false;
            console.log("saving...")
          }
        }
      }
    );

    this.subscription2 = this.dataTransferService.queryUpdated.subscribe(
      (queryData: QueryData[]) =>{
        this.queryData = queryData;
        this.queryLength = queryData.length;
        this.loaded = true;
      }
    );
  }
  

  onTabClick(){
    this.resultTab = !this.resultTab;
  }

  onDetailClick(seqName){
    console.log("detail click here");
    this.dataTransferService.updateDetail(seqName);
    this.onTabClick();
  }
  onDownloadClick(){
    let fastaContent =""
    // "protein#" is used in the python server to perform the appropriate operation
    let accessionNumbersToSearch = "protein#"
    //regular expression finding the accession number from fasta header
    let regex = new RegExp('^[a-zA-Z0-9]*[_.][a-zA-Z0-9.]*$');
    let accessionNumberFound = false;
    let accessionNumber = "";

    for(let seqName in this.seqToDownload){
      //if the sequence is selected to be downloaded
      if(this.seqToDownload[seqName]){
        //find the parent name, split the fasta header by space and "|"
        let seqParent = this.dataTransferService.getData(seqName)[0];
        let seqSplit = seqName.split(/[ |]+/);
        accessionNumberFound = false;
        //find the accession number from the fasta header
        for(let splitSeq in seqSplit){
          if(regex.test(seqSplit[splitSeq])){
            accessionNumber = seqSplit[splitSeq];
            accessionNumberFound = true;
          }
        }
        //if accession number is found, add it to the string containing a list of parent name + accession number
        if(accessionNumberFound){
          accessionNumbersToSearch = accessionNumbersToSearch + seqParent + "&" + accessionNumber + "@";
        }
      }
    }

    this.httpHandlerService.sendSequence(accessionNumbersToSearch).subscribe(
      (response: string) => {
        let fastaFile = ""
        fastaFile= response;
        console.log(response);
        let blob = new Blob([fastaFile], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "result.fasta");


      },
      (error) => console.log(error)
    );
  }

  onSelectAll(){
    console.log("select all called");
    this.selectedAllSelected = !this.selectedAllSelected;
    if(this.selectedAllSelected){
      for(let seqName in this.seqToDownload){
        this.seqToDownload[seqName] = true;
      }
    }
    else{
      for(let seqName in this.seqToDownload){
        this.seqToDownload[seqName] = false;
      }
    }
  }

  //breaks down long piece of string into a string of length 80
  convertToFasta(inputString: string){
    let output = ""
    let over = false
    while(!over){
      if(inputString.length>80){
        output = output + inputString.substring(0, 80) + "\n"
        inputString = inputString.substring(80, inputString.length);
      }
      else{
        output = output + inputString
        over = true;
      }      
    }
    console.log(output);
    return output;
  }

  ngOnDestroy(){
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();

  }
  
  evalueToColor(evalue){
    let e_value: number = Number(evalue);
    let std = Number(1.83058e-90)

    let perc = 100 -  e_value * 50 /std

    return this.percTocolor(perc);
  }

  scoreToColor(score){
    if(score >= 200){
      return "#F97154";
    }
    else if(score >= 80){
      return "#CC54F9";
    }
    else if(score >= 50){
      return "#54F9A4";
    }
    else if(score >= 40){
      return "#5498F9";
    }
    else{
      return "#545C66";
    }
  }

  percTocolor(perc) {
    var r, g, b = 0;
    if(perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }
  

}
