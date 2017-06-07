$(document).ready(function() {
  loadCustomers();
  console.log('js loaded');

  $("ul").on("click", "button", function() {
    console.log('in orders on click');
    var getId = $(this).attr('id');
    console.log(getId);
    $.ajax({
      type: 'GET',
      url: '/orders/' + getId,
      success: function(response) {
        console.log(response);

      } //end success
    }); //end Ajax
  });

  function loadCustomers() {
    $.ajax({
      url: '/customers',
      type: 'GET',
      success: function(response) {
        console.log('got some customers: ', response);
        for (var i = 0; i < response.length; i++) {
          var id = response[i].id;
          var name = response[i].first_name + ' ' + response[i].last_name;
          console.log(name);
          var $li = $('<li>');
          $li.append(name);
          $li.append($('<button id=' + id + '>Orders</button>'));
          $('ul').append($li);
          console.log($li);
        } // end for loop
      } // end success
    }); //end ajax
  }



});
