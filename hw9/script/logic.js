// this is the logic and rule of the Scrabble game

$(function () {
    window.getWords = function(id, words, orentation = true) {
        let bidn, fidn, bvalue, fvalue, la, lb;
        bidn = fidn = id.slice(1);
        la = lb = id.slice(0, 1);
        do {
            if (orentation) { //true is horizonal 
                bidn = parseInt(bidn) - 1;
                fidn = parseInt(fidn) - 1;
            } else { //false if vertical 
                la = String.fromCharCode(parseInt(la.charCodeAt(0)) - 1);
                lb = String.fromCharCode(parseInt(la.charCodeAt(0)) + 1);
            }
            bvalue = $("#" + la + bidn).attr("value");
            fvalue = $("#" + lb + fidn).attr("value");
            if (bvalue !== undefined) {
                words = bvalue + words;
            }
            if (fvalue !== undefined) {
                words = words + fvalue;
            }
        } while (bvalue !== undefined && fvalue !== undefined);
        console.log("you just call me");
        return words;
    }




    let value;
    //make tiles draggable
    $(".tiles").draggable({ //https://jqueryui.com/draggable/
        snap: ".snap",
        snapMode: "inner",
        drag: function () {
            console.log((this));
            console.log($(this));
            // value = $(this).attr("value");
            // console.log(value);
        }
    });

    $(".snap").droppable({ //position the tile to the center of the block
        drop: function (event, ui) {
            let id = $(this).attr("id");
            console.log(id);
            // $("#"+id).attr("value", value);
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
})