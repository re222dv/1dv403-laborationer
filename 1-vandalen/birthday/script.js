"use strict";

window.onload = function(){


	var birthday = function(date){
        if (date.match(/^\d\d\d\d-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|(3[0-1]))$/) === null) {
            throw new Error('Ange ett datum i formatet YYYY-MM-DD');
        }

        var now = new Date();
        var birthday = new Date(date+'T23:59:59');
        if (isNaN(birthday.getTime())) {
            throw new Error('Den dagen finns inte');
        }

        birthday.setFullYear(now.getFullYear());
        if (birthday.getTime() - now.getTime() < 0) {
            birthday.setFullYear(now.getFullYear()+1);
        }

        return Math.floor((birthday.getTime() - now.getTime()) / (1000*60*60*24));
	};
	// ------------------------------------------------------------------------------


	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#string");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		p.classList.remove( "error");

		try {
			var answer = birthday(input.value) // Läser in texten från textrutan och skickar till funktionen "convertString"
			var message;
			switch (answer){
				case 0: message = "Grattis på födelsedagen!";
					break;
				case 1: message = "Du fyller år imorgon!";
					break;
				default: message = "Du fyller år om " + answer + " dagar";
					break;
			}

			p.innerHTML = message;
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};