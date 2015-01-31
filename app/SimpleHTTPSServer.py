#!/usr/bin/python
 
## Run the following command to generate your certificate file
# openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
import os
import BaseHTTPServer, SimpleHTTPServer
import ssl 
import sys 
 
cdir = os.getcwd()
os.chdir(cdir)
 
certFile = os.path.dirname(sys.argv[0]) + '/server.pem'
 
httpd = BaseHTTPServer.HTTPServer(('localhost', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile=certFile, server_side=True)
httpd.serve_forever()