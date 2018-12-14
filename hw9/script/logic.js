// this is the logic and rule of the Scrabble game

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


    $("#play").click(function () {
        alert("you are playing");
    });

    let value;
    let firstTile = true;
    //make tiles draggable
    $(".tiles").draggable({ //https://jqueryui.com/draggable/
        snap: ".snap",
        snapMode: "inner",
        revert: function (obj) {
            if (putBack) {
                return false; //allow to put back to stand
            }
            if (gameStart) {

                if (firstTile) {
                    firstTile = false;
                    $(this).draggable("disable");
                    return false; //first tile always put in the center/star tile
                } else {
                    if (adjacentTile) {
                        return false; // no revert
                    } else {
                        console.log("The letter must be next to each other");
                        return true;
                    }
                }

            } else {
                alert("Please start the game from the star tile");
                return true; //revert
            }
        },
        drag: function () {
            // console.log((this));
            // console.log($(this));
            value = $(this).attr("value");
            // console.log(value);
        }
    });
    let gameStart = false; //check if player play the star tile first
    let adjacentTile = false; // check if player play tile next to the other tile
    let putBack = false; // allow play to put letter back to the stand
    $(".snap").droppable({ //position the tile to the center of the block
        out: function () {
            $(this).droppable("option", "disabled", false);
            console.log('im her');
        },
        drop: function (event, ui) {
            let id = $(this).attr("id");
            let cls = $(this).attr("class");
            let star = $("#h7").attr("value"); //check if the star tile is already play
            console.log(id);

            if (cls.slice(5, 16) === "letterStand") {
                putBack = true;
            } else {
                putBack = false;
            }





            if (id !== "h7" && star === undefined) {
                gameStart = false;
                // $(".snap").droppable("disable");
                // alert("Please play the star first");
            } else {

                gameStart = true;

                $("#" + id).attr("value", value); //set the value to dropped element
                checkDictoinary(id, value); //checking valid words from dictionary
                calculatePlayScore(value, cls.slice(9, 11)); //calculate the score each time user play (not total score)

                let sindex;
                for (let i = 0; i < letters.length; i++) {
                    if (value === letters[i].letter) {
                        sindex = i;
                        break;
                    }
                }

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
            // $(this).droppable("option", "disabled", true);
            console.log("drop id " + id);
            $("#" + id).droppable("disable");
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
        console.log("vw is " + vw);
    }


    let totalGameScore, totalPlayScore = 0;

    function calculatePlayScore(value, cls) {

        let index = parseInt(value.charCodeAt(0)) - 65; //calculate the index of json
        let playscore = parseInt(json.pieces[index].value);
        if (cls === "tl") {
            playscore *= 3;
        } else if (cls === "dl") {
            playscore *= 2;
        }

        totalPlayScore += playscore;

        if (cls === "tw") {
            totalPlayScore *= 3;
        } else if (cls === "dw") {
            totalPlayScore *= 2;
        }
        totalGameScore += totalPlayScore;

        console.log("letter score " + playscore);
        console.log("totalPlayScore " + totalPlayScore);

    }


})