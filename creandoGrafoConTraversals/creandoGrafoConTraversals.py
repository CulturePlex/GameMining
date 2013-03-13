#!/usr/bin/py
# -*- coding: utf-8 -*-

"""
Generating a new Graph with traversals
"""

# Import Neo4j modules
import sys
from py2neo import neo4j, cypher
 

arg1 = sys.argv[1]
 
# Attach to the graph db instance
graph_db = neo4j.GraphDatabaseService("http://localhost:7474/db/data/")

traversal = 'start n=node(*) match n-[r]-m-[q]-l where has(n.NodeTypeS) and n.NodeTypeS? = "Año" and has(m.NodeTypeS) and m.NodeTypeS? = "Receta" and has(l.NodeTypeS) and l.NodeTypeS? = "Temperatura" return n.IDX,l.IDX'

traversalCount = 'start n=node(*) match n-[r]-m-[q]-l where has(n.NodeTypeS) and n.NodeTypeS? = "Año" and has(m.NodeTypeS) and m.NodeTypeS? = "Receta" and has(l.NodeTypeS) and l.NodeTypeS? = "Temperatura" return count(*)'

traversalName="TRAVERSAL-2"
def print_error(row):
	print(row)

def print_row(row):
	print(row)

newNodes = []
# Define a row handler to create each source node...
def creating_nodesA(row):
	query=''
	a=row[0]
	if not a in newNodes:
		newNodes.append(a)
		query += "CREATE n = {IDX:'"+a+"',DB:'"+traversalName+"'} "
	if query != '':
		print query
		cypher.execute(graph_db, query, {}, row_handler=print_row,error_handler=print_error)
	
# Define a row handler to create each target node...
def creating_nodesB(row):
	query=''
	a=row[1]
	if not a in newNodes:
		newNodes.append(a)
		query += "CREATE n = {IDX:'"+a+"',DB:'"+traversalName+"'} "
	if query != '':
		print newNodes		
		print query
		cypher.execute(graph_db, query, {}, row_handler=print_row,error_handler=print_error)

rels=[]
allRels=[]
counter=0

def collecting_rels(row):
	global counter
	global count
	global rels
	global allRels 
	counter+=1
	print counter
	print count
	allRels.append(row)	
	if not row in rels:
		rels.append(row)
	if counter >= count:
		print 'a'		
		creating_rels()

# Define a row handler to create each relationship...
def creating_rels():
	print rels
	print allRels
	for rel in rels:
		query ='START a=node(*), b=node(*) WHERE has(a.IDX) and a.IDX? = "'+rel[0]+'" and has(a.DB) and a.DB? = "'+traversalName+'" and  has(b.IDX) and b.IDX? ="'+rel[1]+'" and  has(b.DB) and b.DB? ="'+traversalName+'" CREATE a-[r:_'+str(allRels.count(rel))+']->b RETURN r'
		print query
		cypher.execute(graph_db, query, {}, row_handler=print_row,error_handler=print_error)


print traversal

count = 0

def counter_handler(row):
	global count
	count = row[0]	
	print row

cypher.execute(graph_db, traversalCount, {}, row_handler=counter_handler,error_handler=print_error)

if arg1 == 'nodesA':
	cypher.execute(graph_db, traversal, {}, row_handler=creating_nodesA,error_handler=print_error)
if arg1 == 'nodesB':
	cypher.execute(graph_db, traversal, {}, row_handler=creating_nodesB,error_handler=print_error)
if arg1 == 'rels':
	cypher.execute(graph_db, traversal, {}, row_handler=collecting_rels,error_handler=print_error)
