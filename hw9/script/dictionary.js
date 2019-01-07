$(function () {

    // The dictionary lookup object
    let dict = {};

    // Do a jQuery Ajax request for the text dictionary
    $.get("dict/words", function (data) {
        let words = data.split("\n"); //create an array and save all data to it
        for (let i = 0; i < words.length; i++) {
            dict[words[i]] = true; //create an object and assign true value to it . for faster lookup
        }
        // console.log(dict["sneaker"]); //this is how the word should look up in the dict
    });

    // Takes in an array of letters and finds the longest
    // possible word at the front of the letters
    function findWord(letters) {
        letters = letters.toLowerCase();
        // Clone the array for manipulation
        let curLetters = letters.split(" ");
        let invalidWord = "";
        // console.log("wook up " + curLetters);
        // console.log(dict[letters]);
        // Make sure the word is at least 3 letters long

        for (let i = 0; i < curLetters.length; i++){
            if (!dict[curLetters[i]]){
                invalidWord += " " + curLetters[i];
            }
        }
        return invalidWord; //return the invalid word is any
    }


    let namespace = {
        checkWord: function (word) {
            let invalidWord = findWord(word);
            if (invalidWord === ""){
                return true; //return true is all words are valid
            }else{
                return invalidWord.slice(1); //retuen the invalid word if any
            }
        }
    };
    window.dict = namespace;
})