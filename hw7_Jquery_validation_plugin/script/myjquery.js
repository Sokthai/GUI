/*
    Sokthai Tang 
    UMass Lowell
    GUI I 
    HW7
    Using jQuery validator plugin to validate the input fields
    Created by ST on Nov/21/2018
    Updateed on Nov/25/2018
*/




$(document).ready(function () {

    // <!-- jquery validation plugin cdn -->
    // <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/jquery.validate.min.js"></script>
    // <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/additional-methods.min.js"></script>


    //custom addMethod function    
    $.validator.addMethod("custom", (value, element) => {
        return value.length <= 3 //|| this.optional(element) ; //this.optional() is to check if the element is optional or not
    }, "you number can't exceed 3 digits long");

    //jquery validation plugin documents
    //https://jqueryvalidation.org/validate/
    $("form").validate({
        rules: {
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
        messages: {
            h1: {
                required: () => {
                    $("#h1").css("background-color", "lightcoral");
                    return "Horizonal START field is required"
                },
                number: () => {
                    $("#h1").css("background-color", "lightcoral");
                    return "Please enter <em style='color: red'>number</em> for Horizonal START"
<<<<<<< HEAD
                },
                nowhitespace:()=>{
                    $("#h1").css("background-color", "lightcoral");
                    return "No White space is allow";
                }
=======
                }

>>>>>>> fc0bfc01ae6643219bdff93a486ec2a43eec46d2
            },
            h2: {
                required: () => {
                    $("#h2").css("background-color", "lightcoral");
                    return "Horizonal END field is required"
                },
                number: () => {
                    $("#h2").css("background-color", "lightcoral");
                    return "Please enter <em style='color: red'>number</em> for Horizonal END"
<<<<<<< HEAD
                },
                nowhitespace:()=>{
                    $("#h2").css("background-color", "lightcoral");
                    return "No White space is allow";
=======
>>>>>>> fc0bfc01ae6643219bdff93a486ec2a43eec46d2
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
<<<<<<< HEAD
                },
                nowhitespace:()=>{
                    $("#v1").css("background-color", "lightcoral");
                    return "No White space is allow";
=======
>>>>>>> fc0bfc01ae6643219bdff93a486ec2a43eec46d2
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
<<<<<<< HEAD
                },
                nowhitespace:()=>{
                    $("#v2").css("background-color", "lightcoral");
                    return "No White space is allow";
=======
>>>>>>> fc0bfc01ae6643219bdff93a486ec2a43eec46d2
                }
            }
        },
        invalidHandler: function (event, validator) { //if the form is not valid, do sth about it
            let errors = validator.numberOfInvalids(); //return the number of error fields
            if (errors) {
                let message = "Please fix all the error before continue";
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
            
            let valid = validation(h1, h2, v1, v2);
            if (valid === true) {
                $("#message").css("display", "none");
                generateTable(h1, h2, v1, v2);
            } else {
                $("#message").html(valid);
                $("#message").show();
            }
        }
    })


    function validation(h1, h2, v1, v2) {
        let errmsg;
        if ((+h2 < +h1) || (+v2 < +v1)) { //convert to number with + sign
            errmsg = "START number CANNOT GREATER than END number";
            return errmsg;
        } else if ((+h2 - +h1) > 400 || (+v2 - +v1) > 400) {
            errmsg = "You exceed the allow range. END - START <= 400"
            return errmsg;
        }
        return true;
    }


    function generateTable(h1, h2, v1, v2) {
        $("#gtable").remove();
        let table = $("<table>").attr("id", "gtable"); //create table and add id attribe 
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
        table.append(tbody); //add tbody to table
        $("#table").append(table);
    }
});
