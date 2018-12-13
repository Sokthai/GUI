// this is the logic and rule of the Scrabble game

$(function () {
    let value ;
    //make tiles draggable
    $(".tiles").draggable({ //https://jqueryui.com/draggable/
        snap: ".snap",
        snapMode: "inner",
        drag: function(){
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