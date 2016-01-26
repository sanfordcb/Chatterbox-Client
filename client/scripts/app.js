var server = 'https://api.parse.com/1/classes/chatterbox';

var refreshMessages = function() {
    $.get(server, function(data) {
    $('#main').append($('<div id="messageList">'));
    var $messageList = $('#messageList');
    _.each(data.results, function(item) {
      $messageList.prepend($('<div class="message">'));
      $('.message').first().append($('<p />', {html: item.username, class: 'username'}),
                                $('<p />', {html: item.text, class: 'text'}),
                                $('<p />', {html: item.roomname, class: 'room'}),
                                $('<p />', {html: item.createdAt, class: 'createdAt'}));
    });
  });
};

refreshMessages();
setTimeout(refreshMessages, 15000);

