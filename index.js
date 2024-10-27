
let diffX = 30;
let diffY = 10;
let positionX;
let positionY = 60;
let i = 0;
let flag = false;
let isCurrentYear = false;
let darkSquare = 7;

let blockTextIDs = [];
let dayValues = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let monthValues = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let monthCalenders = [];

// Initialize div
let init = function(parameter, blockClass){
  const block = document.createElement('div');
  const text = document.createElement('p');
  text.id = parameter; // Assign blockTextIDs[i] to id parameter
  block.appendChild(text);
  block.classList.add(blockClass);
  block.style.left = positionX + 'px';
  block.style.top = positionY + 'px';
  document.getElementById('Base').appendChild(block); // Add div inside Base div
}

let setDark = function(){
  document.getElementById(blockTextIDs[darkSquare]).parentElement.classList.replace('Block','BlockDark');
}

let setLight = function(){
  document.getElementById(blockTextIDs[darkSquare]).parentElement.classList.replace('BlockDark','Block');
}

let setOpacity = function(pos,opacity){
  document.getElementById(blockTextIDs[pos]).parentElement.style.opacity = opacity;
}

// Get index for div to set first day of month
let getIndexByDay = function(day){

  if(day === 'Sun'){
    return 7;
  }
  if(day === 'Mon'){
    return 8;
  }
  if(day === 'Tue'){
    return 9;
  }
  if(day === 'Wed'){
    return 10;
  }
  if(day === 'Thu'){
    return 11;
  }
  if(day === 'Fri'){
    return 12;
  }
  if(day === 'Sat'){
    return 13;
  }
}

// Formula to get Day on Jan 01 for the specified year
let getDayOnJan01 = function(year){
  let res = year - 1899 + Math.floor((year - 1901)/4);
  return dayValues[res%7];
}

// Generate calender for specified year
let generateCalenderForYear = function(year){

  if(year%4 == 0){
    monthDays[1] = 29; // For leap year, set number of days to 29 for Feb.
  }
  else{
    monthDays[1] = 28; // For non-leap year, rollback changes.
  }

  let day = getDayOnJan01(year); // Get starting day of year
  let prevDate = 31; // Dec will have 31 days everytime
  let dayIdx = 0; // Map day to idx ('Sun' --> 0)

  for(i=0;i<12;i++){ //Set starting day and previous date for every month
    monthCalenders.push({ startDay: day, prevDate: prevDate });
    dayIdx = getIndexByDay(day) - 7;
    day = dayValues[(dayIdx + monthDays[i])%7]; // Set starting day for next month
    prevDate = monthDays[i];
  }

}

// Reset css for calender
let resetCalender = function(){
  for(i=7;i<49;i++){
    document.getElementById(blockTextIDs[i]).innerHTML = '';
    setOpacity(i,"1"); // Set opacity back to 100%
  }
}

var currentDate = new Date(); //Get current date

// Fill divs with appropriate values of days of the specified month.
let populateCalender = function(month){
  resetCalender(); // Reset previous changes

  // For current date, shade div to dark
  if(isCurrentYear && month == currentDate.getMonth()){
    let day = monthCalenders[currentDate.getMonth()].startDay;
    darkSquare = getIndexByDay(day) + currentDate.getDate() - 1; //Get index for current date
    setDark();
  }
  else{
    setLight();
  }

  // Change value of current month HTML element. (Placed between arrows)
  document.getElementById('month').innerHTML = monthValues[month];
  itr = getIndexByDay(monthCalenders[month].startDay); //Block Iterator
  i = 1; //Represents Date

  // Set dates for specified month
  while(i <= monthDays[month]){
    document.getElementById(blockTextIDs[itr]).innerHTML = i;
    i++;
    itr++;
  }

  i = 1; // Set dates for next month and reduce opacity (Till the last div is reached)
  while(itr < 49){
    document.getElementById(blockTextIDs[itr]).innerHTML = i;
    setOpacity(itr,"0.4");
    i++;
    itr++;
  }

  itr = getIndexByDay(monthCalenders[month].startDay) - 1;
  i = monthCalenders[month].prevDate;

  // Set dates for previous month and reduce opacity (Till the first div is reached)
  while(itr > 6){
    document.getElementById(blockTextIDs[itr]).innerHTML = i;
    setOpacity(itr,"0.4");
    i--;
    itr--;
  }
}

// Generate block ids to access paragraph element of a div
for(i=1;i<50;i++){
  blockTextIDs.push('#D' + i);
}

let itr = 0;

// Generate calender structure using divs
for(i=0;i<7;i++){
  positionX = 360 + diffX;
  for(let j=0;j<7;j++){
    if(itr < 7){
      init(blockTextIDs[itr], 'BlockDark');
    }
    else{
      init(blockTextIDs[itr], 'Block');
    }
    itr++;
    positionX = positionX + 80 + diffX; // Adjust position for div
  }
  positionY = positionY + 80 + diffY; // Adjust position for div
}

// Initialize first 7 divs to Days of week
for(i=0;i<7;i++){
  document.getElementById(blockTextIDs[i]).innerHTML = dayValues[i];
}

let currentMonth = 0;

//Generate Calender for Specified Year
document.getElementById('Generate').onclick = function(){
  let year = document.getElementById('input-year').value;
  document.getElementById('input-year').value = '';
  document.getElementById('year-value').innerHTML = year;
  monthCalenders = []; //Reset monthCalenders to empty
  generateCalenderForYear(year);
  currentMonth = 0;  //Initialize the current month to Jan
  // For Current Year, display current month instead of Jan
  if(year == currentDate.getFullYear()){
    isCurrentYear = true;
    populateCalender(currentDate.getMonth());
    currentMonth = currentDate.getMonth();
  }
  else{
    isCurrentYear = false;
    populateCalender(currentMonth);
  }
  flag = true;  //Navigation enabled once the calender is generated.
}

//Display Calender for Previous Month
document.getElementById('prev').onclick = function(){
  if(flag == false){  //Active only when calender is generated.
    return;
  }
  currentMonth--;
  if(currentMonth < 0){
    currentMonth++;
    return;
  }
  populateCalender(currentMonth);
}

//Display Calender for Next Month
document.getElementById('next').onclick = function(){
  if(flag == false){  //Active only when the calender is generated.
    return;
  }
  currentMonth++;
  if(currentMonth > 11){
    currentMonth--;
    return;
  }
  populateCalender(currentMonth);
}
