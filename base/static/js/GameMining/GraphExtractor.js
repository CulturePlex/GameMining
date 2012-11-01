var GraphExtractor = {
  //Freebase Extractor Variables:
  name: "",
  type: "",
  jsonData : "",
  search: function () {
    GraphExtractor.name = $('#query')[0].value;
    jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query= [{"name":"' + GraphExtractor.name + '","type":[]}]', function (data) {
      GraphExtractor.showTypes(data.result);
    });
  },
  get: function () {
    GraphExtractor.type = $('#type_select_from').val();
    jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query={"name":"' + GraphExtractor.name + '","type":"' + GraphExtractor.type +'","*":null}', function (data) {
      GraphExtractor.jsonData = data;
      GraphExtractor.setGraph(data.result);
    });
  },
  init: function () {
  },
  showTypes: function (result) {
    $('#type_select_from').empty();
    $.each(result, function (k, v) {
      if (v.type instanceof Array)
      {
        for (var obj in v.type)
        {
          if (v.type[obj] !== "/common/topic" && v.type[obj] !== "/media_common/cataloged_instance")
          {
            $("#type_select_from").append('<option value=' + v.type[obj] + '>' + v.type[obj] + '</option>');
          }
        }
      }
    });
  },
  setGraph: function (result) {
    GraphManager.init();
    var origin = GraphManager.graph.node({ "name" : result.name , "type" : GraphExtractor.type});
    var node;
    $.each(result, function (k, v) {
        if (k !== "name" && k !== "key" && k !== "guid" && k !== "mid" && k !== "id" && k !== "permission" && k !== "timestamp")
        {
          if (v instanceof Array)
          {
            for (var obj in v)
            {
              node = GraphManager.graph.node({ "name" : v[obj] , "type" : k});
              console.log(node);
              GraphManager.graph.rel(origin, k , node);
            }
          } else
          {
            if (v != null)
            {
              node = GraphManager.graph.node({ "name" : v , "type" : k});
              GraphManager.graph.rel(origin, {"name" : k }, node);
            }
          }
        }
    });
  }
};

