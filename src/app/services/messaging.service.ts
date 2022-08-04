import { BaseLoaderService } from './base-loader.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
// import { FirebaseApp } from '@angular/fire';
// import { AngularFireMessaging } from '@angular/fire/messaging';
// import { BehaviorSubject } from 'rxjs'

@Injectable()

export class MessagingService {

  fbConf = {
    apiKey: "AIzaSyBSa0rTT1R_80J7Jwk1_Lqop2wYJ1V7XHw",
    authDomain: "urban-point-b1b54.firebaseapp.com",
    databaseURL: "https://urban-point-b1b54.firebaseio.com",
    projectId: "urban-point-b1b54",
    storageBucket: "urban-point-b1b54.appspot.com",
    messagingSenderId: "144540717075",
    appId: "1:144540717075:web:d22cdc1a7a875e41c02fe6"
  };

// currentMessage = new BehaviorSubject(null);

constructor(private baserService: BaseLoaderService) {
  }

//   requestPermission() {
//     this.angularFireMessaging.requestToken.subscribe(
//     (token) => {
//     console.log(token);
//     });
//   }

//   receiveMessage() {
//     this.angularFireMessaging.messages.subscribe(
//     (msg) => {
//     console.log("show message!", msg);
//     this.currentMessage.next(msg);
//        })
//     }

init() {
  if(!firebase.apps.length)
      firebase.initializeApp(this.fbConf);
}

getPermission() {
  const  messaging = firebase.messaging();
  messaging.requestPermission()
      .then(function() {
          console.log('Notification permission granted.');

            navigator.serviceWorker.register('firebase-messaging-sw.js')
            .then(function(registration) {
                messaging.useServiceWorker(registration);
                messaging.getToken().then((currentToken) => {
                  if (currentToken) {
                    localStorage.removeItem('deviceToken');
                    localStorage.setItem('deviceToken', currentToken);
                    console.log(currentToken);
                  } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                  }
                }).catch((err) => {
                  console.log('An error occurred while retrieving token. ', err);
                });
            });
            console.log('Notification permission granted.');


          // messaging.getToken()
          //     .then(function(currentToken) {
          //         if (currentToken) {
          //             localStorage.removeItem('deviceToken');
          //             localStorage.setItem('deviceToken', currentToken);
          //             console.log(currentToken)
          //             return true;
          //         } else {
          //             console.log('No Instance ID token available. Request permission to generate one.');
          //             return false;
          //         }
          //     })
          //     .catch(function(err) {
          //         console.log('An error occurred while retrieving token. ', err);
          //         return false;
          //     });

      })
      .catch(function(err) {
          console.log('Unable to get permission to notify.', err);
          return false;
      });
}

/*getToken() {
  const  messaging = firebase.messaging();
  messaging.getToken()
      .then(function(currentToken) {
          if (currentToken) {
              console.log(currentToken)
          } else {
              console.log('No Instance ID token available. Request permission to generate one.');
          }
      })
      .catch(function(err) {
          console.log('An error occurred while retrieving token. ', err);
      });
}*/

receiveMessage() {
  this.init();
  const  messaging = firebase.messaging();
  messaging.onMessage((payload) => {
    console.log("Message received. ", payload);
    this.baserService.sendPushMsgUpdate();
  });

  // messaging.onBac

}

}
