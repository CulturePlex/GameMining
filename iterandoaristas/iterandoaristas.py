#!/usr/bin/env python
 
"""
Neo4j Relationships iterator
"""
 
# Import Neo4j modules
from py2neo import neo4j, cypher
 
# Attach to the graph db instance
graph_db = neo4j.GraphDatabaseService("http://localhost:7474/db/data/")
 
# Define a row handler...
def print_row(row):
	a = row
	#print(a)
	#print(b)
	#print(len(row))
	#print(row[0])

query = 'start r=rel(*) return r'
print query
cypher.execute(graph_db, query, {}, row_handler=print_row,error_handler=print_row)
