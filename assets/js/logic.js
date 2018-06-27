// Initialize Firebase
var config = {
    apiKey: "AIzaSyA2ur9hFPspisF8nBwMe_47k0o-w887SqY",
    authDomain: "rockpaperscissor-7de6e.firebaseapp.com",
    databaseURL: "https://rockpaperscissor-7de6e.firebaseio.com",
    projectId: "rockpaperscissor-7de6e",
    storageBucket: "rockpaperscissor-7de6e.appspot.com",
    messagingSenderId: "332390958320"
};
firebase.initializeApp(config);
var database = firebase.database();

firebase.auth().signInAnonymously();

firebase.auth().onAuthStateChanged(firebaseUser => {
    console.log(firebaseUser);
});

var username = prompt("What shall be your username?");
var userList = [];
$($("<h3>").text("Hello " + username)).insertAfter($("h1"));

database.ref(".info/connected").on("value", function (data) {
    if (data.val()) {
        var con = database.ref("/connections").push(username);
        con.onDisconnect().remove();
    }
});

database.ref("/connections").on("value", function (data) {
    var keys = Object.keys(data.val());
    console.log(keys);
});

$("#post-chat").on("click", function (event) {
    event.preventDefault();
    var newPost = $("#chat-textbox").val().trim();
    if (newPost === "clear") {
        currentChat = [""];
    }
    else if (newPost) {
        currentChat.push("<strong>" + username + "</strong>" + ": " + newPost);
    }
    $("#chat-textbox").val("");
    database.ref("/main").set({
        chat: currentChat
    })
})




