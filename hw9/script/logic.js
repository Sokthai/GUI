// this is the logic and rule of the Scrabble game
let putBack = false; // allow play to put letter back to the stand
let firstTile = true;
let gameStart = false; //check if player play the star tile first
let value; //value from drag element
let draggableId; //id from drag element
let objValue; //when the drag is reverted, the drop will remove an element from letters. we need to put back to letters[] at revert option of draggable
let letterID; //when dragging a blank tile, we need to ask what letter to substitute and change it background image
let adjacentTile = false; // check if player play tile next to the other tile
let originalValue, originalId; //the originally dropped value and id element
let originalDropOutID; //This one when the player first drag out of the droppable. 
let totalGameScore = 0; //total all players score
let totalPlayScore = 0; //total a player score
let multiplier = 0; //for double word and tripple word
let revert = false; //check if the grid is already occupied

$(function () {
    function getWords(id, words, orentation = true) { //getting the words from the board
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
        return words;
    }


    let dropout = false;
    $(".snap").droppable({ //position the tile to the center of the block

        out: function () {
            if (!dropout) { //prevent this function remove other value other than the drap out one. since out is trigger when it hover ther droppable item. 
                originalValue = $(this).attr("value");
                originalDropOutID = $(this).attr("id");
                $(this).removeAttr("value");
                dropout = true;
            }

        },
        drop: function (event, ui) {
            let id = $(this).attr("id");
            let cls = $(this).attr("class");
            let star = $("#h7").attr("value"); //check if the star tile is already play
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
                // if (($(this).attr("value")) !== undefined) {
                //     // ui.draggable.draggable("option", "revert", true);
                //     revert = true;
                //     $("#" + originalDropOutID).attr("value", originalValue);
                // } else {

                    gameStart = true;
                    let sindex; //find index of the drop letter and remove it
                    for (let i = 0; i < letters.length; i++) {
                        if (value === letters[i].letter) {
                            objValue = letters[i]; //save the remove elemet in case it reverted 
                            sindex = i;
                            break;
                        }
                    }

                    letters.splice(sindex, 1); //remove letter from the rack array after play

                    originalId = id;
                    changeBlankTile(draggableId);
                    $(this).attr("value", value); //set the value to dropped element

                    checkDictoinary(id, value); //checking valid words from dictionary
                    calculatePlayScore(value, cls.slice(9, 11)); //calculate the score each time user play (not total score)
                // }

            }

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

    $(".snapRack").droppable({
        out: function () {
            //let id = $(this).attr('id');
        },
        drop: function (event, ui) {
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
        // console.log("hw is " + hw);
        // console.log("vertical word is " + vw);

        //check valid word here
    }



    function changeBlankTile(id) { //replace the blank tile with any available letter in the bag
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
                        for (let i = 0; i < json.pieces.length; i++) {
                            if (alphabet === json.pieces[i].letter) {
                                index = i;
                                break;
                            }
                        }
                        if (index === undefined) { //no that particular letter in the bag, try again
                            alert("Sorry, Alphabet '" + alphabet + "' is run out. Try a new alphabet");
                        } else {
                            json.pieces[index].quantity--
                            if (json.pieces[index].quantity === 0) {
                                json.pieces.splice(index, 1); //remove the letter from bag is zero remain 
                            }


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

        // let index = parseInt(value.charCodeAt(0)) - 65; //calculate the index of json
        let index = (value === "_") ? 26 : parseInt(value.charCodeAt(0)) - 65; //calculate the index of json

        let playscore = parseInt(json.value[index].value); //get the corresponding value from the json/bag 
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