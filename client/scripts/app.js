var server = 'https://api.parse.com/1/classes/chatterbox';

var cleanText = function(text) {
  text = text || '';
  var textArray = text.split('');
  var badChars = ['<', '>', '&', '"', "'", ' ', '!', '@',
                  '$', '%', '(', ')', '=', '+', '{', '}',
                  '[', ']', '-'];

  for (var i = 0; i < badChars.length; i++) {
    for (var j= 0; j < textArray.length; j++) {
      if (textArray[j] === badChars[i]) {
        textArray[j] = '&#' + textArray[j].charCodeAt(0) + ';';
      }
    }
  }
  return textArray.join('');
};

var refreshMessages = function() {
    $.get(server, function(data) {
    $('#main').append($('<div id="messageList">'));
    var $messageList = $('#messageList');
    _.each(data.results, function(item) {
      $messageList.prepend($('<div class="message">'));
      $('.message').first().append($('<p />', {html: cleanText(item.username), class: 'username'}),
                                $('<p />', {html: cleanText(item.text), class: 'text'}),
                                $('<p />', {html: cleanText(item.roomname), class: 'room'}),
                                $('<p />', {html: cleanText(item.createdAt), class: 'createdAt'}));
    });
  });
};

refreshMessages();
setTimeout(refreshMessages, 15000);

