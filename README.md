
# Easy BLAST -- Online tool that will enhance your BLASTing experience


The goal of Easy BLAST is to make BLAST searching experience as simple and painless as possible.

You will simply upload a fasta file of your interest, customize the database you want to search from, and select e-value threshold:


The resulting BLAST output will look something like this:


### Table of Contents

|Section|Explanation|
|---------------------------------------------------------------|---------------------------------------------------------------------|
|[Install](#install)                                            |   Find the instructions on how to install East BLAST on your local machine    |
|[Advantages](#advantages)                                      |   Learn about advantages of using Easy BLAST                        |
|[Get Started](#get-started)                                    |   Learn about features that Easy BLAST provides                     |
|[Feedback](#feedback)                                          |   How to send me feedback                                           |
|[Errors](#errors)                                              |   List of common errors for people experience when using Easy BLAST |


### Install

Angular 7 is used to build the front end website while Python 2.7 is used to build the server. Using chrome is highly recommended for the best experience.

You can download the complete installed version of the program in a virtual machine, so no additional installation is needed. (Email sonulchoi217@gmail.com for more details about the virtual machine).

However, if you desire to install the program on your local machine yourself for any reason, the instructions below describes evey step necessary to run the server.

First, clone this github repository:
```python
git clone https://github.com/sonulchoi217/EasyBlast.git
```

Go to the Angular project's root directory (a.k.a. at /EasyBlast/BlastProject) and install dependencies for Angular project by running the following command:
```python
npm install
```

Install python package that are used in the server side by running the following command:
```python
pip install biopython
```

Download fasta files of all Eukaryotic genome in the following link: http://supfam.org/SUPERFAMILY/cgi-bin/taxonomic_gen_list.cgi#model_eukaryotes. If you use the virtual machine, all the fasta file are already downloaded
(The fasta files needs to be installed in /EasyBlast/blast-2.8.0+/db/custom_db/ directory)

Once the database is downloaded, convert the database into a format that Blast+ uses by running the following command at /EasyBlast/blast-2.8.0+/ directory:
```python
python set_database.py
```
(HMMER and Pfam database is not implemented yet)
~~HMMER and Pfam database also need to be installed to to find protein domains:
Link to download HMMER: http://hmmer.org/download.html
For Windows user,
Instructions on how to install HMMER on Windows: https://www.youtube.com/watch?v=MBtbgZ7OmNM
After downloading HMMER, make sure to update the path so that the commands can be used by the program.
Link to download Pfam database: ftp://ftp.ebi.ac.uk/pub/databases/Pfam/releases/Pfam32.0/Pfam-A.hmm.gz\ ~~

After all the installation is done, open up a command line interface and locate to /EasyBlast/BlastProject/. 
Run the following command:

```python
ng serve -o
```
This will host the Angular project on your browser.


Open up another command line interface and locate to /EasyBlast/blast-2.8.0+/.
Run the following command:

```python
python httpserver.py
```
This will host the Python server on your local machine.

Navigate to http://localhost:4200 using chrome. Now you are all set to use the Easy BLAST!


### Advantages

There are several advantages that Easy BLAST have over the online NCBI BLAST tool.

- Easy BLAST allows users to customize database to an organism level
- Easy BLAST runs BLAST on each organism seperately. This allows Easy BLAST to catch fusion proteins that might have been overlooked by NCBI BLAST tool.
- If no alignment was found for a specific organism, Easy BLAST still shows the organism and displays that "no hit was found". This feature is very useful for people who are working with a pre-defined set of organisms.
- Easy BLAST displays useful information about each alignment more readily.


### Get Started

Start by uploading a fasta file of your interest to Easy BLAST website.
![image1](/images/slide1.png "Upload")


### Feedback

Please send me an email with your feedback to sonulchoi217@gmail.com.
I'll try to respond to issues within 24 hours.

### Errors

- If a search is taking too long, it is possible that the server is not responding. In that case, try restarting the python server. 
- If you can't download some of the output sequences, it might be because the regular expression used in onDownloadClick() function in result.component.ts is not matching.
