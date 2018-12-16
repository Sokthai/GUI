/*
    Sokthai Tang 
    UMass Lowell
    GUI I 
    HW9
    Using jQuery drag and drop UI Library
    Created by ST on Dec/07/2018
    Updateed on 12/08/18
*/

//make it global so other file can access this objects;
let json = (function () { //getting letters from json file and save to a variable
    var json = null;
    $.ajax({
        'async': false,
        // 'global': false,
        'url': "script/pieces.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

var letters = [];
var playedLetter = []; //save the rack tile index to remove its child when swapping

$(document).ready(function () {






    generateTable();

    function generateTable() {

        let table = $("<table>").attr("id", "gtable"); //create table and add id attribe 
        let tbody = $("<tbody>");

        for (let i = 0; i < 15; i++) {
            let tr = $("<tr>");
            for (j = 0; j < 15; j++) {
                let td = $("<td>");
                td.addClass("gth snap").text("");
                td.attr("id", getLetter(i) + j);
                setBoardClass(i, j, td); //set board layout
                tr.append(td); //add td to tr
            }
            tbody.append(tr); //append tr to tbody
        }
        table.append(tbody); //add tbody to table
        $("#table").append(table);

    }




    function getLetter(i) { //input ASCII code , return Character
        const a = 97;
        return String.fromCharCode(a + i);
    }


    function readJson(filePath) { //could read the file, but cannot save to a variable
        $.getJSON(filePath, function (data) {
            console.log(data);
        });

    };
    // readJson("script/pieces.json");





    var tileID = [];
    let uniqueNum = 0;
    var availableLetter = 100; //English scrabble of 100 letters

    function generateLetter() { //generate 7 letter and save to a array of objects
        let l = [];
        let p = (availableLetter >= (7 - letters.length)) ? 7 : letters.length + availableLetter; //if there are only 2, for example, in the bag while play need 5, give player only those last two
        for (let i = letters.length; i < p; i++) {
            let randomIndex = getRandomIndex();

            let obj = { //save the letter and its value
                "letter": json.pieces[randomIndex].letter,
                "value": json.pieces[randomIndex].value
            };
            json.pieces[randomIndex].quantity--; //minus one after take one letter from the bag 
            letters.push(obj);
            availableLetter--; //minus a letter each time a letter is used
        }
        console.log(letters);
        console.log(json.pieces);
        console.log(availableLetter);

    }
    generateLetter(); //generate the 7 tiles letters
    reRackLetter(); //put that 7 tiles letters on the rack


    function reRackLetter() { //put the "7" letters in the array on the rack
        // $(".standTable").remove();
        // let table = $("<table>").addClass("standTable");
        // let tbody = $("<tbody>");
        // let tr = $("<tr>");
        // for (i = 0; i < 7; i++) {
        //     let td = $("<td>");
        //     td.addClass("snap letterStand").text("");
        //     td.attr("id", getLetter(i));
        //     tr.append(td); //add td to tr
        // }
        // tbody.append(tr); //append tr to tbody

        // table.append(tbody); //add tbody to table
        // $("#rack").append(table);

        // let table = "<table id='standTable'> <tr><td class='snap' id='" + getLetter(1) + "'" + "></td></tr></table>";

        // console.log("this is table" + table);
        let exist = false;
        for (let i = 0; i < tileID.length; i++) { //remvoe the tiles that is not played before get new tiles
            let id = tileID[i];
            exist = false;
            // console.log("in " + id);
            for (let j = 0; j < playedLetter.length; j++) {
                // console.log(playedLetter[j] + " === " + id);
                if (id === playedLetter[j]) {
                    // console.log("ho no " + id);
                    // playedLetter.pop();
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                $("#" + id).remove();
            }
        }
        playedLetter.length = 0;
        tileID.length = 0;




        for (let i = 0; i < letters.length; i++) { //the 7 tiles
            let image = "url('images/" + letters[i].letter + ".jpg')";
            let tiles = $("<div>").addClass("tiles");

            let id = "#" + getLetter(i);
            tiles.css("background-image", image);
            tiles.attr("value", letters[i].letter);
            tiles.attr("id", "tile" + uniqueNum);
            tileID.push("tile" + uniqueNum);
            uniqueNum++;





            // $(id).append(tiles);
            $(tiles).appendTo(id).draggable({ //https://jqueryui.com/draggable/
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
                            // $("#" + originalId).droppable("disable");
                            $("#" + originalId).droppable("option", "disabled", true);
                            // letterID = $(this).attr("id");// for changing blank tile as dorppable
                            // changeBlankTile(originalId);
                            changeBlankTile($(this).attr("id"));
                            playedLetter.push($(this).attr("id"));
                            return false; //first tile always put in the center/star tile
                        } else {
                            if (adjacentTile) {
                                playedLetter.push($(this).attr("id"));
                                // alert("need to be in straight line . revert first af");

                                // letterID = $(this).attr("id");// for changing blank tile as dorppable

                                changeBlankTile($(this).attr("id"));
                                return false; // no revert
                            } else {
                                // console.log("original value is " + originalValue);
                                if (originalValue === undefined) {
                                    $("#" + originalId).removeAttr("value");
                                } else {
                                    $("#" + originalId).attr("value", originalValue);
                                }

                                letters.push(objValue); //when reverted, we put object back to letter[]
                                alert("need to be in straight line . revert first 1");
                                $("#play").attr("disabled", "disabled");

                                return true; //revert
                            }
                        }


                    } else {
                        alert("Please start the game from the star tile ");

                        return true; //revert
                    }
                },
                drag: function () {

                    value = $(this).attr("value");


                }

            });
        }
    }



    $("#swap").click(function () { //when user want to change the their letter with the bag letter
        console.log(letters);
        for (let i = 0; i < letters.length; i++) {
            let l = letters[i].letter;
            console.log(l);
            console.log(l === "_");
            let index = (l === "_") ? 26 : parseInt(l.charCodeAt(0)) - 65; //calculate the index of json
            console.log("index is " + index);
            json.pieces[index].quantity = json.pieces[index].quantity + 1; //put all the letter back to the bag for swap
            availableLetter++;
        }
        // console.log(json.pieces);
        letters.length = 0; //clear letter array
        console.log(tileID);
        console.log(playedLetter);

        // $("#tile0").remove();

        // let image = "url('images/A.jpg')";
        // let tiles = $("<div>").addClass("tiles");
        // let id = "#" + getLetter(0);
        // tiles.css("background-image", image);
        // tiles.attr("value", "A");
        // // $(id).find(':first-child').remove();
        // // $(id).append(tiles);
        // $(tiles).appendTo(id).draggable({revert: "invalid"});


        generateLetter();
        reRackLetter();
    })




    //NOTE:
    // getRandomIndex should be makine care of the valid index. 
    // Because some letter may run out, if it quantity is 0 
    // meaning no more tiles of that letter. 
    // need to generate a new index.
    // if the make letter is running low in the bag, 
    // that mean we may need by hang up in the getRandomIndex() since 
    // this function return only the valid index. 
    function getRandomIndex() {
        let index;
        do {
            index = parseInt(Math.random() * 37 % 27);
            if (availableLetter <= 7) { //do not need to loop if there is 7 or less letter. just select it
                for (let i = 0; i < json.pieces.length; i++) {
                    if (json.pieces[i].quantity > 0) {
                        return i;
                    }
                }
            }
        } while (json.pieces[index].quantity <= 0);

        return index;
    }

    function changeBlankTile(id) {
        if (value === "_") {
            let alphabet;
            let pattern = /^[a-zA-Z]/g; //accept only letter
            let index;

            let valid = false;
            do {
                alphabet = prompt("Please enter an alphabet only");
                if (alphabet === null || alphabet === "") {
                }else{
                    if (alphabet.match(pattern)) {
                        alphabet = alphabet.toUpperCase();
                        index = alphabet.charCodeAt(0) - 65;
                        alert(index);
                        if (json.pieces[index].quantity <= 0) {
                            alert("Sorry, Alphabet '" + alphabet + "' is run out. Try a new alphabet");
                        } else {
                            json.pieces[index].quantity--;
                            let image = "url('images/" + alphabet + ".jpg')";
                            $("#" + id).css("background-image", image); //change the letter pic after select a letter
                            $("#" + originalId).attr("value", alphabet); //set value for the tile to the board
                            valid = true;
                        }
                    }
                }

            } while (valid === false);
        }

    }



    function setBoardClass(i, j, td) {
        switch (i) { //set up the class for each td for set up backround image
            case 0:
            case 14:
                if (j === 0 || j === 7 || j === 14) {
                    td.addClass("tw");
                } else if (j === 3 || j === 11) {
                    td.addClass("dl");
                }
                break;
            case 1:
            case 13:
                if (j === 1 || j === 13) {
                    td.addClass("dw");
                } else if (j === 5 || j === 9) {
                    td.addClass("tl");
                }
                break;
            case 2:
            case 12:
                if (j === 2 || j === 12) {
                    td.addClass("dw");
                } else if (j === 6 || j === 8) {
                    td.addClass("dl");
                }
                break;
            case 3:
            case 11:
                if (j === 0 || j === 7 || j === 14) {
                    td.addClass("dl");
                } else if (j === 3 || j === 11) {
                    td.addClass("dw");
                }
                break;
            case 4:
            case 10:
                if (j === 4 || j === 10) {
                    td.addClass("dw");
                }
                break;
            case 5:
            case 9:
                if (j === 1 || j === 5 || j === 9 || j === 13) {
                    td.addClass("tl");
                }
                break;
            case 6:
            case 8:
                if (j === 2 || j === 6 || j === 8 || j === 12) {
                    td.addClass("dl");
                }
                break;
            default:
                if (j === 0 || j === 14) {
                    td.addClass("tw");
                } else if (j === 3 || j === 11) {
                    td.addClass("dl");
                } else if (j === 7) {
                    td.addClass("star");
                }
        }
    }





});
