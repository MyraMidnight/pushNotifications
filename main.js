const messaging = firebase.messaging();
messaging.usePublicVapidKey("BFaMnQbYJJYEngX8aNIqVirW8m6XPwsAJr2vpy7lU1zl4bNq1lBr4FAUWjCciDimLfIBx0RlOzQG_s7E0clfTzA");
navigator.serviceWorker.register('/pushNotifications/firebase-messaging-sw.js')
.then((registration) => {
    messaging.useServiceWorker(registration);
    messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then(function(currentToken) {
        if (currentToken) {
        sendTokenToServer(currentToken);
        //updateUIForPushEnabled(currentToken);
        } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        //updateUIForPushPermissionRequired();
        //setTokenSentToServer(false);
        }
    }).catch(function(err) {
        console.log('An error occurred while retrieving token. ', err);
        //showToken('Error retrieving Instance ID token. ', err);
        //setTokenSentToServer(false);
    });

    // Request permission and get token.....
});
  
    // ...
}).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
});

const sendTokenToServer = (token)=>{
    document.getElementById("token").innerHTML=token;
    console.log("The token is:",token);
    const data = { token}
    fetch("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}

  // Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
    messaging.getToken().then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // ...
    }).catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      //showToken('Unable to retrieve refreshed token ', err);
    });
  });
  
  messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    // ...
  });
  
