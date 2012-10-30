var GraphManager = {
  //Freebase Extractor Variables:
  graph: null,
  init: function () {
    GraphManager.graph = new neo4j.GraphDatabase("http://localhost:7474/");
  },
};

