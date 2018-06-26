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
var currentChat = [];
var userList = [];
var username = prompt("What shall be your username?");
$($("<h3>").text("Hello " + username)).insertAfter($("h1"));

database.ref("/main").set({ chat: ["oi"]});



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

database.ref("/main/chat").on("value", function (data) {
    currentChat = data.val();
    console.log(currentChat)
    if (currentChat) {
        $(".chat-window").empty();
        currentChat.forEach(element => {
            $(".chat-window").prepend($("<p>").html(element));
        });
    }
});

database.ref("/main/userlist").on("value", function (data) {
    userList = data.val();
    // if (userList) {
    //     if (!userList.includes(username)) {
    //         userList.push(username);
    //         console.log(username)
    //     }
    // }
    // else {
    //     database.ref("/main").set({
    //         userList: [username]
    //     });
    // }
    

});




