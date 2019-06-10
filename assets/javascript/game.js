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





database.ref().on("value", function(snapshot) {
  		
  		console.log(snapshot.val());

		if ((snapshot.child("user1").exists()) && (snapshot.child("user2").exists()))
		{
			user1.name = snapshot.child("user1").val().name;
		  	user1.choice = snapshot.child("user1").val().choice;
		  	user1.message = snapshot.child("user1").val().message;
		  	user1.result = snapshot.child("user1").val().result;

		  	user2.name = snapshot.child("user2").val().name;
		  	user2.choice = snapshot.child("user2").val().choice;
		  	user2.message = snapshot.child("user2").val().message;
		  	user2.result = snapshot.child("user2").val().result;

		  	  $("#result").append(user1.name + ":" + snapshot.val().user1.result); 
		  	  $("#result").append(user2.name + ":" + snapshot.val().user2.result); 
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







$("#submitName").on("click", function(event) {
  event.preventDefault();
  
  var name = $("#name").val();

  // Grabs user input 
   database.ref().once('value', function(snapshot)
	  {
	  		console.log(snapshot.val());
		  	if (!snapshot.hasChild('user1'))
		  	{
		  		self = "user1";
		  		database.ref('user1').set({
		  			name: name,
		  			message: "",
			    	choice: "",
			    	result: "",
		  		});

		  	}
		  	else if (!snapshot.hasChild('user2'))
			{
				self = "user2";
		  		database.ref('user2').set({
		  			name: name
		  			message: "",
			    	choice: "",
			    	result: "",
		  		});
		  	}
		  	else 
		  	{
		  		alert("Only two users are allowed to play.");
		  	}
	  })   
    });
});


$("#choices").on("click", function(event) {
  event.preventDefault();

  // Grabs user choice 
    var choice = $(this).attr(data-choice);


	  database.ref().on('value', function(snapshot)
	  {
	  		if (self === "user1")
	  		{
	  			database.ref('user1').set({
			    	choice: choice,
		  		});
	  		}

	  		else (self === "user2")
	  		{

	  			database.ref('user2').set({
			    	choice: choice,
		  		});
	  		}
		  	
	  })

// Get results for user1 and user2
	  var user1Choice = user1.choice;
	  var user2Choice = user2.choice;



		if (user1Choice === user2Choice)
		{
			user1.result = "Tie";
			user2.result = "Tie";
			
		}
		else 
		{
			if (user1Choice=== "rock") && (user2Choice === "paper") 
			{
				user1.result = "Lose";
				user2.result = "Win";		
			}

			else if (user1Choice === "rock") && (user2Choice === "scissors") 
			{
				user1.result= "Win";
				user2.result = "Lose";		
			}

			else if (user1Choice === "paper") && (user2Choice === "rock") 
			{
				user1.result = "Win";
				user2.result = "Lose";		
			}

			else if (user1Choice === "paper") && (user2Choice === "scissors") 
			{
				user1.result = "Lose";
				user2.result = "Win";		
			}

			else if (user1Choice === "scissors") && (user2Choice === "paper") 
			{
				user1.result = "Win";
				user2.result= "Lose";		
			}

			else if (user1Choice === "scissors") && (user2Choice === "rock") 
			{
				user1.result = "Lose";
				user2.result = "Win";		
			}

		}

//Update results to database
			database.ref('user1').set({
			    	result: user1.result,
		  		});
	  		
	  		database.ref('user2').set({
			    	result: user2.result
		  		});
	  		
});


$("#submitMessage").on("click", function(event) {

	var message = $("#message").val();

			if (self === "user1")
	  		{
	  			database.ref('user1').set({
			    	message: message,
		  		});
	  		}

	  		else (self === "user2")
	  		{

	  			database.ref('user2').set({
			    	message: message,
		  		});
	  		}
		  	

 
}


