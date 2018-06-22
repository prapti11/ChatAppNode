jQuery('#signup-form').on('submit',function(e){
e.preventDefault();
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var user=JSON.parse(this.responseText);
      console.log(window.location.href);
      window.location.href='/chat.html?name='+user.name+'&room='+jQuery("[name='room']").val();
    }
  };
  xhttp.open("POST", "http://localhost:3000/api/signup", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var jsonObj={
    name : jQuery("[name='name']").val(),
  	phone : jQuery("[name='phone']").val(),
  	password : jQuery("[name='password']").val()
  };
  xhttp.send(JSON.stringify(jsonObj));
});