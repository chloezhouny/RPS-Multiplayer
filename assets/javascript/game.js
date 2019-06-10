$(document).ready(function () {

var user1 = {
			    name: "",
			    message: "",
			    choice: "",
			    result: "",
			  };


var user2 = {
			    name: "",
			    message: "",
			    choice: "",
			    result: "",
			  };

var self = "";

const firebaseConfig = {
  apiKey: "AIzaSyCmaNJzL_ZrCwE1DTPCdB0YkCICRCUImBM",
  authDomain: "rpg-multiplayer-7748c.firebaseapp.com",
  databaseURL: "https://rpg-multiplayer-7748c.firebaseio.com",
  projectId: "rpg-multiplayer-7748c",
  storageBucket: "rpg-multiplayer-7748c.appspot.com",
  messagingSenderId: "96490861975",
  appId: "1:96490861975:web:cc0b3c1b041de288"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();


// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

	  // If they are connected..
	  if (snap.val()) {

	    // Add user to the connections list.
	    var con = connectionsRef.push(true);

	    // Remove user from the connection list when they disconnect.
	    con.onDisconnect().remove();
	  }
	  else
	  {
	  	database.ref('/users/' + self).set(null);
	  }

	});



		database.ref("/users").on("value", function(snapshot) {
	  		
	  		console.log(snapshot.val());

			if ((snapshot.child("user1").exists()) && (snapshot.child("user2").exists()))
			{
				user1.name = snapshot.child("user1").val().name;
			  	user1.choice = snapshot.child("user1").val().choice;
			  	user1.message = snapshot.child("user1").val().message;
	

			  	user2.name = snapshot.child("user2").val().name;
			  	user2.choice = snapshot.child("user2").val().choice;
			  	user2.message = snapshot.child("user2").val().message;

			  	 
			  	  $("#messageHistory").append(user1.message);
			  	  $("#messageHistory").append(user2.message);
			}
			else
			{

			}

			console.log(snapshot.val());
		}, function(errorObject) {
	      console.log("The read failed: " + errorObject.code);
	});







$(document).on("click", "#submitName", function(event) {
  event.preventDefault();
  
  var name = $("#name").val();

  // Grabs user input 
   database.ref("/users").once('value', function(snapshot)
	  {
	  		console.log(snapshot.val());
		  	if (!snapshot.hasChild('user1'))
		  	{
		  		self = "user1";
		  		database.ref('/users/user1').set({
		  			name: name,
		  			message: "",
			    	choice: null,
		  		});
		  		console.log(self);

		  	}
		  	else if (!snapshot.hasChild('user2'))
			{
				self = "user2";
		  		database.ref('/users/user2').set({
		  			name: name,
		  			message: "",
			    	choice: null,
		  		});
		  		console.log(self);
		  	}
		  	else 
		  	{
		  		alert("Only two users are allowed to play.");
		  	}
	  })   
    });


$(document).on("click", ".choices", function(event) {
  	event.preventDefault();

  // Grabs user choice 
    var choice = $(this).attr("data-choice");
    console.log(choice);

	  		if (self === "user1")
	  		{
	  			console.log()
	  			database.ref("/users/user1").child('choice').set(choice);
	  		}

	  		else if (self === "user2")
	  		{

	  			database.ref("/users/user2").child('choice').set(choice);
	  		}
		  	


// Get results for user1 and user2
	
	  var user1Choice = user1.choice;
	  var user2Choice = user2.choice;

	  console.log(user1Choice);
	  console.log(user2Choice);

	  if ((user1Choice !== null) && (user2Choice !== null))
	  {
	  	user1Choice = user1.choice;
	    user2Choice = user2.choice;

		if (user1Choice === user2Choice)
		{
			user1.result = "Tie";
			user2.result = "Tie";
			
		}
		else 
		{
			user1Choice = user1.choice;
	    	user2Choice = user2.choice;
			console.log("else");
			if ((user1Choice=== "rock") && (user2Choice === "paper") )
			{
				user1.result = "Lose";
				user2.result = "Win";		
			}

			else if ((user1Choice === "rock") && (user2Choice === "scissors"))
			{
				user1.result= "Win";
				user2.result = "Lose";		
			}

			else if ((user1Choice === "paper") && (user2Choice === "rock"))
			{
				user1.result = "Win";
				user2.result = "Lose";		
			}

			else if ((user1Choice === "paper") && (user2Choice === "scissors")) 
			{
				user1.result = "Lose";
				user2.result = "Win";		
			}

			else if ((user1Choice === "scissors") && (user2Choice === "paper")) 
			{
				user1.result = "Win";
				user2.result= "Lose";		
			}

			else if ((user1Choice === "scissors") && (user2Choice === "rock")) 
			{
				user1.result = "Lose";
				user2.result = "Win";		
			}

		}

		console.log(user1.result);
		console.log(user2.result);


			if (self === "user1")
	  		{
	  			$("#result").text(user1.result);
	  			
				database.ref("/users/user1").child('choice').set(null);
	
	  		}

	  		else (self === "user2")
	  		{
	  			$("#result").text(user2.result);
	  			database.ref("/users/user2").child('choice').set(null);
	  		}
	}



			
});




$(document).on("click", "#submitMessage", function(event) {

				var message = $("#message").val();

				if (self === "user1")
		  		{
		  			database.ref('/users/user1').child('message').set(message);

		  		}

		  		else (self === "user2")
		  		{

		  			database.ref('/users/user2').child('message').set(message);
		  		}	  			  		

	});

});


