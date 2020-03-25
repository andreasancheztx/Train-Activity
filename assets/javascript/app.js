// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCx7hzOumKwbucT6D9gZyx1HpFApXm9NcE",
  authDomain: "train-activity-7bb56.firebaseapp.com",
  databaseURL: "https://train-activity-7bb56.firebaseio.com",
  projectId: "train-activity-7bb56",
  storageBucket: "train-activity-7bb56.appspot.com",
  messagingSenderId: "2871436764",
  appId: "1:2871436764:web:ffed1dda38be3735f95b19",
  measurementId: "G-VNDH8QHG1N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var trainName = "";
var destination = "";
var time = "";
var frequency = "";

setInterval(function (startTime) {
  $("#timer").html(moment().format('hh:mm a'))
}, 1000);

$("#submitButton").on("click", function (event) {
  // prevents from refreshing page
  event.preventDefault();
  // retrieves data from inputs and stores it in a val
  trainName = $("#newTrainName").val().trim();
  destination = $("#newDestination").val().trim();
  time = $("#newFirstTrainTime").val().trim();
  frequency = $("#newTrainFrequency").val().trim();

  // console.log(trainName);
  // console.log(destination);
  // console.log(time);
  // console.log(frequency);
  // pushes value into database 
  console.log(moment(time).isValid())
  if (trainName && destination && time && isNaN(frequency)) {
    var train = {
      name: trainName,
      destination: destination,
      time: time,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    }
    database.ref().push(train)



  }
  // clears input fields
  $("#newTrainName").val("");
  $("#newDestination").val("");
  $("#newFirstTrainTime").val("");
  $("#newTrainFrequency").val("");
})

database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val())
  // Log everything that's coming out of snapshot
  var train = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().time;
  var frequency = childSnapshot.val().frequency;
  var dateAdded = childSnapshot.val().dateAdded;

  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

  //determine Current Time
  var currentTime = moment();

  //get timer functioning and display to timer span
  $("#timer").text(currentTime.format("hh:mm a"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;

  //determine Minutes Away
  var minutesAway = frequency - tRemainder;

  //determine Next Train Arrival
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

  $("#trainData").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>")
});