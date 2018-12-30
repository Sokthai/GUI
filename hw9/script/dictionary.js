$(function(){
    let namespace = {
        checkWord : function(word){
            alert("dictionary checking function " + word);
        }
    };
    window.dict = namespace;
})