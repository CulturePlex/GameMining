$(document).ready(function(){
  GraphExtractor.init();
  $(".chzn-select").chosen();

  $('#search-fb').click(function(){
    GraphExtractor.search();
  });
  
  $('#extract-fb').click(function(){
    GraphExtractor.get();
  });

  $('#create-quiz').click(function(){
    QuizConstructor.createQuiz("CULTUREPLEX_GRAPH")
  });

  $('#create-quiz-fb').click(function(){
    QuizConstructor.createQuiz("FREEBASE_GRAPH")
  });

  $('#hide-canvas').click(function(){
    $('#graphcanvas').hide();
  });

  $('#show-canvas').click(function(){
    $('#graphcanvas').show();
  });

});

