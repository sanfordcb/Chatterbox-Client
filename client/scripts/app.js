$(document).ready(function () {

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

var newMessageBox = function(username) {
  $('#popup').fadeIn();
  $('textarea').attr('placeholder', 'Type a message to ' + username + ' and/or add ' + username + ' as a friend');
  $('textarea').val('');
  $('.addFriend').attr('checked', false);
  $('#popup span').text(username);
  $('#main').fadeOut();
  $('#popup').append($('<p />', {html: "Close", class: 'closeButton'}));
  $('#submit').click(function() {
    var friendChecked = $('.addFriend').prop('checked');
    var messageContent = $('textarea').val();
    processSubmitForm(username, friendChecked, messageContent);
  });
  $('.closeButton').click(function() {
    $('#popup').fadeOut();
    $('#main').fadeIn();
    $(this).remove();
  });
}

var processSubmitForm = function(username, friendChecked, messageContent) {
  $('#submit').unbind('click');
  $('#popup').fadeOut();
  $('#main').fadeIn();
  $('.closeButton').remove();
  console.log(username);
  console.log(friendChecked);
  console.log(messageContent);
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
      $('.username').first().click(function() {
        newMessageBox(item.username);
});
    });
  });
};

refreshMessages();
setTimeout(refreshMessages, 15000);



});
