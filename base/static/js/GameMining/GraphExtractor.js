var GraphExtractor = {
  //Freebase Extractor Variables:
  name: "",
  type: "",
  rowRequests:[],
  search: function () {
    GraphExtractor.name = $('#query')[0].value;
    var array = $('#query')[0].value.split(',');
    jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query= [{"name":"' + array[0] + '","type":[]}]', function (data) {
        $("#second").show();
	  var types = [];
      $.each(data.result, function (k, v) {
		 if (v.type instanceof Array)
	     {
			for(var i=0;i<v.type.length;i++)
			{		
					types.push(v.type[i]);
			}	
		 }
	  });
	  console.log(types);
      GraphExtractor.showTypes(types);
    });
  },
  get: function () {
    GraphExtractor.type = $('#type_select_from').val();
    GraphExtractor.name = $('#query')[0].value;
    var array = $('#query')[0].value.split(',');
    for(var i=0;i<array.length;i++) {
        var query={
            "name": array[i] ,
            "type": GraphExtractor.type ,
            "*":null
        };
        var key= 'AIzaSyAJHbWeXtvKBJkZUE6KFjr8Ey43chdw6X4';
        var params = {
          'key': key,
          'query': JSON.stringify(query)
        };
        $.getJSON('https://www.googleapis.com/freebase/v1/mqlread' + '?callback=?', params, function(response) {
          console.log(response);
          GraphExtractor.setGraph(response.result,false);
      });
    }

  },
  getRec: function () {
    GraphExtractor.type = $('#type_select_from').val();
    GraphExtractor.name = $('#query')[0].value;
    var array = $('#query')[0].value.split(',');
    for(var i=0;i<array.length;i++) {
    jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query={"name":"' + array[i] + '","type":"' + GraphExtractor.type +'","*":[{}]}', function (data) {
      console.log(data);
      GraphExtractor.setGraphRec(data.result,true);
    });
    }
  },
  getStar: function (name,type,time) {
    if(name !=undefined && name!=null && type!=undefined && type!=null)
    {
    setTimeout(function(){
        console.log('Pidiendo nodo, nombre: '+ name + ', tipo: '+ type);
        jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query={"name":"' + name + '","type":"' + type +'","*":null}', function (data) {
          console.log('montando estrella');
          console.log(data);
          GraphExtractor.setGraph(data.result,false);
        });
    },time);
    }
  },
  init: function () {
  },
  showTypes: function (types) {
	function singles( array ) {
		for( var index = 0, single = []; index < array.length; index++ ) {
		    if( array.indexOf( array[index], array.indexOf( array[index] ) + 1 ) == -1 ) single.push( array[index] );    
		};
		return single;
	};
	types= singles(types);
    $('#type_select_from').empty();
    for(var i=0;i<types.length;i++)
	{
		
		if(types[i] !== "/common/topic" && types[i] !== "/media_common/cataloged_instance" )
		{
			 $("#type_select_from").append('<option value=' + types[i] + '>' + types[i] + '</option>');
		}
	}
  },
  //*=[{}]
  setGraphRec: function (result,r) {
    var origin = GraphManager.graph.node({ "name" : result.name , "type" : GraphExtractor.type});
    var node;
    var time=1000;
    console.log(result);
    for (var i in result) {
        if(5<result[i].length<10)
        {
          for (var j in result[i])
          {
                if(result[i][j].type)
                {
   /**               jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query= [{"name":"' + result[i][j].name + '","type":[]}]', function (data) {
                    $("#second").show();
                  GraphExtractor.showTypes(data.result);
                  });*/
                  console.log(result[i][j].name);
                  console.log(result[i][j].type[0]);
                  node = GraphManager.graph.node({ "name" : result[i][j].name , "type" : result[i][j].type[0]});
                  var rel = GraphManager.graph.rel(origin, {"name" : result[i][j].type[0] }, node);
                  console.log(rel);
                  console.log('entrando');
                  GraphExtractor.getStar(result[i][j].name,GraphExtractor.type,time);
                  time+=1000;
                }
          }
          $('#time').empty();
          $('#time').append('Time remaining: ' +time);
        }
    }
    $("#third").show();
  },


  //*=null
  setGraph: function (result,r) {
    if(result)
    {
    var origin = GraphManager.graph.node({ "name" : result.name , "type" : GraphExtractor.type});
    var node;
    var time=1000;
    console.log(result);
    $.each(result, function (k, v) {
        if (k !== "name" && k !== "key" && k !== "guid" && k !== "mid" && k !== "id" && k !== "permission" && k !== "timestamp")
        {
          if (v instanceof Array)
          {
            for (var obj in v)
            {
              console.log(k);
              if(v[obj] != null)
              {
                node = GraphManager.graph.node({ "name" : v[obj] , "type" : k});
                console.log(node);
                var rel2 = GraphManager.graph.rel(origin, k , node);
                rel2.then(function(relationship) {
                  console.log(relationship.getSelf());
                  GraphManager.relationships.push(relationship.getSelf());
                  });
              }
            }
          } else
          {
            if (v != null)
            {

              node = GraphManager.graph.node({ "name" : v , "type" : k});
              console.log(node);
              var rel = GraphManager.graph.rel(origin, k , node);
              rel.then(function(relationship) {
                console.log(relationship);
                GraphManager.relationships.push(relationship.getSelf());
                });

            }
          }
        }
    });
    $("#third").show();
  }
  }
};

