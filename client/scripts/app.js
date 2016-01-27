$(document).ready(function () {

  var server = 'https://api.parse.com/1/classes/chatterbox';
  var username = 'SanfordMichael';
  var currentRoom = 'lobby';

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

  var processSubmitForm = function(username, messageContent) {

    var newPost = {
      username: username,
      text: messageContent,
      roomname: currentRoom
    }

    $.ajax({
      url: server,
      type: 'POST',
      data: JSON.stringify(newPost),
      contentType: 'application/json',
      success: function(data) {
        console.log('Chatterbox: message sent. Data: ', data);
      },
      error: function(data) {
        console.error('Chatterbox: failed to send message. Data: ', data);
      }
    });


  };

  var friends = {};

  var displayMessages = function(data) {
    $('#messageList').remove();
    $('#main').append($('<div id="messageList">'));
      var $messageList = $('#messageList');
      _.each(data.results, function(item) {
        if (!item.roomname) item.roomname = 'lobby';
        if (currentRoom === item.roomname) {
          $messageList.prepend($('<div class="message">'));
          $('.message').first().append($('<p />', {html: cleanText(item.username), class: 'username' }),
                                  $('<p />', {html: cleanText(item.text), class: 'text'}),
                                  $('<p />', {html: cleanText(item.roomname), class: 'text'}));
          $('.message').first().addClass(item.roomname);
          $('.username').first().addClass(item.username);
          $('.username').first().click(function() {
            friends[item.username] = $(this);
            highlightFriends();
          });
        }


      });
    }



  var highlightFriends = function() {
    for (var item in friends) {
      if (friends[item]) {
        $('.' + item).addClass('friend');
      }
    }
  };


  var getMessages = function() {
    $.ajax({
      url: server,
      type: 'GET',
      data: { order: "-createdAt" },
      contentType: 'application/json',
      success: function(data) {
        console.log('Chatterbox: messages received. Data: ', data);
        displayMessages(data);
        populateRooms(data.results);
        highlightFriends();
      },
      error: function(data) {
        console.error('Chatterbox: failed to send message. Data: ', data);
      }
    });
  };

  getMessages();
  setInterval(getMessages, 15000);

  $('form').submit(function(event) {
    var messageContent = $('#messageInput').val();
    $('#messageInput').val('');
    processSubmitForm(username, messageContent);
    event.preventDefault();
  })

  var saveRoom = function() {
    var selectIndex = $('#roomSelect').prop('selectedIndex');
    if(selectIndex === 0) {
      var newRoom = prompt("Enter room name");
      if(newRoom) {
        currentRoom = newRoom;
        console.log('current: ' + currentRoom + 'new: ' + newRoom);
        addRoom(newRoom);
        $('#roomSelect').val(newRoom);
        console.log($('#roomSelect'));
        getMessages();
      }
    } else {
      currentRoom = $('#roomSelect').val();
      getMessages();
    }
  };

  var addRoom = function(roomname) {
    // $('#roomSelect').append($('<option />').val(room).text(room));

    var $option = $('<option/>').val(roomname).text(roomname);

       // Add to select
       $('#roomSelect').append($option);
  }

  var populateRooms = function(results) {
    $('#roomSelect').html('<option value="_new-room">Enter new room</option><option value="lobby" selected>lobby</option>');
    var rooms = {lobby: true};
    _.each(results, function(item) {
      var roomname = item.roomname;
      if(roomname && !rooms[roomname]) {
        addRoom(roomname);
        rooms[roomname] = true;
      }
    });
    $('#roomSelect').val(currentRoom);
  }

  $('#roomSelect').change(function() {
    saveRoom();
  });

});
