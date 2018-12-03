/*
    Sokthai Tang 
    UMass Lowell
    GUI I 
    HW8
    Using jQuery validator plugin to validate the input fields and Slider and Tabs UI plugin
    Created by ST on Dec/02/2018
    Updateed on Dec/02/2018
*/

$(function ($) {
    //slider ui

    var sliderOpts = {
        orientation: "horizonal",
        min: -200,
        max: 200,
        step: 1,
        // animate: true,
        // values: [50, 120],
        // range: true,
        // start: function () {
        //     $("#h1").fadeOut(function () {
        //         $(this).remove();
        //     });
        // },

        change: function (e, ui) {
            // $("<div></div>", {
            //     "class": "ui-widget-header ui-corner-all",
            //     id: "tip",
            //     text: ui.value,
            // css: {
            //     left: e.pageX - 35
            // }
            // }).appendTo("#slider");
            $("#h1").val(ui.value);
            $("form").submit();
        },
    };
    $("#h1slider").slider(sliderOpts);

    $("#h2slider").slider({ //set slider option
        min: -200,
        max: 200,
        step: 1,
        change: function (e, ui) {
            $("#h2").val(ui.value);
            $("form").submit();
        }
    })

    $("#v1slider").slider({
        min: -200,
        max: 200,
        step: 1,
        change: function (e, ui) {
            $("#v1").val(ui.value);
            $("form").submit();
        }
    })

    $("#v2slider").slider({
        min: -200,
        max: 200,
        step: 1,
        change: function (e, ui) {
            $("#v2").val(ui.value);
            $("form").submit();
        }
    })

    $("#h1").focusout(function () { //apply when out of focus
        $("#h1slider").slider("option", "value", parseInt($(this).val()));
    });

    $("#h2").focusout(function () {
        $("#h2slider").slider("option", "value", parseInt($(this).val()));
    });

    $("#v1").focusout(function () {
        $("#v1slider").slider("option", "value", parseInt($(this).val()));
    });

    $("#v2").focusout(function () {
        $("#v2slider").slider("option", "value", parseInt($(this).val()));
        $("form").submit();
    });

    $('#h1').keypress(function (event) { //apply when enter key is pressed
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') { //enter key is pressed
            $("#h1slider").slider("option", "value", parseInt($(this).val()));
        }
    });


})
