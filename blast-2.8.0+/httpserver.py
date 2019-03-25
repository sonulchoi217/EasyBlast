#!/usr/bin/env python
 
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import json
import os
from Bio.Blast.Applications import NcbiblastpCommandline
from Bio.Blast import NCBIXML
 
# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
 
  def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
  # GET
  def do_GET(self):
        # Send response status code
        self.send_response(200)
 
        # Send headers
        self.send_header('Content-type','text/html')
        self.end_headers()
 
        # Send message back to client
        message = "Hello worldaaa!"
        # Write content as utf-8 data
        self.wfile.write(bytes(message, "utf8"))
        return

  def do_POST(self):
       #content_length = int(self.headers['Content-Length'])
       #body = self.rfile.read(1)
       message = "Hello worldaaa!"
       self.send_response(200)
       content_len = int(self.headers.getheader('content-length', 0))
       post_body = self.rfile.read(content_len)
       print(post_body)

       post_header = post_body.split("#")[0]
       

       if(post_header == "BLAST"):
          e_value = post_body.split("#")[1]
          post_content = post_body.split("#")[2]
          self.end_headers()
          data = self.performBlast(post_content, e_value)
          realData = json.dumps(data)
          print(realData)

          self.wfile.write(realData)
          print("BLAST will perform")
       elif(post_header == "protein"):
          post_content = post_body.split("#")[1]
          self.end_headers()
          data = self.findProteins(post_content)
          realData = json.dumps(data)
          print(realData)

          self.wfile.write(realData)
          print("Downloading proteins...")

  def do_OPTIONS(self):
       self.send_response(200, "ok")
       self.send_header('Content-type','text/html')
       self.end_headers()
       
  def end_headers (self):
       self.send_header('Access-Control-Allow-Origin', '*')
       BaseHTTPRequestHandler.end_headers(self)


  def findProteins(self, input):
       proteinsToSearch = input.split("@")
       fasta_files = ""
       for protein in proteinsToSearch:
            if len(protein.split("&"))>1:
               parent_name = protein.split("&")[0]
               accession_number = protein.split("&")[1]

               file_address = "C:/Users/dsc12/Desktop/Thesis/blast-2.8.0+/db/custom_db/"+parent_name+".fasta"
               fasta_file=""
               fasta_found = False
               with open(file_address, "r") as f:
                    for line in f:
                         if line.find(">")==0:
                              if fasta_found:
                                   fasta_found = False
                                   break
                              if line.find(accession_number) != -1:
                                   fasta_found = True
                         if fasta_found:
                              fasta_file = fasta_file+line
                    fasta_files = fasta_files + fasta_file
                    f.close
       return fasta_files
       


  def performBlast(self, input, e_value):

       words = input.split("@")
     #   print(words)
     #   parsed_words = []
     #   first_line = ""
     #   start_new_line = False
     #   for word in words:
     #         if start_new_line:
     #              parsed_words.append(word)
     #         else:
     #              if len(word)>40:
     #                   start_new_line = True
     #                   parsed_words.append(first_line)
     #              else:
     #                   if len(first_line)==0:
     #                        first_line = word
     #                   else:
     #                        first_line = first_line+" "+word
     #   print(parsed_words)

       with open("C:/Users/dsc12/Desktop/Thesis/blast-2.8.0+/check1.fasta", "w+") as f:
             for word in words:
                    f.write(word + "\n")
             f.close()
       

       with open("C:/Users/dsc12/Desktop/Thesis/blast-2.8.0+/db/custom_db/database_info.txt", "r") as f:
            for line in f:
                database = line.rstrip()
                print(database)
                e_val = float(e_value)
                blastp_cline = NcbiblastpCommandline(query="check1.fasta", db=database, evalue=e_val, outfmt=5, out= database+".xml")
                blastp_cline()
            f.close()

       data = {"list":[], "query":[]}
       with open("C:/Users/dsc12/Desktop/Thesis/blast-2.8.0+/db/custom_db/database_info.txt", "r") as f:
            for line in f:
                file_name = line.rstrip()
                result_handle = open(file_name+".xml")
                print(file_name)
                blast_record = NCBIXML.read(result_handle)
                E_VALUE_THRESH = 0.00001

                if len(blast_record.alignments) == 0:
                     newData = {
                          "name": file_name,
                          "hits": []
                     }
                     newDataString = json.dumps(newData)
                     data["list"].append(newData)
                else: 
                     newData = {
                          "name": file_name,
                          "hits": []
                     }
                     for alignment in blast_record.alignments:
                         for hsp in alignment.hsps:
                              if hsp.expect < E_VALUE_THRESH:
                                   # print("****Alignment****")
                                   # print("sequence:", alignment.title)
                                   # print("length:", alignment.length)
                                   # print("e value:", hsp.expect)
                                   # print("start: ", hsp.query_start)
                                   # print("align length: ", hsp.align_length)
                                   # print("r:", hsp.match)
                                   # print(hsp.query[0:75] + "...")
                                   # print(hsp.match[0:75] + "...")
                                   # print(hsp.sbjct[0:75] + "...")
                                   hit = {
                                        'title': alignment.title,
                                        'query_start': hsp.query_start,
                                        'align_length': hsp.align_length,
                                        'e_value': hsp.expect,
                                        'sbjct': hsp.sbjct,
                                        'query': hsp.query,
                                        'match': hsp.match,
                                        'score': hsp.score,
                                        'sbjct_start': hsp.sbjct_start,
                                        'identities': hsp.identities,
                                        'gaps': hsp.gaps,
                                        'positives': hsp.positives,
                                        'strand': hsp.strand,
                                        'frame': hsp.frame
                                   }
                                   hitString = json.dumps(hit)
                                   newData["hits"].append(hit)
                     newDataString = json.dumps(newData)
                     data["list"].append(newData)

            queryData = {
                 "name": ""

            }
            data["query"].append(queryData)
            f.close()
       print("done")
       return data
 
def run():
  print('starting server...')
 
  # Server settings
  # Choose port 8080, for port 80, which is normally used for a http server, you need root access
  server_address = ('127.0.0.1', 8081)
  httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
  print('running server...')
  httpd.serve_forever()
 
run()