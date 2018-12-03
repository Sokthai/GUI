/*
    Sokthai Tang 
    UMass Lowell
    GUI I 
    HW8
    Using jQuery validator plugin to validate the input fields and Slider and Tabs UI plugin
    Created by ST on Dec/02/2018
    Updateed on Dec/02/2018
*/




$(document).ready(function () {

    // <!-- jquery validation plugin cdn -->
    // <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/jquery.validate.min.js"></script>
    // <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/additional-methods.min.js"></script>

    let valid = true;
    //custom addMethod function    
    $.validator.addMethod("custom", (value, element) => {
        return value.length <= 3 //|| this.optional(element) ; //this.optional() is to check if the element is optional or not
    }, "you number can't exceed 3 digits long");

    //jquery validation plugin documents
    //https://jqueryvalidation.org/validate/
    $("form").validate({

        rules: { //set up rule
            h1: {
                required: true,
                nowhitespace: true,
                // custom : true, //using addMehtod to create a custom message
                number: true
            },
            h2: {
                required: true,
                nowhitespace: true,
                number: true
            },
            v1: {
                required: true,
                nowhitespace: true,
                number: true
            },
            v2: {
                required: true,
                nowhitespace: true,
                number: true
            }
        },
        messages: { //enforce the rule
            h1: {
                required: () => {
                    $("#h1").css("background-color", "lightcoral");
                    return "Horizonal START field is required"
                },
                number: () => {
                    $("#h1").css("background-color", "lightcoral");
                    return "Please enter <em style='color: red'>number</em> for Horizonal START"
                }

            },
            h2: {
                required: () => {
                    $("#h2").css("background-color", "lightcoral");
                    return "Horizonal END field is required"
                },
                number: () => {
                    $("#h2").css("background-color", "lightcoral");
                    return "Please enter <em style='color: red'>number</em> for Horizonal END"
                }

            },
            v1: {
                required: () => {
                    $("#v1").css("background-color", "lightcoral");
                    return "Verticle START field is required"
                },
                number: () => {
                    $("#v1").css("background-color", "lightcoral");
                    return "Please enter <em style='color: red'>number</em> for Vertical START"
                }

            },
            v2: {
                required: () => {
                    $("#v2").css("background-color", "lightcoral");
                    return "Verticle END field is required"
                },
                number: () => {
                    $("#v2").css("background-color", "lightcoral");
                    return "Please enter <em style='color: red'>number</em> for Vertical END"
                }
            }
        },
        invalidHandler: function (event, validator) { //if the form is not valid, do sth about it
            let errors = validator.numberOfInvalids(); //return the number of error fields
            if (errors) {
                let message = "Please fix all the error before continue";
                // valid = false;
                isValid(false);
                $("#message").html(message);
                $("#message").show();
            } else {
                $("#message").hide();
            }
        },
        success: (error, element) => { // if the form is successfully submitted, then do sth to it
            $(element).css("background-color", "white");
        },
        submitHandler: (form, element) => { //if the form is valid after submission. process it with some custome validation

            let h1 = $("#h1").val();
            let h2 = $("#h2").val();
            let v1 = $("#v1").val();
            let v2 = $("#v2").val();
            // valid = true;
            isValid(true);
            let valid = validation(h1, h2, v1, v2);
            if (valid === true) {
                $("#message").css("display", "none");

                // addTabs();
                redrawTable(h1, h2, v1, v2);
            } else {
                $("#message").html(valid);
                $("#message").show();
            }
        }
    })

    function isValid(val) {
        valid = val;
    }

    function validation(h1, h2, v1, v2) {  //custom validation
        let errmsg;
        if ((+h2 < +h1) || (+v2 < +v1)) { //convert to number with + sign
            errmsg = "START number CANNOT GREATER than END number";
            return errmsg;
        } else if ((+h2 - +h1) > 400 || (+v2 - +v1) > 400) {
            errmsg = "Please enter value between -200 and 200"
            return errmsg;
        }
        return true;
    }

    let th1, th2, tv1, tv2; //keep original table row and column for redraw
    let secondLast;

    function redrawTable(h1, h2, v1, v2) { 
        let lastIndex = $("input[type=checkbox]:last").attr("id");
        if (secondLast === undefined) {
            secondLast = lastIndex;
        }
        if (submitted) { // true if user pressing the button
            if (len > 0) {
                generateTable(th1, th2, tv1, tv2, true, secondLast); //redraw the original table to the second last tab after user generate the table (with slider or input text) without pressing the button
                secondLast = lastIndex;
            }
            generateTable(h1, h2, v1, v2, true, lastIndex); //draw table to the last tab
            th1 = h1; //keep the original table row and column for redraw
            th2 = h2;
            tv1 = v1;
            tv2 = v2;
            submitted = false;
        } else {
            generateTable(h1, h2, v1, v2, false, lastIndex); //remove and draw when user try to play with the table without pressing the button
        }
    }

    function generateTable(h1, h2, v1, v2, submit, id) {
        if (!submit) { //not submit
            $("#gtable" + id).remove();
        }
        let table = $("<table>").attr("id", "gtable" + id); //create table and add id attribe
        let tbody = $("<tbody>");
        h1--;
        v1--;
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
        table.html(tbody); //add tbody to table

        $("#tabs" + id).empty(); //clear tab before drawing
        $("#tabs" + id).append(table);
    }
    var submitted = false;
    var count = 0; //count of how table tabs has been created. but don't not decress after the tabs is deleted
    var len = -1;

    var tabs = $("#myTabs").tabs(); //create tabs


    $("#submit").click(function () { //add new tab 
        if (valid) { //if pass validation
            count++;
            submitted = true;
            len = $("#myTabs ul").children().length; //getting the len of tabs
            let li = "<li id='li" + count.toString() + "'><a href='#tabs" + count + "'>Tab " + count + "</a><input type='checkbox' id='" + (count).toString() + "'></li>";
            $("#myTabs ul").append(li); //add child
            let div = "<div class='mytable' id='tabs" + count + "'></div>";
            tabs.append(div); //add div content
            tabs.tabs("refresh");
            $('#myTabs').tabs("option", "active", len); //active the last tab
            $("#myTabs").css("display", "block");
        }
    });

    $("#myTabs").tabs();

    
    $("#deleteTabs").click(function () { //delete tabs
        let selected = false;
        $('input[type=checkbox]').each(function () { //loop through checkbox if any one of them is checked
            if (this.checked) {
                let tabID = $(this).attr("id");
                $("#li" + parseInt(tabID)).remove(); //remvoe child
                $("#tabs" + tabID.toString()).remove(); //remvoe tab
                len--;
                selected = true; //check if user select any checkbox for appropriate message alert
            }
        });

        if (len >= 0) {
            secondLast = $("input[type=checkbox]:last").attr("id"); 
            $("a:last").trigger("click"); //after deletion, forcus the tab to the last one
        }
        if (len < 0) {
            $("#myTabs").css("display", "none"); //hide the tab if there is no tab
        }
        if (len >= 0 && !selected) {
            alert("Please select check box to delete");
        }
        selected = false;
    });
});
