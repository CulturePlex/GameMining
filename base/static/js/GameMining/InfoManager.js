var InfoManager = {
 display: function(info) {
      $('.loading').hide();
      $('.results').show();
	  $('.summary .thumbnail').attr('src', '');
	  $('.summary .raw').val('');
	  $('.summary').val('');
      rawData = info.raw;
      var summaryInfo = info.summary;
      var properties = rawData[info.dbpediaUrl];

      for (key in summaryInfo) {
        $('.summary .' + key).text(summaryInfo[key]);
      }
	  if(summaryInfo != undefined)
	  {
		  $('.summary .thumbnail').attr('src', summaryInfo.image);
		  var dataAsJson = JSON.stringify(summaryInfo, null, '    ')
		  $('.summary .raw').val(dataAsJson);

		  // Raw Data Summary
		  var count = 0;
		  for (key in properties) {
			count += 1;
			$('.data-summary .properties').append(key + '\n');
		  }
		  $('.data-summary .count').text(count);

		  // raw JSON
		  var dataAsJson = JSON.stringify(rawData, null, '    ')
		  $('.results-json').val(dataAsJson);

		  
	  }
	  else
	  {
		$('.data-summary .properties').append("No info about this topic...");
	  }
    }
	
};

