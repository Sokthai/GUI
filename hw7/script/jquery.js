$(document).ready(function () {
    let arrId = ["#h1", "#h2", "#v1", "#v2"];
    let msg = $("#message");
    $("#h1").keyup(() => {
        validation("#h1");
    })

    $("#h2").keyup(() => {
        validation("#h2");
    })

    $("#v1").keyup(() => {
        validation("#v1");
    })

    $("#v2").keyup(() => {
        validation("#v2");
    })


    function validation(id) {

        let text = $(id).val(); //return value from 

        let pattern = /[^-0-9]/g; //checking if the user input anything else other than number

        jQuery.each(arrId, (i, vals) => {
            if (text.match(pattern)) { //if not number
                if (id !== vals) {
                    $(vals).prop("disabled", true);
                    $(vals).addClass("disabledInput");
                    errMessage("Whole Number only", "block");
                    btnDisable(true, "gray");
                }else{
                    $(vals).css("background-color", "#cc0000");
                }
            } else {
                errMessage("", "none");
                $(vals).prop("disabled", false);
                $(vals).css("background-color", "white");
                $(vals).removeClass("disabledInput");
                btnDisable(false, "#4CAF50");
            }
        })
    }

    


    $("#submit").click(() => {
        $("#gtable").remove();
        let valid = Boolean;
        jQuery.each(arrId, (i, vals) => {
            let num = $(vals);
            if ((num.val() === "") || (!$.isNumeric(num.val()))) {
                errMessage("Please enter valid number", "block");
                num.css("background-color", "#cc0000");
                valid = false; //fail validation
            } else if (num.val() === "-") {
                num.val("0");
            }
        })

        let h1 = $("#h1").val();
        let h2 = $("#h2").val();
        let v1 = $("#v1").val();
        let v2 = $("#v2").val();
        if (valid) {
            if ((+h2 < +h1) || (+v2 < +v1)) { //convert to number with + sign
                errMessage("START number CANNOT GREATER than END number", "block");
            } else if ((+h2 - +h1) > 400 || (+v2 - +v1) > 400) {
                errMessage("You exceed the allow range. END - START <= 400", "block");
            } else {
                generateTable(+h1, +h2, +v1, +v2);
            }
        }
    })


    function generateTable(h1, h2, v1, v2) {
        
        let table = $("<table>").attr("id", "gtable"); //create table and add id attribe 
        let tbody = $("<tbody>");
        h1--; v1--;
        for (v = v1; v <= v2; v++) {
            let tr = $("<tr>");
            for (h = h1; h <= h2; h++) {
                let td = $("<td>");
                if (v == v1 && h == h1) {
                    td.addClass("gth").text("");
                } else if (v == v1) {
                    td.addClass("gth").text(h);
                } else {
                    (h === h1) ? td.addClass("gth").text(v): td.addClass("gtd").text(v * h);
                }
                tr.append(td); //add td to tr
            }
            tbody.append(tr); //append tr to tbody
        }
        table.append(tbody); //add tbody to table
        $("#table").append(table);
    }

    function errMessage(message, display) {
        msg.text(message);
        msg.css("display", display);
    }

    function btnDisable(disabled, color){
        $("#submit").prop("disabled", disabled);
        $("#submit").css("background-color", color);
    }
    
});
