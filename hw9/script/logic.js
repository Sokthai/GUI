/*
    Sokthai Tang 
    UMass Lowell
    GUI I 
    HW9
    Using jQuery drag and drop UI Library
    Created by ST on Dec/07/2018
    Updateed on 12/08/18
*/




// this is the logic and rule of the Scrabble game
let putBack = false; // allow play to put letter back to the stand
let firstTile = true;
let gameStart = false; //check if player play the star tile first
// let value; //value from drag element
let draggableId; //id from drag element
let objValue; //when the drag is reverted, the drop will remove an element from letters. we need to put back to letters[] at revert option of draggable
let letterID; //when dragging a blank tile, we need to ask what letter to substitute and change it background image
let adjacentTile = false; // check if player play tile next to the other tile
let originalValue, originalId; //the originally dropped value and id element
let originalDropOutID; //This one when the player first drag out of the droppable. 
let totalGameScore = 0; //total all players score
let totalPlayScore = 0; //total a player score
let revert = false; //check if the grid is already occupied
let dropoutFromRackID = false; //this is when player drop a tile from rack back to rack.
let dropBackToRackID; //when player drop back to the rack
let putBackRackID; //for putting back when revert to old rack ID
let rackToRack; //this only when drop directly from rack to rack. not go through board
let playLetterDropID = [] //the id for each tile we play. so that we can use it to collect the word.
let horizonal;  //determine if the orentatoin of the letter is horizonal = true, false = vertical
$(function () {
    let dropout = false;
    let value; //value from drag element
    let dragOutFromBoard = false;
    $(".snap").droppable({ //position the tile to the center of the block

        out: function () {
            if (!dropout) { //prevent this function remove other value other than the drap out one. since out is trigger when it hover ther droppable item. 
                originalValue = $(this).attr("value");
                originalDropOutID = $(this).attr("id");
                dropoutFromRackID = false;
                firstDropOut = true;
                $(this).removeAttr("value");
                dropout = true;
                // alert("make me out");
                dragOutFromBoard = true;
            }

        },
        drop: function (event, ui) {
            let id = $(this).attr("id");
            let cls = $(this).attr("class");
            let star = $("#h7").attr("value"); //check if the star tile is already play
            dropout = false;
            value = ui.draggable.attr("value");
            // console.log("put back " + cls.slice(5, 16));
            // if (cls.slice(5, 16) === "letterStand") {
            //     putBack = true;
            // } else {
            //     putBack = false;
            // }

            putBack = false;
            if (id !== "h7" && star === undefined) {
                //gameStart = false;
                // $(".snap").droppable("disable");
                firstDropOut = false;
            } else {
                if (($(this).attr("value")) !== undefined) {
                    // ui.draggable.draggable("option", "revert", true);
                    revert = true;
                    firstDropOut = false;
                    $("#" + originalDropOutID).attr("value", originalValue);
                } else {

                    gameStart = true;
                    // alert(dragOutFromBoard);
                    // if (!dragOutFromBoard) {
                    // if (playedLetter.indexOf(ui.draggable.attr("id")) === -1) { //if not the same tile
             
                        // let sindex; //find index of the drop letter and remove it
                        // for (let i = 0; i < letters.length; i++) {
                        //     if (value === letters[i].letter) {
                        //         objValue = letters[i]; //save the remove elemet in case it reverted 
                        //         sindex = i;
                        //         break;
                        //     }
                        // }
                        // letters.splice(sindex, 1); //remove letter from the rack array after play
                    // }
                    // }
                    firstDropOut = false;
                    originalId = id;
                    changeBlankTile(ui.draggable.attr("id"));
                    // $(this).attr("value", ui.draggable.attr("value")); //set the value to dropped element

                    ////$(this).attr("value", value); //set the value to dropped element
                    
                    namespace.checkDictoinary(id, value); //checking valid words from dictionary
                    //calculatePlayScore(value, cls.slice(9, 11)); //calculate the score each time user play (not total score)
                }

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


    let firstDropOut = false; //for when user drop from rack back to rack
    $(".snapRack").droppable({
        out: function () {
            if (!firstDropOut) {
                // console.log("from rack to rack");
                dropoutFromRackID = true;
                firstDropOut = true;
                rackToRack = dropBackToRackID = $(this).attr("id"); //when revert
                // alert("out" + dropBackToRackID);
                $(this).removeAttr("value");
            }

            
        },
        drop: function (event, ui) {
            let cls = $(this).attr("class");
            if (cls.slice(9, 20) === "letterStand") {
                if ($("#h7").attr("value") === undefined) {
                    firstTile = true;
                    gameStart = false;
                }
                putBack = true;
            }
            dropout = false;
            firstDropOut = false;
            dropBackToRackID = ($(this).attr("value") === undefined) ? $(this).attr("id") : undefined; //returning the id of the open undefine slot. 


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

    function getWords(id, words, orentation = true) { //getting the words from the board, id = drop grid id, words = the current character to concate, orentation = true is horizonal, false is vertical
        let bidn, fidn, bvalue, fvalue, la, lb, next, prev;
        next = prev = 1;
        bidn = fidn = id.slice(1);
        la = lb = id.slice(0, 1);
        do {
            if (orentation) { //true is horizonal 
                bidn = parseInt(bidn) - prev;
                fidn = parseInt(fidn) + next;
            } else { //false is vertical 
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

let namespace;

    namespace = {
        checkDictoinary: function (id, value) {
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
        },


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

        calculatePlayScore: function () {

            // // let index = parseInt(value.charCodeAt(0)) - 65; //calculate the index of json
            // let index = (value === "_") ? 26 : parseInt(value.charCodeAt(0)) - 65; //calculate the index of json
            console.log("from cal");
            console.log(playLetterDropID);
            let hwCurrentScore = 0 ;
            let vwCurrentScore = 0;
            let totalCurrentScore = 0;
            let totalVwCurrentScore = 0;
            let totalHwCurrentScore = 0;
            let hw, vw, value, cls;
            let multiply = 1;
            if (playLetterDropID.length === 1) { //if player only put one letter on the board
                value = $("#" + playLetterDropID[0]).attr("value");
                hw = getWords(playLetterDropID[0], value); //getting horizonal words
                vw = getWords(playLetterDropID[0], value, false); //getting vertical words
                cls = $("#" + playLetterDropID[0]).attr("class").slice(9, 11); //search for dl, tl, dw, or tw class for premium words
                
               
                let index;
                for (let i = 0 ; i < hw.length; i++){
                    index = parseInt(hw.charCodeAt(i) - 65);
                    hwCurrentScore += parseInt(json.value[index].value);
                }

                for (let i = 0; i < vw.length; i++){
                    index = parseInt(vw.charCodeAt(i)) - 65;
                    vwCurrentScore += parseInt(json.value[index].value);
                }

                index = parseInt(value.charCodeAt(0)) - 65;
                if (cls === "dl"){
                    hwCurrentScore += parseInt(json.value[index].value); //because we alreay add the value of the letter once, so we need to add one more time since "dl"
                    vwCurrentScore += parseInt(json.value[index].value); //because we alreay add the value of the letter once, so we need to add one more time since "dl"
                }else if(cls === "tl"){
                    hwCurrentScore += (parseInt(json.value[index].value) * 2);  
                    vwCurrentScore += (parseInt(json.value[index].value) * 2);   
                }else if (cls === "dw"){
                    hwCurrentScore *= 2;  
                    vwCurrentScore *= 2;
                }else if (cls === "tw"){
                    hwCurrentScore *= 3;  
                    vwCurrentScore *= 3;
                }

                if (hw.length > 1 && vw.length > 1){
                    totalCurrentScore = hwCurrentScore + vwCurrentScore;
                }else if(hw.length === 1){
                    totalCurrentScore = vwCurrentScore;
                }else{
                    totalCurrentScore = hwCurrentScore;
                }
                
            }else{ //if more than one letter
                horizonal = (playLetterDropID[0].slice(0, 1) === playLetterDropID[1].slice(0, 1)) ? true : false;
                if (horizonal) { //if the orentation is horizonally, then we only calculate horizonal once, and do all other vertically one by one and vice versa
                    value = $("#" + playLetterDropID[0]).attr("value");
                    hw = getWords(playLetterDropID[0], value); //getting horizonal words
                    vw = getWords(playLetterDropID[0], value, false); //getting vertical words
                    vwCurrentScore = 0;
                    hwCurrentScore = 0;
                    
                    let index;
                    for (let i = 0 ; i < hw.length; i++){
                        index = parseInt(hw.charCodeAt(i) - 65);
                        hwCurrentScore += parseInt(json.value[index].value);
                    }
                    console.log("score before premium " +  hwCurrentScore);

                    for (let i = 0 ; i < playLetterDropID.length; i++){ 
                        //for vertical
                        value = $("#" + playLetterDropID[i]).attr("value");
                        vw = getWords(playLetterDropID[i], value, false); //getting vertical word
                        let start = (vw.length === 1)? 1 : 0;
                        for (let j = start; j < vw.length; j++){ //getting all the vertical score. it the vertical has only one letter, do nothing
                            let vIndex = parseInt(vw.charCodeAt(j)) - 65;
                            vwCurrentScore += parseInt(json.value[vIndex].value);
                        }
                        
                        cls = $("#" + playLetterDropID[i]).attr("class").slice(9, 11); //search for dl, tl, dw, or tw class for premium words
                        index = parseInt(value.charCodeAt(0) - 65);
                        if (cls === "dl"){ //apply premium word or letter to both vertical and horizonal at the same time
                            hwCurrentScore += parseInt(json.value[index].value); //because we alreay add the value of the letter once, so we need to add one more time since "dl"
                            if (start === 0) {vwCurrentScore += parseInt(json.value[index].value);} //if it start from 0, it means it has more than 1 letters
                        }else if(cls === "tl"){
                            hwCurrentScore += (parseInt(json.value[index].value) * 2);  
                            if (start === 0) { vwCurrentScore += parseInt(json.value[index].value) * 2;}
                        }else if (cls === "dw"){

                            multiply *= 2;   //because we can to make sure that we muliply only after every is tally correctly like dl and tl
                            if (start === 0) { vwCurrentScore *= 2;}
                        }else if (cls === "tw"){
                            multiply *= 3; 
                            if (start === 0) { vwCurrentScore *= 3;}
                        }
                        
                        totalVwCurrentScore += vwCurrentScore;
                        vwCurrentScore = 0;
                    }
                    alert("hw after score is " + hwCurrentScore * multiply);
                    alert("vw score is " + totalVwCurrentScore);
                    totalCurrentScore = totalVwCurrentScore + (hwCurrentScore * multiply);
                    multiply = 1;
                }else{ //if vertical 
                    alert("vertical working on it");
                }   
            }
            alert("total is " + totalCurrentScore);
            return totalCurrentScore;
        }
    };
    window.ns = namespace; //make namespace to window level, so it can access by another external file with variable "ns"
});

