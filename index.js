const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

let userRangeEnd, userNumber, gameOption, playerGuess, prevGuess; //variables to be used within each of the game variations.
let rangeStart = 1;
let rangeEnd = 100;
let count = 0; //used to count number of guesses in both player and computer games.
let computerSecretNumber = Math.floor(Math.random() * 100);

function getComputerRangeMax() {
  rl.question(
    `Please enter a number for us to guess between 1 and it: `,
    (endingNumber) => {
      //took forever to figure out to parse the integer from the line so it was returning a variety of ranges due to it not being an integer.
      userRangeEnd = parseInt(endingNumber);
      //if the user enters something other than a number, we console log "that's not a number and ask for a new number and call the process again"
      if (isNaN(userRangeEnd)) {
        console.log("That's not a number! Please try again:");
        getComputerRangeMax();
      } //check if the number entered is within the game parameters.
      else if (userRangeEnd < 3) {
        console.log(
          `Your number is not big enough. Please enter a number higher than 3.`
        );
        getComputerRangeMax();
      } else {
        //Inform user of their chosen number and then start the guessing.
        console.log(
          `You entered the number ${userRangeEnd} as a max. Let's get your secret number!`
        );
        getUserNumber(userRangeEnd);
      }
    }
  );
}

function getUserNumber() {
  //rl.question() method is used for asking the user to give us their number.
  rl.question(
    `Please enter your secret number between ${rangeStart} and ${userRangeEnd}: `,
    (response) => {
      userNumber = parseInt(response);
      count++;
      //if the user enters something other than a number, we console log "that's not a number and ask for a new number and call the process again"
      if (isNaN(userNumber)) {
        console.log("That's not a number! Please try again:");
        getUserNumber();
      } //check if the number entered is within the game parameters.
      else if (userNumber < 1 || userNumber > userRangeEnd) {
        console.log(
          `Your number ${userNumber} is outside the valid range. Please enter a number between ${rangeStart} and ${userRangeEnd}.`
        );
        getUserNumber();
      } else if ((gameOption = "Computer")) {
        //Inform user of their chosen number and then start the guessing.
        console.log(
          `You entered the number ${userNumber}. Let's start guessing!`
        );
        computerStartGuessing();
      } else if ((gameOption = "Player")) {
        //Have the player start guessing.
        console.log();
        playerStartGuessing();
      }
    }
  );
}

function playerStartGuessing() {
  console.log(`Guess my number between ${rangeStart} and ${rangeEnd}`);
  continueGuessing();
}

function continueGuessing() {
  rl.question("What's your guess?", (response) => {
    playerGuess = parseInt(response);

    if (isNaN(playerGuess)) {
      console.log("That's not a number! Try again!");
    } else if (playerGuess === computerSecretNumber) {
      console.log(`Amazing, you guessed my number in ${count} guesses!`);
      gameOver();
    } else if (playerGuess < computerSecretNumber) {
      console.log("That's too low....guess higher!");
      count++;
      continueGuessing();
    } else if (playerGuess > computerSecretNumber) {
      console.log("That's too high....guess lower!");
      count++;
      continueGuessing();
    } else {
      console.log("I'm not sure what happened. Let's start over.");
      rl.close();
    }
  });
}

function computerStartGuessing() {
  let guess = Math.floor((rangeStart + userRangeEnd) / 2);
  //use rl.question to ask the user for input. System awaits input
  rl.question(`Is your number ${guess}? (yes/higher/lower) `, (answer) => {
    //if user responds "yes" closes the readline interface (https://nodejs.org/api/readline.html#rlclose) and responds with correct guess.
    if (answer === "yes") {
      if (guess === 42) {
        console.log(
          `You chose the answer to the Ultimate Question of Life, the Universe, and Everything!`
        );
      } else if (count === 1) {
        console.log(`I guessed your number ${guess} correctly in 1 try!`);
      } else {
        console.log(
          `I guessed your number ${guess} correctly in ${count} tries!`
        );
      }
      gameOver();
    }
    //if not correct number, and response is lower then respond too high, cut the high end of the guessing range (maxRange) to the guess minus 1 and guesses again
    else if (answer === "lower") {
      if (guess === prevGuess) {
        console.log(
          "You've cheated somewhere along the way....let's start over."
        );
        rl.close();
      } else {
        console.log(`I guessed too high ${guess}, let\'s try again!`);
        userRangeEnd = guess - 1;
        count++;
        prevGuess === guess;
        computerStartGuessing();
      }
    }
    //if not correct number, and response is higher then respond too low, cut the lower end of the guessing range (maxRange) to the guess plus 1 and guesses again
    else if (answer === "higher") {
      if (guess === prevGuess) {
        console.log(
          "You've cheated somewhere along the way....let's start over."
        );
        rl.close();
      } else {
        console.log(`I guessed too low ${guess}, let\'s try again!`);
        rangeStart = guess + 1;
        count++;
        prevGuess = guess;
        computerStartGuessing();
      }
    } else {
      //close the readline interface when the user inputs something other than a yes, higher, or lower and indicates improper data
      console.log("Invalid response");
      computerStartGuessing();
    }
  });
}

function gameOver() {
  let gameReset;
  rl.question(`Would you like to play again? (y or n): `, (response) => {
    gameReset = response.toLowerCase();

    if (gameReset === "y") {
      rangeStart = 1;
      rangeEnd = 100;
      prevGuess = "";
      gameChoice();
    } else {
      console.log("Thank you for playing!");
      rl.close();
    }
  });
}

function gameChoice() {
  rl.question(
    `Please choose a game. Enter who is guessing the number: Computer or Player: `,
    (response) => {
      gameOption = response.toLowerCase();

      if (gameOption === "computer") {
        console.log("Ok, Ill guess your number.");

        getComputerRangeMax();
      } else if (gameOption === "player") {
        console.log("Ok, you get to guess.");
        playerStartGuessing();
      } else {
        console.log("Thats not a choice. Please try again.");
        gameChoice();
      }
    }
  );
}

gameChoice();
