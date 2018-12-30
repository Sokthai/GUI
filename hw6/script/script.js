

function generateTable(){
    let hs = document.getElementById("h1").value;
    let he = document.getElementById("h2").value;
    let vs = document.getElementById("v1").value;
    let ve = document.getElementById("v2").value;

    var tblid = document.getElementById("gtable");  
    if (tblid) tblid.parentNode.removeChild(tblid);
    if (validation(hs, he, vs, ve) == false){
        return; // if false validation , return 
    }  
        
    // create table
    let table = document.createElement("table");
    table.setAttribute("id", "gtable");
    // create table body 
    let tbody = document.createElement("tbody");

    vs--; //reserve one column or row for index
    hs--;
    for (let v = vs; v <= ve ; v++){
        let tr = document.createElement("tr"); //add tr
        // (v == vs)? tr.setAttribute("class", "gth") : tr.setAttribute("class", "gtd");
        
        for (let h = hs; h <= he; h++){
            let td = document.createElement("td"); //add td
            (h == hs)? td.setAttribute("class", "gth") : td.setAttribute("class", "gtd"); //set attribute base on the cell 
            let cell ;

            if (v == vs && h == hs){
                 cell = document.createTextNode(""); //first cell
            }else if (v == vs){
                 td.setAttribute("class", "gth");
                 cell = document.createTextNode(h);
            }else{
                (h == hs)? cell = document.createTextNode(v) : cell = document.createTextNode(v*h);        
            }

            td.appendChild(cell); //add cell to td
            tr.appendChild(td); //add td to tr
        }
        
        tbody.appendChild(tr); // appending row
    }
    table.appendChild(tbody); 
    document.getElementById('table').appendChild(table);
    // document.body.appendChild(table); // add table to body
}

function validation(hs, he, vs, ve){
    if (!validateNumber("h1")) return false;
    if (!validateNumber("h2")) return false;
    if (!validateNumber("v1")) return false;
    if (!validateNumber("v2")) return false;

    if (hs == "" || he == "" || vs == "" || ve == ""){
        document.getElementById("message").innerHTML = "values cannot be empty"; //set error message 
        document.getElementById("message").style.display = "block"; //display error message
        return false;
    }
    // convert to number with unary sign "+"
    if ((+hs > +he) || (+vs > +ve)){
        document.getElementById("message").innerHTML = "START number CANNOT GREATER than END number";
        document.getElementById("message").style.display = "block";
        return false;
    }

    // set the range of the value less than 400. End - start <= 400
    if((+he - +hs) > 400 || (+ve - +vs) > 400){
        document.getElementById("message").innerHTML = "You exceed the allow range. END - START <= 400";
        document.getElementById("message").style.display = "block";
        return false;
    }

    document.getElementById("message").style.display = "none";
    return true;
}


function validateNumber(id){
    let num = document.getElementById(id).value; 
    var pattern = /[^-0-9]/g; //checking if the user input anything else other than number
    if (num.match(pattern)){
        document.getElementById("message").innerHTML = "only whole number is allowed"; 
        document.getElementById(id).style.backgroundColor = "lightcoral"; //changing the background color of text that fail validation
        document.getElementById("message").style.display = "block"; //show error message
        
        return false;
    }
        document.getElementById(id).style.backgroundColor = "white"; //changing back the backgroudnd color to normal if pass validation
        document.getElementById("message").style.display = "none"; //invisible error message
        return true;   
}

