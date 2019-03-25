import glob, os, subprocess
from Bio.Blast.Applications import NcbiblastpCommandline
from Bio.Blast import NCBIXML

os.chdir("C:/Users/dsc12/Desktop/Thesis/blast-2.8.0+/db/custom_db")
file_list = []
for file in glob.glob("*.fasta"):
    file_list.append(file)

with open("database_info.txt", "w") as f:
    for file in file_list:
        f.write(file.split(".fasta")[0]+os.linesep)
        subprocess.call("makeblastdb -in " + file + " -dbtype prot -out " + file.split(".fasta")[0], shell=True)
        #makeblastdb -in mydb.fsa -dbtype prot -out mydb 

