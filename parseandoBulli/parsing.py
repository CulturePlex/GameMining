#!/usr/bin/env python
 
"""
NetLogo Neo4j Parser
"""
 
# Import Neo4j modules
from py2neo import neo4j, cypher
 
# Attach to the graph db instance
graph_db = neo4j.GraphDatabaseService("http://localhost:7474/db/data/")
 
# Define a row handler...
def print_row(row):
    print(row)

nodesBlock = "OUT"
edgesBlock = "OUT"
attrs = []

for line in open("BulliCompleto.nlg", 'r'):
	if nodesBlock == "HEADER":
		attrs = []
		for attr in line.split('" '):
			attrs.append(attr.replace('"','').replace('\n','').replace("(","").replace(")",""))
		print attrs
		nodesBlock = "IN"
	if "<Nodes>" in line:
		nodesBlock = "HEADER"
	if "<EndNodes>" in line:
		nodesBlock = "OUT"
	if nodesBlock == "IN":
		attrs_data = []
		
		for attr_data in line.split('" '):
			attrs_data.append(attr_data.replace('"','').replace('\n','').replace(",'}","}").strip())
		query = "CREATE n = {"
		for attr,attr_data in zip(attrs, attrs_data):
			query += attr+": '"+attr_data+"',"
		query = query[:-1]
		query +="}"
		print query
		cypher.execute(graph_db, query, {}, row_handler=print_row,error_handler=print_row)

	if edgesBlock == "HEADER":
		edgesBlock = "IN"
	if "<Edges>" in line:
		edgesBlock = "HEADER"
	if "<EndEdges>" in line:
		edgesBlock = "OUT"
	if edgesBlock == "IN" and len(line.split(']'))>1:
		line = line.split(']')
		rel = line[1][:-1].replace('"','').replace(" ","")
		#print rel
		a = line[0].split('" "')[0].replace('["','').strip()
		#print a
		b = line[0].split('" "')[1].replace('["','').replace('"','').strip()
		#print b
		query = 'START a=node(*), b=node(*) WHERE has(a.IDX) and a.IDX? = "'+a+'" and has(b.IDX) and b.IDX? ="'+b+'" CREATE a-[r:'+rel+']->b RETURN r'
		print query
		cypher.execute(graph_db, query, {}, row_handler=print_row,error_handler=print_row)
