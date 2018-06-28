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

});

var username;
while (!username) {
    var username = prompt("What shall be your username?");
}

var competitor = "";
var ready = false;
var timeOut;
var interval;
var wins = 0;
var losses = 0;
var theirChoice = "";
var myChoice = "";

database.ref("/players/" + username).set({
    "wins": 0,
    "losses": 0,
    "competitor": "",
    "choice": ""
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
        else {
            clearInterval(interval);
            $("#battle-area").html($("<p>").addClass("outline").text("Rock").attr("data-pick", "rock")).append($("<p>").addClass("outline").text("Paper").attr("data-pick", "paper")).append($("<p>").addClass("outline").text("Scissors").attr("data-pick", "scissors"));
            database.ref(`/players/${competitor}/choice`).on("value", function (data) {
                theirChoice = data.val();
                if (myChoice) {
                    findWinner();
                }
            });
        }
    }, 1000);

    timeOut = setTimeout(function () {
        myChoice = "timed out";
        database.ref(`/players/${username}/choice`).set("timed out");
    }, 8000);
}

var findWinner = function () {
    if ((myChoice === "rock" && theirChoice === "scissors") || (myChoice === "scissors" && theirChoice === "paper") || (myChoice === "paper" && theirChoice === "rock")) {
        //i win
        database.ref(`/players/${username}/wins`).set(++wins);
        $("#battle-area").html($("<p>").addClass("number").text(myChoice + " beats " + theirChoice)).append($("<p>").addClass("number").text("You Win!"));
    }
    else if ((theirChoice === "rock" && myChoice === "scissors") || (theirChoice === "scissors" && myChoice === "paper") || (theirChoice === "paper" && myChoice === "rock")) {
        //i lose
        database.ref(`/players/${username}/losses`).set(++losses);
        $("#battle-area").html($("<p>").addClass("number").text(theirChoice + " beats " + myChoice)).append($("<p>").addClass("number").text("You Lose!"));
    }
    else if (myChoice === "timed out") {
        //i time out
        database.ref(`/players/${username}/losses`).set(++losses);
        $("#battle-area").html($("<p>").addClass("number").text("You timed out")).append($("<p>").addClass("number").text("You Lose!"));
    }
    else if (myChoice === theirChoice && myChoice !=="timed out") {
        //tie
        $("#battle-area").html($("<p>").addClass("number").text("You both picked " + myChoice)).append($("<p>").addClass("number").text("It's a tie!"));
    }
    else if (theirChoice==="timed out") {
        //opponent timed out
        database.ref(`/players/${username}/wins`).set(++wins);
        $("#battle-area").html($("<p>").addClass("number").text("Opponent timed out")).append($("<p>").addClass("number").text("You Win!"));
    }
    database.ref(`players/${competitor}/competitor`).off();
    competitor = "";
    database.ref(`/players/${username}/competitor`).set("");
    database.ref(`/players/${username}/choice`).set("");
    theirChoice = "";
    myChoice = "";
    ready = false;
    setTimeout(writeStats, 3000);
}

var writeStats = function () {
    $("#battle-area").html($("<div>").text("Games: "+(wins+losses)).append($("<div>").text("Wins: "+wins)).append($("<div>").text("Losses: "+losses)));
    //show games wins losses and leaderboard

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
        userList.push(data.val()[element]);
    });
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
    if (!data.val()) {
        return;
    }

    //i'm challenged
    if (data.val() && !ready) {
        competitor = data.val();
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

database.ref(`/players/${username}/choice`).on("value", function (data) {
    myChoice = data.val();
    console.log(myChoice);
    if (theirChoice) {
        findWinner();
    }
});

/////////////////////////////////////////////////////////////////////////////
// database.ref(`/players/${competitor}/choice`).on("value", function (data) {
//     theirChoice = data.val();
//     if (myChoice) {
//         findWinner();
//     }
// });
////////////////////////////////////////////////////////////////////////////////

$("#post-chat").on("click", function (event) {
    event.preventDefault();
    var newPost = $("#chat-textbox").val().trim();
    updateChat(newPost);
    $("#chat-textbox").val("");
})

$(document).on("click", ".competitor", function () {
    ready = true;
    competitor = $(this).attr("data-competitor");
    database.ref(`players/${competitor}/competitor`).set(username);
});

$(document).on("click", ".outline", function () {
    clearTimeout(timeOut);
    ready = false;
    database.ref(`/players/${username}/choice`).set($(this).attr("data-pick"));
});


writeStats();



