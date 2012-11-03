var GraphManager = {
  //Freebase Extractor Variables:
  graph: null,
  HOST: null,
  relationships:[],
  init: function () {
    GraphManager.relationships=[];
    console.log('initing..');
    GraphManager.graph = new neo4j.GraphDatabase("http://localhost:7474/");
    GraphManager.HOST = "http://localhost:7474/";
  },
};

