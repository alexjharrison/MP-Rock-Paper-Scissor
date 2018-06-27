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

var username;
while (!username) {
    var username = prompt("What shall be your username?");
}

var competitor = "";
var ready = false;
var interval;
var wins = 0;
var losses = 0;
var theirChoice = "";
var myChoice = "";

database.ref("/players/" + username).set({
    wins: 0,
    losses: 0,
    competitor: "",
    choice: ""
});


var userList = [];
$($("<h3>").text("Hello " + username).addClass("capitalize")).insertAfter($("h1"));

var generateButtons = function () {
    $("#buttons").empty();
    userList.forEach(user => {
        if (user !== username)
            var newButton = $("<button>").attr("data-competitor", user).addClass("competitor").text(user);
        $("#buttons").append(newButton);
    });
}

var updateChat = function (itemToAdd) {
    if (itemToAdd === "clear") {
        database.ref("/chat").set({});
        $(".chat-window").empty();
    }
    else if (itemToAdd === "reset") {
        resetLeaderboard();
    }
    else if (itemToAdd) {
        database.ref("/chat").push("<strong>" + username + "</strong>" + ": " + itemToAdd);
    }
}

var resetLeaderboard = function () {
    $(".lead").text("");
}

var startFight = function () {
    var count = 4;
    interval = setInterval(function () {
        count--;
        if (count > 0) {
            $("#battle-area").html($("<p>").addClass("number").text(count));
        }
        else if (count > -3) {
            $("#battle-area").html($("<p>").addClass("outline").text("Rock").attr("data-pick","rock")).append($("<p>").addClass("outline").text("Paper").attr("data-pick","paper")).append($("<p>").addClass("outline").text("Scissors").attr("data-pick","scissors"));
            ready = false;
        }
        else if (count > -5) {
            clearInterval(interval);
            $("#battle-area").html($("<p>").addClass("outline").text("You timed out and lost"));
            database.ref(`/players/${username}/losses`).set(++losses);
        }
    }, 1000);


    competitor = "";
    database.ref(`/players/${username}/competitor`).set("");
    database.ref(`/players/${username}/choice`).set("");
    theirChoice = "";
    myChoice = "";
    displayStats();
}

var displayStats = function() {
    //TODO show games wins losses and leaderboard
};

var findWinner = function() { 
    alert("am i here")
    if((myChoice==="rock"&&theirChoice==="scissors")||(myChoice==="scissors"&&theirChoice==="paper")||(myChoice==="paper"&&theirChoice==="rock")) {
        //i win
        database.ref(`/players/${username}/wins`).set(++wins);
        $("#battle-area").html($("<p>").addClass("number").text("You picked "+myChoice)).append($("<p>").addClass("number").text("You picked "+myChoice)).append($("<p>").addClass("number").text("They picked "+theirChoice)).append($("<p>").addClass("number").text("You Win!"))
    }
    else if((theirChoice==="rock"&&myChoice==="scissors")||(theirChoice==="scissors"&&myChoice==="paper")||(theirChoice==="paper"&&myChoice==="rock")) {
        //i lose
        database.ref(`/players/${username}/losses`).set(++losses);
    }
    setTimeout(writeStats(),3000);
}

var writeStats = function() {
    alert("jebus bless");
}

database.ref(".info/connected").on("value", function (data) {
    if (data.val()) {
        var con = database.ref("/connections").push(username);
        con.onDisconnect().remove();
        database.ref("/players/" + username).onDisconnect().remove();
    }
});

database.ref("/connections").on("value", function (data) {
    var keys = Object.keys(data.val());
    userList = [];
    keys.forEach(element => {
        console.log("element", element)
        console.log("data.val", data.val())
        userList.push(data.val()[element]);
    });
    console.log("userlist", userList);
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

database.ref("/players/" + username + "/competitor").on("value", function (data) {
    //i'm challenged
    if (data.val() && !ready) {
        confirm(data.val() + " wants to fight you");
        database.ref(`players/${data.val()}/competitor`).set(username);
        ready = true;
        startFight();
    }
    //start fight
    else if (data.val() && ready) {
        startFight();
    }
})

database.ref(`/players/${username}/choice`).on("value",function (data) {
    myChoice = data.val();
    console.log("mychocie",myChoice);
    console.log("theirchoice",theirChoice);
    console.log(data.val());
    if(theirChoice) {
        findWinner();
    }
});
database.ref(`/players/${competitor}/choice`).on("value",function (data) {
    theirChoice = data.val();
    console.log("chocie",myChoice);
    console.log("eirchoice",theirChoice);
    if(myChoice) {
        findWinner();
    }
});

$("#post-chat").on("click", function (event) {
    event.preventDefault();
    var newPost = $("#chat-textbox").val().trim();
    updateChat(newPost);
    $("#chat-textbox").val("");
})

$(document).on("click", ".competitor", function () {
    ready = true;
    competitor = $(this).attr("data-competitor")
    database.ref(`players/${competitor}/competitor`).set(username);
});

$(document).on("click", ".outline", function () {
    clearInterval(interval);
    ready = false;
    database.ref(`/players/${username}/choice`).set($(this).attr("data-pick"));
});




