import * as firebase from 'firebase';

const db = firebase.database();

export default class firebaseConn {

   getCurrentUserId() {
    return firebase.auth().currentUser.uid;
  }

  getUserIdByDisplayname(displayname,callback) {
    db.ref("users").orderByChild("displayname").equalTo(displayname).once('value').then(function (snapshot) {
      let important;
      for (var prop in snapshot.val()) {
        important = prop;
      }
      callback(important);
    });
  }

  hacerLlamadaIndividual(llamadoId,payload) {
    db.ref("llamadas/" + llamadoId).push().set({
      'llamada': payload
    });
  }

}
