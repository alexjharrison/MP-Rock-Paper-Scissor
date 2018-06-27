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
    console.log(firebaseUser.uid);
});

var username = prompt("What shall be your username?");
var userList = [];
$($("<h3>").text("Hello " + username)).insertAfter($("h1"));
// database.ref("/chat").set({
//     chat: [""]
// });

var generateButtons = function() {
    $("#buttons").empty();
    userList.forEach(user => {
        if(user !== username)
        var newButton = $("<button>").attr("data-competitor",user).addClass("competitor").text(user);
        $("#buttons").append(newButton);
    });
}

var updateChat = function(itemToAdd) {
    if(itemToAdd==="clear") {
        database.ref("/chat").set({  });
        $(".chat-window").empty();
    }
    else if(itemToAdd==="reset") {
        resetLeaderboard();
    }
    else if(itemToAdd) {
        database.ref("/chat").push("<strong>" + username + "</strong>" + ": " + itemToAdd);
    }
}

var resetLeaderboard = function() {

}

database.ref(".info/connected").on("value", function (data) {
    if (data.val()) {
        var con = database.ref("/connections").push(username);
        con.onDisconnect().remove();
    }
});

database.ref("/connections").on("value", function (data) {
    var keys = Object.keys(data.val());
    userList = [];
    keys.forEach(element => {
        console.log("element",element)
        console.log("data.val",data.val())
        userList.push(data.val()[element]);
    });
    console.log("userlist",userList);
    generateButtons();
});

database.ref("/chat").on("value", function (data) {
    try { var keys = Object.keys(data.val()); }
    catch {
        $(".chat-window").empty();
        return;
    }
    $(".chat-window").empty();
    keys.forEach(element => {
        $(".chat-window").append($("<p>").html(data.val()[element]));
    });
});


$("#post-chat").on("click", function (event) {
    event.preventDefault();
    var newPost = $("#chat-textbox").val().trim();
    updateChat(newPost);
    $("#chat-textbox").val("");
})




