import glob, os, subprocess
from Bio.Blast.Applications import NcbiblastpCommandline
from Bio.Blast import NCBIXML

for x in os.walk("C:\\Users\\dsc12\Desktop\\Thesis\\blast-2.8.0+\\db\\custom_db\\Database"):
    os.chdir(x[0])
    a = x[0].split("\\")
    print(a[len(a)-1])
    file_list = []
    for file in glob.glob("*.fasta"):
        subprocess.call("makeblastdb -in " + x[0]+"\\"+file+"" + " -dbtype prot -out " + "C:\\Users\\dsc12\Desktop\\Thesis\\blast-2.8.0+\\db\\custom_db\\Processed_database\\"+file.split(".fasta")[0], shell=True)
        file_list.append(file)
    if len(file_list)>0:
        with open("C:\\Users\\dsc12\Desktop\\Thesis\\blast-2.8.0+\\db\\custom_db\\Processed_database_info\\"+a[len(a)-1]+".txt", "w") as f:
            for a_file in file_list:
                f.write(a_file.split(".fasta")[0]+os.linesep)
            f.close
    
        

# with open("database_info.txt", "w") as f:
#     for file in file_list:
#         f.write(file.split(".fasta")[0]+os.linesep)
        