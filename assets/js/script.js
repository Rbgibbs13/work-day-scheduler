// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  var dateTimeEL = $("#currentDay");
  var containerEl = $('.custom-container');
  var timeBlocks = $('.time-block');
  var saveBtns = $(".saveBtn");

  const monthsOfYear = {
    0 : "January",
    1 : "February",
    2 : "March",
    3 : "April",
    4 : "May",
    5 : "June",
    6 : "July",
    7 : "August",
    8 : "September",
    9 : "October",
    10 : "November",
    11 : "December",
  };

  var currentSecond = dayjs().second();
  var currentMinute = dayjs().minute();
  var currentHour = dayjs().hour();
  var timeState = "AM";

  var currentDay= dayjs().day();
  var currentMonth = dayjs().month();
  var currentYear = dayjs().year();

  var dayJSdate = monthsOfYear[currentMonth] + " " + currentDay + ", " + currentYear;
  var dayJStime = currentHour + ":" + currentMinute + ":" + currentSecond + " " + timeState;
  
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  saveBtns.on('click', function(event) {
    var btn = this;
    SaveToLocalStorage(btn);
  });
  
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  const CheckTime = () => {    
    for(let i = 0; i < timeBlocks.length; i++) {
      var idCheck = $(timeBlocks[i]).attr('id');
      idCheck = idCheck.split("-");

      //check to make sure current time > id time
      //swap block class to handle color
      //use +8 to shift to starting value 8am

      if(currentHour > idCheck[1]) {
        //Clear other two classes just in case to prevent bugs
        $(timeBlocks[i]).removeClass('future');
        $(timeBlocks[i]).removeClass('present');
        $(timeBlocks[i]).addClass('past');
      } else if(currentHour == idCheck[1]) {
        $(timeBlocks[i]).removeClass('past');
        $(timeBlocks[i]).removeClass('future');
        $(timeBlocks[i]).addClass('present');
      } else {
        $(timeBlocks[i]).removeClass('present');
        $(timeBlocks[i]).removeClass('past');
        $(timeBlocks[i]).addClass('future');
      }
    }
  };

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?

  const PopulateFromLocalStorage = () => {
    for(let i = 0; i < timeBlocks.length; i++) {
      var keyName = $(timeBlocks[i]).attr('id');
      $(timeBlocks[i]).children('textarea').text(localStorage.getItem(keyName));
    }
  };

  const SaveToLocalStorage = (inBtn) => {
    var textArea = $(inBtn.parentElement).children('textarea');
    var keyName = $(inBtn.parentElement).attr("id");
    localStorage.setItem(keyName, textArea.val());
  };

  const FormatDateTime = () => {
    if(currentHour > 12) {
      timeState = "PM";
      dayJStime = (currentHour - 12) + ":" + currentMinute + ":" + currentSecond + " " + timeState;
    } else {
      timeState = "AM";
      dayJStime = currentHour + ":" + currentMinute + ":" + currentSecond + " " + timeState;
    }
    dateTimeEL.text(dayJStime + " : " + dayJSdate);
  };

  // TODO: Add code to display the current date in the header of the page.
  setInterval(function() {
    currentSecond = dayjs().second();
    if(currentHour > 12) {
      timeState = "PM";
      dayJStime = (currentHour - 12) + ":" + currentMinute + ":" + currentSecond + " " + timeState;
    } else {
      timeState = "AM";
      dayJStime = currentHour + ":" + currentMinute + ":" + currentSecond + " " + timeState;
    }

    dateTimeEL.text(dayJStime + " : " + dayJSdate);
  }, 1000);

  setInterval(function() {
    //every min update
    CheckTime();
  }, 60000);

  PopulateFromLocalStorage();
  FormatDateTime();
  CheckTime();
});
