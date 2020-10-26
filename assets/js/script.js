let today = moment().format("dddd, MMM Do, YYYY");
$("#currentDay").text(today);

//military time
let dayStart = 0800;
let dayEnd = 1700;
let saveObject = JSON.parse(localStorage.getItem("workdaySave")) || {};

let createCalDiv = function(hour) {
    let hourBlock = moment().set('hour', dayStart + hour).format("h a");
    let hourID = "hour-" + hour;
    let calDiv = $("<div>").addClass("row").attr("id", hourID).attr("data-hourBlock", hourBlock);
    $("<p>").addClass("col-1 time-stamp hour").text(hourBlock).appendTo(calDiv);
    let scheduleItem = $("<p>").addClass("col-10 schedule-item").appendTo(calDiv);
    if(saveObject[hourID]) {
        //console.log("save found for " + hourID);
        scheduleItem.text(saveObject[hourID]);
    } /*else {
        console.log('save not found for ' + hourID);
    } */
    $("<p>").addClass("col-1 saveBtn").html('<span class="oi oi-lock-locked"></span>').appendTo(calDiv);
    calDiv.appendTo(".container");
}

let setCalendar = function() {
    let date = moment(today, "L").set("hour, " + dayStart);
    //console.log(date);
    for (let i = 0; i < 10; i++) {
        createCalDiv(i);
    }
}

//update items in list
$(".container").on("click", ".schedule-item", function() {
    console.log(".schedule-item clicked")
    
    let text = $(this)
        .text()
        .trim();
    let status = $(this)
        .attr("class");
    let textInput = $("<textarea>")
        .addClass(status)
        .val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
  });

$(".container").on("blur", "textarea", function() {
    let text = $(this)
        .val()
        .trim();

    let status = $(this)
        .attr("class");
    console.log(status);

    let taskP = $("<p>")
        .addClass(status)
        .text(text);

    saveObject[$(this).closest(".row").attr("id")] = text;
    $(this).replaceWith(taskP);
});

//saving items
$(".container").on("click", ".saveBtn", function() {
    let saveItem = JSON.stringify(saveObject);
    console.log ("we are going to save: " + saveItem);
    localStorage.setItem("workdaySave", saveItem);
    console.log ("we have saved: " + saveObject);
  });

let updateTimeBlock = function() {
    //console.log(this);
    let time = $(this).closest(".row").attr("data-hourBlock");
    //console.log(time);
    //console.log(moment(time, "h a").format("M-D-YY LTS"));
    $(this).removeClass("past present future");

    let timeDiff = (moment().diff(moment(time, "h a"), "minutes"));
    //console.log(timeDiff);

    if (timeDiff > 60) {
        $(this).siblings().addClass("past");
    }
    else if (timeDiff < 60 && timeDiff > 0) {
        $(this).siblings().addClass("present");
    }
    else if (timeDiff < 0) {
        $(this).siblings().addClass("future");
    }
};

let timeOutInterval = setInterval(function(){
    $(".time-stamp").each(updateTimeBlock); 
}, (1000*60*5)) //updates every 5 minutes

setCalendar();
$(".time-stamp").each(updateTimeBlock);