$(document).ready(function () {

	jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
	});



	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//Canvas for Dices 



	var target1;
	var target2;


	//Give light
	var result;
	var scene = new THREE.Scene();
		var pointLight = new THREE.PointLight( 0xffffff, 1.5, 300);
		pointLight.position.set( 100, 0, 100 );
		scene.add( pointLight );
		var pointLight = new THREE.PointLight( 0xffffff, 1.5, 300 );
		pointLight.position.set( -70, 0, 100 );
		scene.add( pointLight );

	//Camera
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	//Display
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
	document.body.appendChild(renderer.domElement );



	// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = 	new THREE.MeshStandardMaterial({metalness: 0.2, roughness: 0.2});;
	
	//load dice.stl, create cubes and animate
		var loader = new THREE.STLLoader();
		camera.position.z = 100;
		loader.load( 'assets/images/Dice1.stl', function ( geometry ) {

			cube = new THREE.Mesh( geometry, material);
			cube.position.x = -50;
			scene.add(cube);

			cube2 = new THREE.Mesh( geometry, material);
			cube2.position.x = 50;			
			scene.add(cube2); 
			renderer.render( scene, camera );	
		 });


	//Stop points for 3 results 
	var dict1 = {
	 'paper' :[0.3,-1.6, 0.4],
	 'rock' : [1.8, -1.65, 0.3],
	'scissors' : [0, 0, 0]
	}

	var dict2 = {
	 'paper' :[-0.05, 1.5, -0.2],
	 'rock' : [-1.2, 1.55, -0.3],
	 'scissors':  [0, 0, 0]
	}

	var speed = 0.3;   			
	var rotate = true;

	

	//Compare end point angle
	var IsSameAngle = function(x, y)
	{
		var diff = Math.abs(x - y);
		return Math.abs(diff-Math.round(diff / Math.PI) * Math.PI) < 0.006;
	}


	//roll dice animation
 	var animate = function () {
	 	
	 	requestAnimationFrame( animate );

	 	if (rotate)
	 	{
	 		if (speed < 0.01)
		 	{
		 		rotate = false;
		 		if (!IsSameAngle(cube.rotation.x, target1[0]))
		 		{
	 				cube.rotation.x -= speed;
	 				rotate = true;
		 		}
		 		if (!IsSameAngle(cube.rotation.y, target1[1]))
		 		{
	 				cube.rotation.y -= speed;
	 				rotate = true;
		 		}
		 		if (!IsSameAngle(cube.rotation.z, target1[2]))
		 		{
	 				cube.rotation.z -= speed;
	 				rotate = true;
		 		}
		 		if (!IsSameAngle(cube2.rotation.x, target2[0]))
		 		{
	 				cube2.rotation.x -= speed;
	 				rotate = true;
		 		}
		 		if (!IsSameAngle(cube2.rotation.y, target2[1]))
		 		{
	 				cube2.rotation.y -= speed;
	 				rotate = true;
		 		}
		 		if (!IsSameAngle(cube2.rotation.z, target2[2]))
		 		{
	 				cube2.rotation.z -= speed;
	 				rotate = true;
		 		}
		 	}
		 	else
		 	{
			 	cube.rotation.x -= speed;
			 	cube.rotation.y -= speed;
			 	//cube.rotation.z -= speed * 3;

			 	cube2.rotation.x -= speed * 0.8;
			 	cube2.rotation.y -= speed * 1.2;
			 	//cube2.rotation.z -= speed;
			 	speed = speed - 0.001;
		 	}

	 
	 	renderer.render( scene, camera );	

	 	}
	 }







	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//Firbase
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




	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
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
		  	database.ref('/users/').set(null);
		  	database.ref("/messages").set(null);
		  }
		});






	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	var user1 = {
				    name: "",
				    choice: "",
				    result: "",
				    allow: ""
				  };

	var user2 = {
				    name: "",
				    choice: "",
				    result: "",
				    allow: ""

				  };
	var message;
	var self = "";





	// Get game for user1 and user2
	function getResult()
	{
		  var user1Choice = user1.choice;
		  var user2Choice = user2.choice;


		  console.log(user1Choice);
		  console.log(user2Choice);

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
					user1.result = "You Lose..";
					user2.result = "You Win!";		
				}

				else if ((user1Choice === "rock") && (user2Choice === "scissors"))
				{
					user1.result= "You Win!";
					user2.result = "You Lose..";		
				}

				else if ((user1Choice === "paper") && (user2Choice === "rock"))
				{
					user1.result = "You Win!";
					user2.result = "You Lose..";		
				}

				else if ((user1Choice === "paper") && (user2Choice === "scissors")) 
				{
					user1.result = "You Lose..";
					user2.result = "You Win!";		
				}

				else if ((user1Choice === "scissors") && (user2Choice === "paper")) 
				{
					user1.result = "You Win!";
					user2.result= "You Lose..";		
				}

				else if ((user1Choice === "scissors") && (user2Choice === "rock")) 
				{
					user1.result = "You Lose..";
					user2.result = "You Win!";		
				}

			}

			console.log(user1.result);
			console.log(user2.result);


				if (self === "user1")
		  		{
		  			$("#result").text(user1.result);
					
		
		  		}

		  		else if (self === "user2")
		  		{
		  			$("#result").text(user2.result);
		  			
		  		}
		
	}


// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
//Start Game
	$("#nameContainer").show(); 
	$("#choiceContainer").hide();
	$("#resultContainer").hide();
	$("#chatContainer").hide();


	var start = false;





	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//users name and choice value change listener 
	database.ref("/users").on("value", function(snapshot) {
  		
  		console.log(snapshot.val());

		if ((snapshot.child("user1").exists()) && (snapshot.child("user2").exists()))
		{
			user1.name = snapshot.child("user1").val().name;
		  	user1.choice = snapshot.child("user1").val().choice;
		  	

		  	user2.name = snapshot.child("user2").val().name;
		  	user2.choice = snapshot.child("user2").val().choice;

		  	$("#choiceContainer").show();
		  	$("#chatContainer").show();
			$("#resultContainer").hide();
		  	
		}
		 if ((snapshot.child("user1").child("choice").exists() && (snapshot.child("user2").child("choice").exists())))
		{

			$("#resultContainer").show();
			$("#choiceContainer").hide();

			if (self === "user1")
			{
				target1 = dict1[user1.choice];
				target2 = dict2[user2.choice]
			}
			else if (self === "user2")
			{
				target2 = dict2[user1.choice];
				target1 = dict1[user2.choice];
			}

			speed = 0.3;   			
			rotate = true;

			animate();
			setTimeout(function(){
				
				getResult();

				setTimeout(function()
				{
					$("#result").html("");					
					database.ref("/users/user1").child('choice').set(null);
					database.ref("/users/user2").child('choice').set(null);

				}, 10000);

				
			}, 10000);
			


		}

		console.log(snapshot.val());
	}, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
});





	
	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//users message value change listener 
	database.ref("/messages").on("value", function(snapshot) {

		message = snapshot.val();
 		
		$("#messageHistory").html(message);

	});









	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//Submit Name on click
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
			  		});
			  		console.log(self);
			  		$("#nameContainer").hide();	

			  	}
			  	else if (!snapshot.hasChild('user2'))
				{
					self = "user2";
			  		database.ref('/users/user2').set({
			  			name: name,
			  		});
			  		console.log(self);
			  		$("#nameContainer").hide();	
			  		
			  		start = true;
			  		
			  	}
			  	else 
			  	{		  		
			  		alert("Only two users are allowed to play.");

			  	}


		  })   
	    });









	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//submit choice on click
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
				
	});







	// ------------------------------------ (CRITICAL - BLOCK) --------------------------- //
	//submit message onclick
	$(document).on("click", "#submitMessage", function(event) {

					var message = $("#message").val();

					if (self === "user1")
			  		{
			  			database.ref('/messages').set(user1.name + ":" + message + "<br>");

			  		}

			  		else if(self === "user2")
			  		{

			  			database.ref('/messages').set(user2.name + ":" + message + "<br>");
			  		}	  			  		

		});

});
