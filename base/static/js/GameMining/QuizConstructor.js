var QuizConstructor = {
  relationship: null,
  edges : null,
  attrib : null,
  value: null,
  answers: null,
  end:null,
  start:null,
  numberOfRels: 44,
  counter: 0,
  choices: 4,
  treshold: 100,
  bigJson: null,
  answerIndex: null,
    
  contains: function(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
  return false;
},
  getAnswer: function() {
     QuizConstructor.counter++;
     QuizConstructor.answerIndex++;
     var jumpingTemp = GraphManager.relationships[Math.floor(Math.random()*GraphManager.relationships.length)];
     jQuery.ajax({
         url: jumpingTemp,
         success: function(response){

             if (response.type === QuizConstructor.attrib && QuizConstructor.counter < QuizConstructor.treshold)
             {
              jQuery.ajax({
                 url: response.start,
                 success: function(response){
                    if(!QuizConstructor.contains(QuizConstructor.answers,response.data.name) && response.data.name != QuizConstructor.correct )
                    {
                      QuizConstructor.answers[QuizConstructor.answerIndex] = response.data.name;
                      if(QuizConstructor.answerIndex < QuizConstructor.choices - 1)
                      {
                          QuizConstructor.answerIndex++;
                          QuizConstructor.getAnswer(QuizConstructor.answerIndex);
                      }else
                      {
                          QuizConstructor.preSetQuiz("FREEBASE_GRAPH");
                      }
                    }
                    else
                    {
                          QuizConstructor.getAnswer(QuizConstructor.answerIndex);
                    }
                 },
                 failed: function() {
                       console.log('*************************ERROR***********************');
                 }
              });
            }else
            {
                if(QuizConstructor.counter > QuizConstructor.treshold)
                {
                    QuizConstructor.preSetQuiz("FREEBASE_GRAPH");
                }
                else
                {

                    QuizConstructor.getAnswer(QuizConstructor.answerIndex);
                }
            }
          },
          failed: function() {
               console.log('*************************ERROR***********************');
         }
      });
  },
   
  createQuiz: function(graph_type){
	$('#play-msg').html("Creating Quiz... If its taking too much time try adding more concepts!");
	$('#play-msg').show();
    $('#answer0').hide();
    $('#answer1').hide();
    $('#answer2').hide();
    $('#answer3').hide();
	$('#quizViewer').empty();

    QuizConstructor.answers = [];
    var jumping = GraphManager.relationships[Math.floor(Math.random()*GraphManager.relationships.length)];
    jQuery.ajax({
      url: jumping,
      success: function(response){
      QuizConstructor.relationship = response;
      QuizConstructor.answers=[];
      //Adding question and correct answer
      QuizConstructor.attrib = QuizConstructor.relationship.type;
      
      jQuery.ajax({
        url: QuizConstructor.relationship.end,
        success: function(response){
          QuizConstructor.end = response;
          QuizConstructor.answers=[];
          
          QuizConstructor.value = QuizConstructor.end.data.name;
          jQuery.ajax({
            url: QuizConstructor.relationship.start,
            success: function(response){
              QuizConstructor.start = response;
              QuizConstructor.correct = QuizConstructor.start.data.name;
              QuizConstructor.counter = 0;
              QuizConstructor.answers[0] = QuizConstructor.correct;
              //Adding incorrect answers
              QuizConstructor.answerIndex=0;
              QuizConstructor.counter=0;
              QuizConstructor.getAnswer(QuizConstructor.answerIndex);

            }
        });
      }
    });
  },
  failure : function () {
        console.log('fallo');
        //Ext.Viewport.setMasked(false);
        //Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('Try again later'), Ext.emptyFn);
    }
    });

  },
  preSetQuiz: function(graph_type){
      console.log(QuizConstructor.answers);
      console.log(QuizConstructor.answers[4]);
      console.log(QuizConstructor.answers.length);
      if( QuizConstructor.answers.length > 1)
      {
          setTimeout(QuizConstructor.setQuiz(graph_type),1000);
      }
      else
      {
        QuizConstructor.createQuiz(graph_type);
      }
  },
  setQuiz: function(graph_type){
		      $('#play-msg').hide();
              if(graph_type == "FREEBASE_GRAPH")
              {
                  var question = 'Which of the followings has <em>' + QuizConstructor.value +'</em> as ' + QuizConstructor.attrib.replaceAll("_"," ") +'?';
              }
              if(graph_type == "CULTUREPLEX_GRAPH")
              {
                  var question = 'Which of the following is <em>' + attrib + '</em> ' + value +'?';
              }
              var quiz = '<h>' + question + '</h2>';
              
              //Deleting duplicated answers
              var j = 0;
              while ( j < QuizConstructor.answers.length )
              {
                  if ($.inArray(QuizConstructor.answers[j], QuizConstructor.answers)!== j)
                  {
                      QuizConstructor.answers.splice(j,2);
                      console.log('repetido');
                  }
                  if (QuizConstructor.answers[j]==undefined)
                  {
                      QuizConstructor.answers.splice(j,2);
                      console.log('repetido');
                  }
                  j++;
              }
              console.log(QuizConstructor.answers);
              //If there is only one, restart quiz
              if(QuizConstructor.answers.length<2 || QuizConstructor.contains(QuizConstructor.answers,undefined))
              {
                  QuizConstructor.createQuiz(graph_type);
              }
              else
              {
                
                //Mixing answers
                var answersmixed = [];
                j = 0;
                while ( j < QuizConstructor.answers.length )
                {
                    var r = parseInt(Math.random(10)*QuizConstructor.answers.length);
                    if ( typeof(answersmixed[r] ) === "undefined")
                    {
                        answersmixed[r] = QuizConstructor.answers[j];
                        j++;
                    }
                }
                for (var i = 0 ; i < 4; i++)
                {
                    $('#answer'+i).removeClass("btn-success");
                    $('#answer'+i).removeClass("btn-danger");
                    
                    $('#answer'+i).hide();
                }
                $('#answer0').hide();
                $('#answer1').hide();
                $('#answer2').hide();
                $('#answer3').hide();
                for (var i = 0 ; i < QuizConstructor.answers.length; i++)
                {
                    $('#answer'+i).html(answersmixed[i]);
                    $('#answer'+i).show();
                }
                
                if($('#answer1').html=="Create Quiz!"){$('#answer1').hide();}
                if($('#answer0').html=="Create Quiz!"){$('#answer0').hide();}
                if($('#answer2').html=="Create Quiz!"){$('#answer2').hide();}
                if($('#answer3').html=="Create Quiz!"){$('#answer3').hide();}

                //quiz += '<div>' + 'Correct Answer :' + QuizConstructor.correct + '</div>';
                $('.quizViewer').empty();
                $('.quizViewer').append(quiz);
                $.unblockUI();
              }
  },
  checkAnswer: function(i) {
    console.log($('#quizViewer'));
    console.log(QuizConstructor.correct);
    console.log($('#answer'+i).html());
    if($('#answer'+i).html() === QuizConstructor.correct)
    {
        $('#answer'+i).addClass("btn-success");
		$("#time").html("Correct Answer!");
    }
    else
    {
		$("#time").html("Wrong Answer!");
        $('#answer'+i).addClass("btn-danger");
    }
    setTimeout(function(){
		$("#time").empty();
        QuizConstructor.createQuiz();
    },1000);

  }
}

