# MP-Rock-Paper-Scissor

This game uses firebase to store all of the current players along with their stats and game status.

Upon login, a prompt encourages users to create a username.  All others in the game will refer to that individual by that username until the session is ended.

It allows for as many simultaneous players that firebase can handle.  A list of players with the game open is generated on the left panel (besides one's self, of course).  Once you click an opponent, they receive a notification that they have been challenged.  When they acknowledge it, the game starts with a countdown of three seconds  and they have 3 more seconds to pick an answer before their choices timeout.

I think there's a win/loss tallying bug still in there somewhere if users timeout.  Maybe I'll get around to that particular bug.

The number of each individual's wins and losses are updated after each game and logged in the server.

On the right is a real-time chat window where all logged in users can post.  All posts are stored indefinitely so new users can rewind to posts before they loaded the page.  If the chat gets too long, anyone can type "clear" in the chat and the history is erased.

Built in is a checker that tells you if you challenged someone who is already in a match with someone else.  It says to try again at a later time as to not screw up their current game.

As soon as you disconnect from the page, your stats along with the button on everyone else's open windows disappear.

The game can be opened in multiple tabs if no one else is online and one wants to test functionality.

Enjoy!