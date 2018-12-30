$(function () {

    let namespace = {
        setBoardClass: function (i, j, td) {
            switch (i) { //set up the class for each td for set up backround image
                case 0: case 14:
                    if (j === 0 || j === 7 || j === 14) { td.addClass("tw");
                    } else if (j === 3 || j === 11) { td.addClass("dl");}  break;
                case 1:case 13:
                    if (j === 1 || j === 13) { td.addClass("dw");
                    } else if (j === 5 || j === 9) { td.addClass("tl"); } break;
                case 2: case 12:
                    if (j === 2 || j === 12) { td.addClass("dw");
                    } else if (j === 6 || j === 8) { td.addClass("dl"); } break;
                case 3: case 11:
                    if (j === 0 || j === 7 || j === 14) { td.addClass("dl");
                    } else if (j === 3 || j === 11) { td.addClass("dw"); } break;
                case 4: case 10:
                    if (j === 4 || j === 10) { td.addClass("dw"); } break;
                case 5: case 9:
                    if (j === 1 || j === 5 || j === 9 || j === 13) { td.addClass("tl"); } break;
                case 6: case 8:
                    if (j === 2 || j === 6 || j === 8 || j === 12) { td.addClass("dl"); } break;
                default:
                    if (j === 0 || j === 14) { td.addClass("tw");
                    } else if (j === 3 || j === 11) { td.addClass("dl");
                    } else if (j === 7) { td.addClass("star"); }
            }
        }
    };
    window.sb = namespace; //make namespace to window level, so it can access by another external file with variable "ns"

});