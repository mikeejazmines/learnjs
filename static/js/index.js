function ageInDays() {
    var birthYear = prompt("What is your birth day? (YYYY-MM-DD)");

    var birthDate = new Date(birthYear);
    var currDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const diffDays = Math.floor(Math.abs((currDate - birthDate) / oneDay));
    var h1 = document.createElement("h1");
    var textAnswer = document.createTextNode(
        "You are " + diffDays + " days old."
    );
    h1.setAttribute("id", "diffDays");
    h1.appendChild(textAnswer);
    document.getElementById("flex-box-result").appendChild(h1);
}

function reset() {
    document.getElementById("flex-box-result").innerHTML = "";
}

function generatePuppy() {
    var image = document.createElement("img");
    var div = document.getElementById("puppy");
    image.src = "https://media.giphy.com/media/tP3Tu61F2RBZe/giphy.gif";
    div.appendChild(image);
}

function rpsGame(yourChoice) {
    var humanChoice, botChoice;
    var choices = ["rock", "paper", "scissors"];
    humanChoice = yourChoice.id;
    botChoice = choices[Math.round(Math.random() * 2)];

    var results = "";
    var score = decideWinner(humanChoice, botChoice);
    if (score == 0.5) {
        results = ["TIE!", "yellow"];
    } else if (score == 0) {
        results = ["LOSER!", "red"];
    } else {
        results = ["WINNER", "green"];
    }

    var imageDB = {
        rock: document.getElementById("rock").src,
        scissors: document.getElementById("scissors").src,
        paper: document.getElementById("paper").src,
    };

    document.getElementById("rock").remove();
    document.getElementById("scissors").remove();
    document.getElementById("paper").remove();

    //winner
    var image = document.createElement("img");
    var div = document.getElementById("flex-box-rps-div");
    image.src = imageDB[humanChoice];
    image.height = 150;
    image.width = 150;
    div.appendChild(image);

    // text
    var h1 = document.createElement("h1");
    var textAnswer = document.createTextNode(results[0]);
    h1.appendChild(textAnswer);
    h1.style.color = results[1];
    div.appendChild(h1);

    //loser
    var image = document.createElement("img");
    image.src = imageDB[botChoice];
    image.height = 150;
    image.width = 150;
    div.appendChild(image);
}

function decideWinner(yourChoice, botChoice) {
    var decisions = {
        rock: { scissors: 1, rock: 0.5, paper: 0 },
        paper: { rock: 1, paper: 0.5, scissors: 0 },
        scissors: { paper: 1, scissors: 0.5, rock: 0 },
    };

    return decisions[yourChoice][botChoice];
}

function resetC2() {
    document.getElementById("puppy").innerHTML = "";
}

function resetC3() {
    document.getElementById(
        "flex-box-rps-div"
    ).innerHTML = `<img id="rock" src="https://vignette.wikia.nocookie.net/custard/images/0/0b/Rock.png/revision/latest?cb=20180930085333" height=150 width=150 onclick="rpsGame(this)">
    <img id="paper" src="https://img.pngio.com/a-stack-white-paper-png-image-royalty-free-stock-png-images-for-white-paper-png-256_256.png" height=150 width=150 onclick="rpsGame(this)">
    <img id="scissors" src="https://www.shareicon.net/data/2015/10/26/140001_scissors_256x256.png" height=150 width=150 onclick="rpsGame(this)">`;
}

function changeColor(selectValue) {
    var chosenColor = selectValue.value;

    var colors = {
        red: "btn-danger",
        blue: "btn-primary",
        yellow: "btn-warning",
        green: "btn-success",
    };
    var color_keys = Object.keys(colors);

    var buttons = document.getElementsByClassName("btn");
    if (chosenColor == "random") {
        var newColor = color_keys[Math.round(Math.random() * 3)];
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].className = "btn " + colors[newColor];
        }
    } else {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].className = "btn " + colors[chosenColor];
        }
    }
}

let blackjackGame = {
    you: { scoreSpan: "your-blackjack-result", div: "your-box", score: 0 },
    dealer: {
        scoreSpan: "dealer-blackjack-result",
        div: "dealer-box",
        score: 0,
    },
};

const you = blackjackGame["you"];
const dealer = blackjackGame["dealer"];

const cards = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 10,
    Q: 10,
    K: 10,
    A: 1,
};

document.querySelector("#hit-button").addEventListener("click", blackjackHit);
document
    .querySelector("#stand-button")
    .addEventListener("click", blackjackStand);
document.querySelector("#deal-button").addEventListener("click", blackjackDeal);

let yourCards = [];
let dealerCards = [];
let yourStatus = "";
let dealerStatus = "";

function blackjackHit() {
    var image = document.createElement("img");

    var cards_keys = Object.keys(cards);

    var card = cards_keys[Math.round(Math.random() * 12)];

    image.src = "static/images/" + card + ".png";

    playAudio("swish");

    document.getElementById(you["div"]).appendChild(image);

    yourCards.push(card);
    you["score"] = computeScore(yourCards);
    updateView();

    if (you["score"] > 21) {
        document.getElementById(you["scoreSpan"]).innerText += " BUST!";
        document.getElementById(you["scoreSpan"]).style.color = "red";
        document.getElementById("hit-button").disabled = true;
        yourStatus = "BUST";
    }
}

var stopGame = false;

function blackjackStand() {
    while (!stopGame) {
        var image = document.createElement("img");

        var cards_keys = Object.keys(cards);

        var card = cards_keys[Math.round(Math.random() * 12)];

        image.src = "static/images/" + card + ".png";

        playAudio("swish");

        document.getElementById(dealer["div"]).appendChild(image);

        dealerCards.push(card);
        dealer["score"] = computeScore(dealerCards);
        updateView();

        if (dealer["score"] > 21) {
            document.getElementById(dealer["scoreSpan"]).innerText += " BUST!";
            document.getElementById(dealer["scoreSpan"]).style.color = "red";
            document.getElementById("hit-button").disabled = true;
            dealerStatus = "BUST";
            checkWinner();
        } else if (dealer["score"] > you["score"]) {
            checkWinner();
        } else if (dealer["score"] == 21) {
            checkWinner();
        } else if (dealer["score"] == you["score"]) {
            if (Math.random() > 0.5) {
                checkWinner();
            }
        }
    }
}

function playAudio(name){
    var audio = document.createElement("audio");
    if(name == "swish"){
        audio.src = "static/sounds/" + name + ".m4a";
    } else {
        audio.src = "static/sounds/" + name + ".mp3";
    }
    audio.play();
}

function checkWinner() {
    stopGame = true;
    var span;
    if (yourStatus == "BUST" && dealerStatus == "BUST") {
        document.getElementById("blackjack-result").innerText = "DRAW!";
        span = document.getElementById("draw-score");
        span.innerText = Number(span.innerText) + 1;
        playAudio("aww");
    } else if (yourStatus == "BUST" && dealerStatus != "BUST") {
        document.getElementById("blackjack-result").innerText = "DEALER WINS!";
        span = document.getElementById("loss-score");
        span.innerText = Number(span.innerText) + 1;
        playAudio("aww");
    } else if (yourStatus != "BUST" && dealerStatus == "BUST") {
        document.getElementById("blackjack-result").innerText = "YOU WIN!";
        span = document.getElementById("win-score");
        span.innerText = Number(span.innerText) + 1;
        playAudio("cash");
    } else if (dealer["score"] > you["score"]) {
        document.getElementById("blackjack-result").innerText = "DEALER WINS!";
        span = document.getElementById("loss-score");
        span.innerText = Number(span.innerText) + 1;
        playAudio("aww");
    } else if (dealer["score"] < you["score"]) {
        document.getElementById("blackjack-result").innerText = "YOU WIN!";
        span = document.getElementById("win-score");
        span.innerText = Number(span.innerText) + 1;
        playAudio("cash");
    } else if (dealer["score"] == you["score"]) {
        document.getElementById("blackjack-result").innerText = "DRAW!";
        span = document.getElementById("draw-score");
        span.innerText = Number(span.innerText) + 1;
        playAudio("aww");
    }
}

function computeScore(arr) {
    var currScore = 0;
    var letterA = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "A") {
            letterA.push("A");
        } else {
            currScore += cards[arr[i]];
        }
    }
    for (var i = 0; i < letterA.length; i++) {
        if (currScore + 10 > 21) {
            currScore += 1;
        } else currScore += 10;
    }
    return currScore;
}

function updateView() {
    document.getElementById(you["scoreSpan"]).innerText = you["score"];
    document.getElementById(dealer["scoreSpan"]).innerText = dealer["score"];
}

function blackjackDeal() {
    you["score"] = 0;
    dealer["score"] = 0;
    yourCards = [];
    dealerCards = [];
    yourStatus = "";
    dealerStatus = "";
    stopGame=false;

    updateView();
    document.getElementById(you["div"]).innerHTML =
        '<h3>You: <span id="your-blackjack-result">0</span></h3>';
    document.getElementById(dealer["div"]).innerHTML =
        '<h3>Dealer: <span id="dealer-blackjack-result">0</span></h3>';
    document.getElementById("blackjack-result").innerText = "Let's play!";
    document.getElementById("hit-button").disabled = false;
}
