import { Component, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { HttpHandlerService } from '../../services/http-handler.service';
import { DataTransferService, ResultData, QueryData } from '../../services/data-transfer.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';


export interface Result{
  list: ResultData[];
  query: QueryData[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('f') fileUploadForm: NgForm;
  fileString;


  database;
  data;

  constructor(
    private httpHandlerService: HttpHandlerService, 
    private dataTransferService: DataTransferService, 
    private router: Router
    ) { }

  ngOnInit() {
    this.database = {
      Excavata: true,
      SAR: true,
      Amoebozoa: true,
      Other: true,
      Opisthokonts: true,
      Ascomycota: true,
      Basidiomycota: true,
      Other_fungi: true,
      Metazoans_Choanoflagellate_Ichthyosporea: true,
      Plantae: true,
      All: true,
      Fungi: true
    }
  }

  onAllSelected(e){
    let val = e.checked;
    this.database.Excavata = val;
    this.database.SAR = val;
    this.database.Amoebozoa = val;
    this.database.Other = val;
    this.database.Opisthokonts = val;
    this.database.Ascomycota = val;
    this.database.Basidiomycota = val;
    this.database.Other_fungi = val;
    this.database.Metazoans_Choanoflagellate_Ichthyosporea = val;
    this.database.Plantae = val;
    this.database.Fungi = val;

  }

  onOpisthokontsSelected(e){
    let val = e.checked;
    this.database.Ascomycota = val;
    this.database.Basidiomycota = val;
    this.database.Other_fungi = val;
    this.database.Metazoans_Choanoflagellate_Ichthyosporea = val;
    this.database.Fungi = val;
    
  }

  onFungiSelected(e){
    let val = e.checked;
    this.database.Ascomycota = val;
    this.database.Basidiomycota = val;
    this.database.Other_fungi = val;
  }

  //read in the file and transform the content into a string
  fileUploaded(e){
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) =>{
      this.fileString = <String> fileReader.result;
     }
    fileReader.readAsText(file);
  }

  onSubmit(form: NgForm){
    console.log(form.value.e_value);
    let eValue = form.value.e_value;
    if(eValue == ""){
      eValue = "1e-5";
    }

    this.onSearch(this.fileString, eValue);
    this.router.navigateByUrl('/results');
  }

  onSearch(searchSequence, eValue){

    //change line seperators to @ so that it is easier to parse on the server-end
    let searchSequenceArray = searchSequence.split(/[\r\n]+/g);
    let processedSearchSequence = searchSequenceArray.join("@");

    //generate query data from the given input
    let queryName = searchSequenceArray[0];
    let querySequence = "";
    for(let i=1; i<searchSequenceArray.length;i++){
      querySequence = querySequence + searchSequenceArray[i];
    }

    let queryData: QueryData = {
      name: queryName,
      sequence: querySequence,
      length: querySequence.length
    }
    processedSearchSequence = "BLAST#"+eValue+"#"+processedSearchSequence


    //update the query data
    

    this.httpHandlerService.sendSequence(processedSearchSequence).subscribe(
      (response: Result) => {
        this.data = response;
        console.log(response);
        this.dataTransferService.saveData(response.list);
        this.dataTransferService.query(queryData);
        console.log(response);
      },
      (error) => console.log(error)

    );

  }

}
