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
    
    //make tiles draggable
    $(".tiles").draggable({ //https://jqueryui.com/draggable/
        snap: ".snap",
        snapMode: "inner",
        drag: function () {
            // console.log((this));
            // console.log($(this));
            value = $(this).attr("value");
            // console.log(value);
        }
    });

    $(".snap").droppable({ //position the tile to the center of the block
        drop: function (event, ui) {
            let id = $(this).attr("id");
            let cls = $(this).attr("class").slice(9, 11);
            let star = $("#h7").attr("value"); //check if the star tile is already play

            
            
            if (id !== "h7" && star === undefined) {
                alert("Please play the star first");
            }else{

                console.log(star);
                //console.log(cls);

                $("#" + id).attr("value", value); //set the value to dropped element
                checkDictoinary(id, value); //checking valid words from dictionary
                calculatePlayScore(value, cls); //calculate the score each time user play (not total score)

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
        }
    })

    function checkDictoinary(id, value) {
        let hw = getWords(id, value); //getting horizonal words
        let vw = getWords(id, value, false); //getting vertical words

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