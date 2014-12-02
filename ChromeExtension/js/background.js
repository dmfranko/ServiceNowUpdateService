// What SN instance to hit.  We get this from the notification service.
var snendpoint = "";

function showNotification() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://" + URI(document.querySelector('#endpoint').value).host() + "/newTickets/" + document.querySelector('#userid').value, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			obj = JSON.parse(xhr.responseText);
			obj.forEach(function(entry) {
				var options = {
					iconUrl : "/images/servicenow-icon.png",
					title : "ServiceNow",
					message : "New Ticket assigned! " + entry,
					buttons : [{
						title : "Open in ServiceNow",
						iconUrl : "/images/ic_open_in_browser_24px.svg"
					}],
					type : "basic",
					priority : 0
				};
				/*
				This will gurantee a unique ID everytime.
				Notifications with the same ID won't be shown again.	 
				*/
				chrome.notifications.create((entry + "&" + Date.now() + Math.floor((Math.random() * 100) + 1)).toString(),
				options,
				function() {});
			});

			/* Respond to the user's clicking one of the buttons */
			chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
				window.open("https://" + snendpoint + "/nav_to.do?uri=incident.do?sysparm_query=number=" + notifId);
			});

		};
	};
	xhr.send();
};

onload = function() {
	document.querySelector('#permissions').addEventListener('click', function(event) {
        chrome.permissions.request({
          origins: [URI(document.querySelector('#endpoint').value).href()]
        }, function(granted) {
          // The callback argument will be true if the user granted the permissions.
          if (granted) {
            document.querySelector('#start').disabled = false;
          } else {
            document.querySelector('#start').disabled = true;
          }
        });
      });

	
	// Allow the user to start showing the notifications
	document.querySelector('#start').onclick = function() {
		showNotification();
		timer = setInterval(function() {showNotification();}, 5000);

		document.querySelector('#stop').disabled = false;
		document.querySelector('#start').disabled = true;
		document.querySelector('#userid').disabled = true;
		document.querySelector('#endpoint').disabled = true;

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://" + URI(document.querySelector('#endpoint').value).host() + "/snurl", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				snendpoint = JSON.parse(xhr.responseText);;
			};
		};
		xhr.send();
	};

	// Allow the user to stop showing the notifications
	document.querySelector('#stop').onclick = function() {
		if (timer)
			clearInterval(timer);

		document.querySelector('#stop').disabled = true;
		document.querySelector('#start').disabled = false;
		document.querySelector('#userid').disabled = false;
		document.querySelector('#endpoint').disabled = false;
	};
};
