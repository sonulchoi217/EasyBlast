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
  categories;
  data;

  constructor(
    private httpHandlerService: HttpHandlerService, 
    private dataTransferService: DataTransferService, 
    private router: Router
    ) { }

  ngOnInit() {
    this.categories = ["All", "Amoebozoa", "Animals", "Apusozoa", "Choanoflagellates", "Fungi", "Ichthyosporea", "Plants", "Protists"]
    this.database = {
      All: true,
      Amoebozoa: true,      
      Dictyostelium: true,      
      Entamoeba: true,      
      Animals: true,
      Animal_others: true,      
      Annelida: true,      
      Arthropods: true,      
      Ascidians: true,      
      Cnidarian: true,      
      Echinoderms: true,      
      Flatworms: true,      
      Mollusks: true,      
      Nematodes: true,      
      Placozoans: true,
      Rotifers: true,      
      Vertebrates: true,      
      Apusozoa: true,      
      Thecamonas: true,      
      Choanoflagellates: true,      
      Codonosigidae: true,      
      Fungi: true,      
      Ascomycetes: true,      
      Basidiomycetes: true,      
      Chytridiomycetes: true,      
      Fungi_others: true,      
      Ichthyosporea: true,      
      Capsaspora: true,      
      Ichthyosporea_others: true,      
      Plants: true,      
      Eudicots: true,      
      Green_algae: true,      
      Gymnosperms: true,      
      Monocots: true,     
      Mosses: true,      
      Plant_others: true,      
      Spikemosses: true,     
      Protists: true,     
      Aveolates: true,      
      Euglenozoa: true,     
      Protists_others: true,     
      Red_algae: true,
      Stramenopiles: true,
    }
  }

  onAllSelected(e){
    let val = e.checked;
    this.database.Amoebozoa= val;
    this.database.Dictyostelium= val;
    this.database.Entamoeba= val;
    this.database.Animals= val;
    this.database.Animal_others= val;
    this.database.Annelida= val;
    this.database.Arthropods= val;
    this.database.Ascidians= val;
    this.database.Cnidarian= val;
    this.database.Echinoderms= val;
    this.database.Flatworms= val;
    this.database.Mollusks= val;
    this.database.Nematodes= val;
    this.database.Placozoans= val;
    this.database.Rotifers= val;
    this.database.Vertebrates= val;
    this.database.Apusozoa= val;
    this.database.Thecamonas= val;
    this.database.Choanoflagellates= val;
    this.database.Codonosigidae= val;
    this.database.Fungi= val;
    this.database.Ascomycetes= val;
    this.database.Basidiomycetes= val;
    this.database.Chytridiomycetes= val;
    this.database.Fungi_others= val;
    this.database.Ichthyosporea= val;
    this.database.Capsaspora= val;
    this.database.Ichthyosporea_others= val;
    this.database.Plants= val;
    this.database.Eudicots= val;
    this.database.Green_algae= val;
    this.database.Gymnosperms= val;
    this.database.Monocots= val;
    this.database.Mosses= val;
    this.database.Plant_others= val;
    this.database.Spikemosses= val;
    this.database.Protists= val;
    this.database.Aveolates= val;
    this.database.Euglenozoa= val;
    this.database.Protists_others= val;
    this.database.Red_algae= val;
    this.database.Stramenopiles= val;
  }

  onAmoebozoaSelected(e){
    let val = e.checked;
    this.database.Dictyostelium= val;
    this.database.Entamoeba= val;
  }

  onAnimalsSelected(e){
    let val = e.checked;
    this.database.Animal_others= val;
    this.database.Annelida= val;
    this.database.Arthropods= val;
    this.database.Ascidians= val;
    this.database.Cnidarian= val;
    this.database.Echinoderms= val;
    this.database.Flatworms= val;
    this.database.Mollusks= val;
    this.database.Nematodes= val;
    this.database.Placozoans= val;
    this.database.Rotifers= val;
    this.database.Vertebrates= val;
  }
  onApusozoaSelected(e){
    let val = e.checked;
    this.database.Thecamonas= val;
  }
  onChoanoflagellatesSelected(e){
    let val = e.checked;
    this.database.Codonosigidae= val;
  }
  onFungiSelected(e){
    let val = e.checked;
    this.database.Ascomycetes= val;
    this.database.Basidiomycetes= val;
    this.database.Chytridiomycetes= val;
    this.database.Fungi_others= val;
  }
  onIchthyosporeaSelected(e){
    let val = e.checked;
    this.database.Capsaspora= val;
    this.database.Ichthyosporea_others= val;
  }
  onPlantsSelected(e){
    let val = e.checked;
    this.database.Eudicots= val;
    this.database.Green_algae= val;
    this.database.Gymnosperms= val;
    this.database.Monocots= val;
    this.database.Mosses= val;
    this.database.Plant_others= val;
    this.database.Spikemosses= val;
  }
  onProtistsSelected(e){
    let val = e.checked;
    this.database.Aveolates= val;
    this.database.Euglenozoa= val;
    this.database.Protists_others= val;
    this.database.Red_algae= val;
    this.database.Stramenopiles= val;
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
    let database_list = this.generateDatabaseList();

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
    processedSearchSequence = "BLAST#"+eValue+"#"+processedSearchSequence+"#"+database_list


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

  generateDatabaseList(){
    let database_list = ""
    let include = true;
    for (let key in this.database){
      if(this.database[key]==true){
        for(let key2 in this.categories){
          if(this.categories[key2]==key){
            include = false;
          }
        }
        if(include) database_list = database_list+key+"*"
        include = true;
      }
    }
    return database_list
  }

}
