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
        $('#info').empty();
        console.log(response);
        for (var i = 0; i < response.length; i++) {
          var product = (response[i].unit_price * response[i].quantity);
          if ($('#order' + response[i].id).length) {
            $('#order' + response[i].id + ' > ul').append('<li data-lineItemTotal="' + product + '">' + response[i].description + ' ' + response[i].unit_price + ' ' + response[i].quantity + '</li>');
          } else {
            var $div = $('<div>');
            $div.attr('id', ("order" + response[i].id));
            $div.addClass('orderContainer');
            $div.append("<p id='orderNum'> Order Number: " + response[i].id + "</p>");
            $div.append("<p id='address'> Address: " + response[i].street + "</p>");
            $div.append("<p id='lineItems'> Line Items: " + '</p><ul><li data-lineItemTotal="' + product + '">' + response[i].description + ' ' + response[i].unit_price + ' ' + response[i].quantity + "</li></ul>");
            $('#info').append($div);
          }
        }
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

}); // end document ready
