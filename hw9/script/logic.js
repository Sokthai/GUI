// this is the logic and rule of the Scrabble game
let putBack = false; // allow play to put letter back to the stand
let firstTile = true;
let gameStart = false; //check if player play the star tile first
let value;
let objValue; //when the drag is reverted, the drop will remove an element from letters. we need to put back to letters[] at revert option of draggable
let letterID; //when dragging a blank tile, we need to ask what letter to substitute and change it background image
let adjacentTile = false; // check if player play tile next to the other tile
let originalValue, originalId;
let draggableId;
let totalGameScore = 0; //total all players score
let totalPlayScore = 0; //total a player score
let multiplier = 0;
$(function () {
    function getWords(id, words, orentation = true) {
        let bidn, fidn, bvalue, fvalue, la, lb, next, prev;
        next = prev = 1;
        bidn = fidn = id.slice(1);
        la = lb = id.slice(0, 1);
        do {
            if (orentation) { //true is horizonal 
                bidn = parseInt(bidn) - prev;
                fidn = parseInt(fidn) + next;
            } else { //false if vertical 
                la = String.fromCharCode(parseInt(la.charCodeAt(0)) - prev);
                lb = String.fromCharCode(parseInt(lb.charCodeAt(0)) + next);
            }
            bvalue = $("#" + la + bidn).attr("value");
            fvalue = $("#" + lb + fidn).attr("value");
            if (bvalue !== undefined) {
                words = bvalue + words;
            } else {
                prev = 0;
            }
            if (fvalue !== undefined) {
                words = words + fvalue;
            } else {
                next = 0;
            }
        } while (bvalue !== undefined || fvalue !== undefined);
        // console.log("you just call me");
        return words;
    }

    



    // let firstTile = true;
    //make tiles draggable 
    //NOTE: This draggable must be after the elements of class .tiles, 
    //if we put it before the elements is created, it won't know 
    //which elements it refer too. 
    //so, i try not to remove the tile and re-create it. because it 
    //cause the newly re-created element become after this draggable.

    // $(".tiles").draggable({ //https://jqueryui.com/draggable/
    //     snap: ".snap",
    //     snapMode: "inner",
    //     revert: function (obj) {
    //         if (putBack) {
    //             return false; //allow to put back to stand
    //         }
    //         if (gameStart) {

    //             if (firstTile) {
    //                 firstTile = false;
    //                 $(this).draggable("disable");
    //                 return false; //first tile always put in the center/star tile
    //             } else {
    //                 if (adjacentTile) {
    //                     return false; // no revert
    //                 } else {
    //                     console.log("The letter must be next to each other");
    //                     return true;
    //                 }
    //             }

    //         } else {
    //             alert("Please start the game from the star tile");
    //             return true; //revert
    //         }
    //     },
    //     drag: function () {
    //         // console.log((this));
    //         // console.log($(this));
    //         value = $(this).attr("value");

    //         // console.log(value);
    //     }

    // });

    // let gameStart = false; //check if player play the star tile first
    // let adjacentTile = false; // check if player play tile next to the other tile
    // let putBack = false; // allow play to put letter back to the stand
    let dropout = false;
    $(".snap").droppable({ //position the tile to the center of the block

        out: function () {
            // $(this).droppable("option", "disabled", false);
            if (!dropout) { //prevent this function remove other value other than the drap out one. since out is trigger when it hover ther droppable item. 
                $(this).removeAttr("value");
                dropout = true;
            }
            // console.log('im out ' + $(this).attr('id'));

        },
        drop: function (event, ui) {
            let id = $(this).attr("id");
            let cls = $(this).attr("class");
            let star = $("#h7").attr("value"); //check if the star tile is already play
            // console.log(id);
            dropout = false;

            if (cls.slice(5, 16) === "letterStand") {
                putBack = true;
            } else {
                putBack = false;
            }

            if (id !== "h7" && star === undefined) {
                //gameStart = false;
                // $(".snap").droppable("disable");
            } else {

                gameStart = true;
                // console.log("im in again " + id);


                originalValue = $("#" + id).attr("value");
                originalId = id;
                // console.log(originalValue);
                changeBlankTile(draggableId);
                // alert("value is " + value + letterID);
                $("#" + id).attr("value", value); //set the value to dropped element

                checkDictoinary(id, value); //checking valid words from dictionary
                calculatePlayScore(value, cls.slice(9, 11)); //calculate the score each time user play (not total score)

                // console.log("who drop first");
                let sindex; //find index of the drop letter and remove it
                for (let i = 0; i < letters.length; i++) {
                    if (value === letters[i].letter) {
                        objValue = letters[i]; //save the remove elemet in case it reverted 
                        sindex = i;
                        break;
                    }
                }
                // console.log("this is play letter" + playedLetter);
                letters.splice(sindex, 1); //remove letter from the rack array after play
            }

            ui.draggable.position({ //https://api.jqueryui.com/position/
                my: "center",
                at: "center",
                of: $(this),
                using: function (pos) {
                    $(this).animate(pos, 20, "linear");
                }
            })
            // $( this ).droppable( "option", "disabled", true );

            // $(this).droppable("option", "disabled", true);
            // console.log("drop id " + id);
            // $("#" + id).droppable("disable");
        }
    })

    $(".snapRack").droppable({
        out: function () {
            let id = $(this).attr('id');
            // playedLetter.push(id); //add id to playedLetter
            // console.log("add play " + playedLetter);
        },
        drop: function (event, ui) {
            let id = $(this).attr('id');
            let index = playedLetter.indexOf(id);
            // playedLetter.splice(index, 1); //remove that id if user put it back
            // console.log("remove played " + playedLetter);
            ui.draggable.position({ //https://api.jqueryui.com/position/
                my: "center",
                at: "center",
                of: $(this),
                using: function (pos) {
                    $(this).animate(pos, 20, "linear");
                }
            })
        }


    })

    function checkDictoinary(id, value) {
        let hw = getWords(id, value); //getting horizonal words
        let vw = getWords(id, value, false); //getting vertical words



        if (hw.length > 1 || vw.length > 1) {
            adjacentTile = true; //if player put letter tile next to the other tile, then ok to play
        } else {
            adjacentTile = false;
        }
        console.log("hw is " + hw);
        console.log("vertical word is " + vw);
    }



    function changeBlankTile(id) {
        if (value === "_") {
            let alphabet;
            let pattern = /^[a-zA-Z]/g; //accept only letter
            let index;

            let valid = false;
            do {
                alphabet = prompt("Please enter an alphabet only");
                if (alphabet === null || alphabet === "") {} else {
                    if (alphabet.match(pattern)) {
                        alphabet = alphabet.toUpperCase();
                        index = alphabet.charCodeAt(0) - 65;
                        // alert(index);
                        if (json.pieces[index].quantity <= 0) {
                            alert("Sorry, Alphabet '" + alphabet + "' is run out. Try a new alphabet");
                        } else {
                            json.pieces[index].quantity--;
                            let image = "url('images/" + alphabet + ".jpg')";
                            value = alphabet; //becuase the value is not the "_" any more, we need to update it and pass it to the tile and dictionary checking
                            $("#" + id).css("background-image", image); //change the letter pic after select a letter
                            $("#" + id).attr("value", alphabet);
                            $("#" + originalId).attr("value", alphabet); //set value for the tile to the board
                            valid = true;
                        }
                    }
                }

            } while (valid === false);
        }

    }

    // calculate Score solution
    // step 1:  
    //          total each tile individually with its multiply letter if applicable
    //          and keep track how many characters of those individual letter.
    // step 2: 
    //          then call getword function to get the complete word
    //          check if the complete word has length longer then those individual letters
    //          if it is the same, meaning the game just started from the star tile. then done
    //          else if the complete word have word length longer than those individual word
    //          we slice the complete word with those individual letters.
    //          eg: if complete word is "loop" and individual is "oop"
    //                  s
    //                  c
    //                  h
    //                  o
    //                  o
    //                  l  o  o p
    //          we remove the "oop" from the "loop" , keep only "l"
    // step 3: 
    //          loop through the remain character and add the corresponding value of "l" 
    //          to the those individual total score we calculate in step 1;
    //          NOTE: to find the value of the character. 
    //          search if from json file.
     



    function calculatePlayScore(value, cls) {

        //        let index = parseInt(value.charCodeAt(0)) - 65; //calculate the index of json
        let index = (value === "_") ? 26 : parseInt(value.charCodeAt(0)) - 65; //calculate the index of json

        let playscore = parseInt(json.pieces[index].value); //get the corresponding value from the json/bag 
        if (cls === "tl") {
            playscore *= 3;
        } else if (cls === "dl") {
            playscore *= 2;
        }
        // console.log("totalPlayScore bb " + totalPlayScore);
        // console.log("tota game score bb " + totalGameScore);
        totalPlayScore += playscore;

        if (cls === "tw") { //muliply the word 
            multiplier += 3;
        } else if (cls === "dw") {
            multiplier += 2;
        }
        totalGameScore += totalPlayScore;

        // console.log("letter score " + playscore);
        // console.log("totalPlayScore " + totalPlayScore);
        // console.log("tota game score " + totalGameScore);


    }


})