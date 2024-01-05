// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  var dateTimeEL = $("#currentDay");
  var containerEl = $('.custom-container');
  var timeBlocks = $('.time-block');
  var saveBtns = $(".saveBtn");

  var date = moment().format('LL');
  var time = moment().format("LT");
  var globalHour = dayjs().hour();
  var shiftValue = 8;
  dateTimeEL.text(time + " : " + date);
  
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

  const PopulateFromLocalStorage = () => {
    console.log(timeBlocks.length);
    for(let i = 0; i < timeBlocks.length; i++) {
      var keyName = $(timeBlocks[i]).attr('id');
      $(timeBlocks[i]).children('textarea').text(localStorage.getItem(keyName));
    }
  }
  
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  const CheckTime = () => {
    //get first integer in time and then if it is 1 add the second integer for cases 10-12
    //1 is excluded since 1 AM is not on the schedule
    var timeCompare = time[0];
    if(timeCompare == 1) { timeCompare += time[1]; }
    
    for(let i = 0; i < timeBlocks.length; i++) {
      var idCheck = $(timeBlocks[i]).attr('id');

      //check to make sure current time > id time
      //swap block class to handle color
      //use +8 to shift to starting value 8am
      if(timeCompare > i + shiftValue) {
        //Clear other two classes just in case to prevent bugs
        $(timeBlocks[i]).removeClass('future');
        $(timeBlocks[i]).removeClass('present');
        $(timeBlocks[i]).addClass('past');
      } else if (timeCompare == i + shiftValue) {
        $(timeBlocks[i]).removeClass('past');
        $(timeBlocks[i]).removeClass('future');
        $(timeBlocks[i]).addClass('present');
      } else {
        $(timeBlocks[i]).removeClass('present');
        $(timeBlocks[i]).removeClass('past');
        $(timeBlocks[i]).addClass('future');
      }
    }
  }

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  const SaveToLocalStorage = (inBtn) => {
    var textArea = $(inBtn.parentElement).children('textarea');
    var keyName = $(inBtn.parentElement).attr("id");

    console.log(keyName + " : " + textArea.val());
    localStorage.setItem(keyName, textArea.val());
  };

  // TODO: Add code to display the current date in the header of the page.
  setInterval(function() {
    var time = moment().format("LTS");
    dateTimeEL.text(time + " : " + date);
    
    //CheckTime();
  }, 1000);

  setInterval(function() {
    //every min update
    CheckTime();
  }, 60000);

  PopulateFromLocalStorage();
  CheckTime();
});
