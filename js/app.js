const mapData = {
  minX: 0,
  maxX: 28,
  minY: 4,
  maxY: 24,
  blockedSpaces: {
    "26x16": true,
    "0x12": true,
    "1x12": true,
    "2x12": true,
    "3x12": true,
    "4x12": true,
    "5x12": true,
    "6x12": true,
    "7x12": true,
    "8x12": true,
    "9x12": true,
    "10x12": true,
    "11x12": true,
    "12x12": true,
    "13x12": true,
    "14x12": true,
    "15x12": true,
    "16x12": true,
    "26x14": true,
    "26x13": true,
    "24x20": true,
    "22x20": true,
    "26x12": true,
    "26x11": true,
    "26x10": true,
    "26x9": true,
    "26x7": true,
    "26x8": true,
    "26x7": true,
    "26x6": true,
    "26x5": true,
    "26x4": true,
    "26x3": true,





    "17x12": true,
    "21x11": true,
    "21x10": true,
    "21x9": true,
    "21x8": true,
    "21x7": true,
    "21x6": true,
    "21x5": true,
    "21x4": true,

    "18x12": true,
    "19x12": true,
    "20x12": true,
    "21x12": true,
    "26x12": true,
    "27x12": true,
    "21x13": true,
    "21x14": true,
    "2x18": true,
    "2x19": true,
    "6x17": true,
    "5x17": true,
    "4x17": true,
    "3x17": true,
    "2x17": true,
    "7x17": true,
    "7x18": true,
    "7x19": true,
    "7x20": true,
    "6x20": true,
    "5x20": true,
    "4x20": true,
    "3x20": true,
    "2x20": true,

  },
};

// Options for Player Colors... these are in the same order as our sprite sheet
const playerColors = ["omori", "hero", "basil"];
const vipColors = ["vip"];

//Misc Helpers
function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
}

function createName() {
  const prefix = randomFromArray([
    "OYUNCU",
  ]);
  const animal = randomFromArray([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ]);
  return `${prefix} ${animal}`;
}

function isSolid(x,y) {

  const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  return (
    blockedNextSpace ||
    x >= mapData.maxX ||
    x < mapData.minX ||
    y >= mapData.maxY ||
    y < mapData.minY
  )
}

function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray([
    { x: 9, y: 16 },
    { x: 14, y: 20 },
    { x: 14, y: 15 },
    { x: 1, y: 15 },
    { x: 9, y: 22 },
    { x: 15, y: 22 },
    { x: 23, y: 23 },
    { x: 23, y: 17 },
    { x: 16, y: 15 },
    { x: 20, y: 18 },
    { x: 9, y: 23 },
    { x: 2, y: 23 },
    { x: 16, y: 13 },
    { x: 16, y: 14 },
    { x: 16, y: 16 },
    { x: 16, y: 17 },
    { x: 16, y: 18 },
    { x: 16, y: 19 },
    { x: 16, y: 20 },
    { x: 16, y: 21 },
    { x: 8, y: 13 },
    { x: 8, y: 14 },
    { x: 8, y: 15 },
    { x: 8, y: 16 },
    { x: 8, y: 17 },
    { x: 8, y: 18 },
    { x: 8, y: 19 },
    { x: 8, y: 20 },
    { x: 8, y: 21 },
    { x: 8, y: 22 },
    { x: 8, y: 23 },







  ]);
}


(function () {

  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};

  const gameContainer = document.querySelector(".game-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerColorButton = document.querySelector("#player-color");

  

  let keysPressed = {};

  document.addEventListener("keydown", (event) => {
    keysPressed[event.code] = true;
  });

  document.addEventListener("keyup", (event) => {
    keysPressed[event.code] = false;
  });

  function handleMovement() {
    if (keysPressed["ArrowUp"]) {
      handleArrowPress(0, -1);
    } else if (keysPressed["ArrowDown"]) {
      handleArrowPress(0, 1);
    } else if (keysPressed["ArrowLeft"]) {
      handleArrowPress(-1, 0);
    } else if (keysPressed["ArrowRight"]) {
      handleArrowPress(1, 0);
    }
  }



  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    if (!isSolid(newX, newY)) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange === 1) {
        players[playerId].direction = "right";
      }
      if (xChange === -1) {
        players[playerId].direction = "left";
      }
      if (yChange === -1) {
        players[playerId].direction = "up";
      }
      if (yChange === 1) {
        players[playerId].direction = "down";
      }

      playerRef.set(players[playerId]);
    }
  }

  function initGame() {
    setInterval(handleMovement, 150);

    const allPlayersRef = firebase.database().ref(`players`);

    allPlayersRef.on("value", (snapshot) => {
      //Fires whenever a change occurs
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        // Now update the DOM
        el.querySelector(".Character_name").innerText = characterState.name;
        el.setAttribute("data-color", characterState.color);
        el.setAttribute("data-direction", characterState.direction);
        const left = 16 * characterState.x + "px";
        const top = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //Fires whenever a new node is added the tree
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character", "grid-cell");
      if (addedPlayer.id === playerId) {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
        <div class="Character_shadow grid-cell"></div>
        <div class="Character_sprite grid-cell"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
        </div>
      `);
      playerElements[addedPlayer.id] = characterElement;

      //Fill in some initial state
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      characterElement.setAttribute("data-color", addedPlayer.color);
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
    })


    //Remove character DOM element after they leave
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })



    //Updates player name with text input
    playerNameInput.addEventListener("change", (e) => {
      const newName = e.target.value || createName();
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })

    //Update player color on button click
    playerColorButton.addEventListener("click", () => {
      const mySkinIndex = playerColors.indexOf(players[playerId].color);
      const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
      playerRef.update({
        color: nextColor
      })
    })

  }

  firebase.auth().onAuthStateChanged((user) => {
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      playerNameInput.value = name;

      const {x, y} = getRandomSafeSpot();


      playerRef.set({
        id: playerId,
        name,
        direction: "down",
        color: randomFromArray(playerColors),
        x,
        y,
      })

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();

      //Begin the game now that we are signed in
      initGame();
    } else {
      //You're logged out.
    }
  })

  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
  });


})();