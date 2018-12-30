/*
    Sokthai Tang 
    UMass Lowell
    GUI I 
    HW9
    Using jQuery drag and drop UI Library
    Created by ST on Dec/07/2018
    Updateed on 12/19/18
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

var letters = []; //The 7 letter tiles array for player 1
var letters2 = []// The 7 letter tiles array for player 2
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

    function getLetterPosition(l) { //return the position of the letter in json. 
        for (let i = 0; i < json.pieces.length; i++) {
            if (l === json.pieces[i].letter) {
                return i;
            }
        }
        return undefined;
    }


    function readJson(filePath) { //could read the file, but cannot save to a variable
        $.getJSON(filePath, function (data) {
            console.log(data);
        });

    };
    // readJson("script/pieces.json");


    let tileID = [];    // (player1)this tileID is used to remove the tiles that are not used, so we can add tiles again (refresh)
    let tileID2 = [];   // (player2)this tileID2 is used to remove the tiles that are not used, so we can add tiles again (refresh)
    let uniqueNum = 0; //this uniqueNum is appended to the id of the tile for easy identify

    var availableLetter = 100; //English scrabble of 100 letters

    function generateLetter(letterBag) { //generate 7 letter and save to a array of objects
        let p = (availableLetter >= (7 - letterBag.length)) ? 7 : letterBag.length + availableLetter; //if there are only 2, for example, in the bag while play need 5, give player only those last two
        
        for (let i = letterBag.length; i < p; i++) {

            let randomIndex = getRandomIndex();
            let letter = (json.pieces[randomIndex].letter).toUpperCase();
            let valueIndex = (letter === "_") ? 26 : parseInt(letter.charCodeAt(0)) - 65;
            let obj = { //save the letter and its value
                "letter": letter
                //"value": json.value[valueIndex].value
            };
            json.pieces[randomIndex].quantity--; //minus one after take one letter from the bag 

            letterBag.push(obj);
            availableLetter--; //minus a letter each time a letter is used
            if (json.pieces[randomIndex].quantity <= 0) {
                json.pieces.splice(randomIndex, 1); // remove the empty letter from bag
            }

        }
        // console.log(letters);
        // console.log(json.pieces);
        // console.log(availableLetter);
        $("#availableLetter").text(availableLetter);

    }
    //player2
    generateLetter(letters); //generate the 7 tiles letters
    reRackLetter(letters); //put that 7 tiles letters on the rack
    //player2
    generateLetter(letters2); //generate the 7 tiles letters
    reRackLetter(letters2, 7, tileID2); //put that 7 tiles letters on the rack

    function reRackLetter(letterBag, player = 0, tileIds = tileID) { //put the "7" letters in the array on the rack
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
        for (let i = 0; i < tileIds.length; i++) { //remvoe the tiles that is not played before get new tiles
            let id = tileIds[i];
            exist = false;
            for (let j = 0; j < playedLetter.length; j++) {
                if (id === playedLetter[j]) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                $("#" + id).remove();
            }
        }
        playedLetter.length = 0;
        tileIds.length = 0;




        for (let i = 0; i < letterBag.length; i++) { //the 7 tiles
            let image = "url('images/" + letterBag[i].letter + ".jpg')";
            let tiles = $("<div>").addClass("tiles");
            let id = "#" + getLetter(i + player);
            tiles.css("background-image", image);
            tiles.attr("value", letterBag[i].letter);
            tiles.attr("id", "tile" + uniqueNum);
            tileIds.push("tile" + uniqueNum);
            uniqueNum++;
            $(id).attr("value", letterBag[i].letter);
            $(tiles).appendTo(id).draggable({ //https://jqueryui.com/draggable/
                snap: ".snap",
                snapMode: "inner",
                revert: function (event, ui) {

                    if (putBack) {
                        console.log("from ? " + dropoutFromRackID);
                        if (dropoutFromRackID) { //when drop back from rack to rack
                            if (dropBackToRackID === undefined) { //revert back when occupied
                                $("#" + rackToRack).attr("value", $(this).attr("value"));
                                return true;
                            } else {
                                $("#" + dropBackToRackID).attr("value", $(this).attr("value"));
                            }
                        } else { //when drop from board to rack
                            if (dropBackToRackID !== undefined) { //if defind, mean that slot id is the open slot
                                letterBag.push({
                                    "letter": $(this).attr("value")
                                });
                                let v = $(this).attr("id");
                                playedLetter.splice(playedLetter.indexOf(v), 1);
                                $("#" + dropBackToRackID).attr("value", $(this).attr("value"));
                            } else {
                                $("#" + originalDropOutID).attr("value", originalValue);
                                return true;
                            }
                        }
                        dropoutFromRackID = false;
                        putBack = false;
                        return false; //allow to put back to stand
                    }
                    //----------------------------------
                    if (gameStart) { //game start after the star grid is occupied
                        if (firstTile) {

                            firstTile = false;
                            $(this).draggable("disable");
 
                            addTile($(this).attr("id"), $(this).attr("value"));
                            console.log(letterBag);

                            return false; //first tile always put in the center/star tile
                        } else {
                            if (revert) { //if the grid already occupied, revert it
                                $("#" + dropBackToRackID).attr("value", $(this).attr("value"));
                                revert = false;
                                return true;
                            }
                            if (adjacentTile) {

                                let direction = originalId;
                                if (playLetterDropID.length === 0) { //if no element in array, put wherever you want

                                   addTile($(this).attr("id"), $(this).attr("value"));

                                } else if (playLetterDropID.length === 1) { //determine the direction of the tile after the first tile is placed (either row or column)
                                    if (playedLetter.indexOf($(this).attr("id")) > -1) { // if the same tile. just update the palyletterDropID
                                        if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                            return true;
                                        }
                                        let index = playLetterDropID.indexOf(originalDropOutID);
                                        playLetterDropID[index] = originalId;
                                        $("#" + originalId).attr("value", $(this).attr("value"));
                                    } else {
                                        if (playLetterDropID[0].slice(0, 1) === direction.slice(0, 1) || //check row(horizonal)
                                            playLetterDropID[0].slice(1) === direction.slice(1)) { //check column(verticle)
               
                                            if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                                return true;
                                            }
                                            addTile($(this).attr("id"), $(this).attr("value"));

                                            
                                            // updateOldTile($(this).attr("id"));
                                        } else {
                                            alert("Alert need to be in straight line with no space between Please");
                                            $("#" + originalDropOutID).attr("value", $(this).attr("value"));
                                            return true;
                                        }
                                    }


                                } else { //after the direction is determined 3 or more tiles
                                    if (playLetterDropID.indexOf(originalDropOutID) > -1) { // if the same
                                        if (playLetterDropID.length === 2) {

                                            
                                            if (playLetterDropID[0].slice(0, 1) === direction.slice(0, 1) || 
                                                playLetterDropID[0].slice(1) === direction.slice(1)){ //if good horizonal or vertical, update it
                 
                                                if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                                    return true;
                                                }
                                                updateTile($(this).attr("value"));


                                            } else {
                                                alert("please play in straight line only nigger!!!");
                                                $("#" + originalDropOutID).attr("value", $(this).attr("value"));
                                                return true;
                                            }
                                        } else {
                                            
                                            horizonal = (playLetterDropID[0].slice(0, 1) === playLetterDropID[1].slice(0, 1)) ? true : false;
                                            if (horizonal) {
                    
                                                if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                                    return true;
                                                }
                                                let msg = "Please play in horizonal straight line only homie NEW";
                                                return updateOldTile(playLetterDropID[0].slice(0, 1), direction.slice(0, 1), msg, $(this).attr("value"));
                                            } else {
            
                                                if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                                    return true;
                                                }
                                                let msg = "please play in vertical line only NEW";
                                                return updateOldTile(playLetterDropID[0].slice(1), direction.slice(1), msg, $(this).attr("value"));
                                            
                                            }
                                        }
                                    } else { //if new tile



                                        horizonal = (playLetterDropID[0].slice(0, 1) === playLetterDropID[1].slice(0, 1)) ? true : false;
                                        if (horizonal) {
                                            
            
                                           
                                            let msg = "please play in straight line (horizonal)only NEW";
                                            if (newTile(playLetterDropID[0].slice(0, 1), direction.slice(0, 1), msg, 
                                                $(this).attr("id"), $(this).attr("value")) === true){
                                                return true;
                                            }

                                            if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                                return true;
                                            }
                                        } else { //if vertical
                
                                           
                                            let msg = "please play in straight line (vertical) only nigger NEW";
                                            if (newTile(playLetterDropID[0].slice(1), direction.slice(1), msg, $(this).attr("id"), $(this).attr("value")) === true){
                                                return true;
                                            }

                                            if (checkSpaceBetween(playLetterDropID[0], originalId)){
                                                return true;
                                            }
                                            
                                        }
                                    }
                                    
        
                                }
                                
                                return false; // no revert
                            } else {
                                $("#" + originalId).removeAttr("value");
                                $("#" + originalDropOutID).attr("value", originalValue);
                                // letters.push(objValue); //when reverted, we put object back to letter[]
                                alert("need to be in straight line with no space");
                                // $("#play").attr("disabled", "disabled");
                                $("#" + dropBackToRackID).attr("value", $(this).attr("value"));
                                return true; //revert
                            }
                        }
                    } else {
                        $("#" + dropBackToRackID).attr("value", $(this).attr("value"));
                        alert("Please start the game from the star tile ");

                        return true; //revert
                    }

                },
                drag: function () {
                    //draggableId = $(this).attr("id"); // we need this to remove the value when player change the location of the tile
                    // value = $(this).attr("value"); //save current value when play drop to droppable
                }

            });

        }
    }

    function checkSpaceBetween(firstID, lastID){ //check if there is space between tile, if space is found , revert it
        let id;
        if (firstID.charCodeAt(0) === lastID.charCodeAt(0)) { //horizonal
            id = lastID.slice(0, 1);
            if (parseInt(firstID.slice(1)) < parseInt(lastID.slice(1))) { //if first is at the left side (smaller)
                id += parseInt(lastID.slice(1)) - 1;
            } else {
                id += parseInt(lastID.slice(1)) + 1;
            }

        } else { //vertical   
            if (firstID.slice(0, 1) < lastID.slice(0, 1)) {
                id = (lastID.slice(0, 1).charCodeAt(0)) - 1; // if first is at the top (smaller)            
            } else {
                id = (lastID.slice(0, 1).charCodeAt(0)) + 1;
            }
            id = String.fromCharCode(id) + lastID.slice(1);
        }

        if ($("#" + id).attr("value") === undefined) {
            alert("no space between");
            return true //revert if there is space
        }
    }

    function newTile(playLetter, direction, message, id, value, letterBag = letters){
        if (playLetter === direction) {
            addTile(id, value, letterBag);
        } else {
            alert(message);
            $("#" + originalDropOutID).attr("value", value);
            return true;
        }
    }

    function addTile(id, value, letterBag = letters) {
        playedLetter.push(id);
        letterBag.splice(ns.getIndexOf(value), 1);
        // removeTileFromLetter(value);
        playLetterDropID.push(originalId);
        $("#" + originalId).attr("value", value);
    }

    function updateOldTile(playLetter, direction, message, value) {
        if ((playLetter === direction)) {

            updateTile(value);
        } else {
            alert(message);
            $("#" + originalDropOutID).attr("value", value);
            return true;
        }

    }


    function updateTile(value){
        let index = playLetterDropID.indexOf(originalDropOutID);
        playLetterDropID[index] = originalId;
        $("#" + originalId).attr("value", value);
    }


    function removeTileFromLetter(value) {
        let sindex; //find index of the drop letter and remove it
        for (let i = 0; i < letters.length; i++) {
            if (value === letters[i].letter) {
                // objValue = letters[i]; //save the remove elemet in case it reverted 
                sindex = i;
                break;
            }
        }
        letters.splice(sindex, 1);
    }

    $("#play1").click(function () { //game always start with player 1
        if (!gameStart || playedLetter.length <= 0) {
            alert("Please place letter on the board to play");
        } else {
            let currentScore = parseInt($("#score").text()) + ns.calculatePlayScore();
            $("#score").text(currentScore);
            for (let i = 0; i < playedLetter.length; i++) {
                $("#" + playedLetter[i]).draggable("disable");
            }
            //$("#swap").prop("disabled", false);
            // swap();

            replenishRack(letters);
            $(this).prop("disabled", true);
            $("#play2").attr("disabled", false);
            $("#cover").css("top", 80); //this div to cover the tiles, so they can not be moved when it turn is done
            
        }
        playLetterDropID.length = 0; // clear the id letters array
    });


    $("#play2").click(function () {
        let currentScore = parseInt($("#score2").text()) + ns.calculatePlayScore();
        $("#score2").text(currentScore);
        for (let i = 0; i < playedLetter.length; i++) {
            $("#" + playedLetter[i]).draggable("disable");
        }
        replenishRack(letters2, 7, tileID2);
        $(this).prop("disabled", true);
        $("#play1").attr("disabled", false);
        $("#cover").css("top", 250);
        playLetterDropID.length = 0; // clear the id letters array

    });

    function replenishRack(letterBag, player = 0, tileIds = tileID){
        $("#availableLetter").text(availableLetter);
        console.log("letter b bag");
        console.log(letterBag);
        generateLetter(letterBag);
        console.log("letter bag");
        console.log(letterBag);
        reRackLetter(letterBag, player, tileIds); //put that 7 tiles letters on the rack
        // $(this).prop("disabled", true);
    }



    function swap(letterBag) { //when user want to change the their letter with the bag letter, clear all the current letters on rack and get all new 7 tiles
        console.log("remain in letter array");
        console.log(letters);
        for (let i = 0; i < letters.length; i++) {
            let l = letters[i].letter;
            let index = getLetterPosition(l); //calculate the index of json

            if (index === undefined) { //create new obj if that particular letter is deleted
                let obj = {
                    "letter": l,
                    "quantity": 1
                }
                json.pieces.push(obj);
            } else {
                json.pieces[index].quantity = json.pieces[index].quantity + 1; //put all the letter back to the bag for swap
            }
            availableLetter++;
        }
        letters.length = 0; //clear letter array
        replenishRack(letterBag);
    }





    function getRandomIndex() {
        return parseInt(Math.random() * 37 % json.pieces.length);
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