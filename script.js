var dataPromise = d3.json("formattedData.json")

//Graph settings
var screen = {
  width: window.innerWidth,
  //height: window.innerHeight * 0.8
};

var margins = {
  top:80,
  bottom: 30,
  left: 40,
  right: 40
}

//Settings
var shownData = "quiz/test/final"
var rowSize = 20;
var rowGap = 0;
var picSize = rowSize;
var descriptionColSize = 140;
var colLabelHeight = 55;
var colSize = 45;
var labelSize = 15;
var nameFontSize = 15;
var dataStartX = picSize + descriptionColSize + margins.left;

var colorScaleArr = ["white", "#ff0000", "#ff6600", "#ffcc66", "#66ccff", "#0066ff","#0000cc"]
var scaleThresholds =  [0.5, 0.6, 0.7, 0.8, 0.9]

var colors = function(dayObj){
  //Takes a dayObj from penguins.grade
  var percentage = dayObj.grade / dayObj.max;
  if (percentage >= 0.9){
    return "#0000cc";//Blue
  }
  else if (percentage >= 0.8) {
    return "#0066ff";//Light blue
  }
  else if (percentage >= 0.7) {
    return "#66ccff";//green
  }
  else if (percentage >= 0.6) {
    return "#ffcc66";//orange yellow
  }
  else if (percentage >= 0.5){
    return "#ff6600";//red orange
  }
  else {
    return "#ff0000";//red
  }
}

var drawChart = function(dataSet, svgSelector)
//This function is called at the bottom of the code.
{
  var penguins = dataSet
  var validDays = []//Days that exist in the dataSet
  var dayAndGradeType = []//Quiz/test/final corresponding to days
  penguins.forEach(function(peng)
    {
    var validDaysTemp = peng.grades.forEach(function(gradeObj){
        if (!validDays.includes(gradeObj.day)){
          validDays.push(gradeObj.day);
          dayAndGradeType.push(gradeObj.type);
        };
      })
    });

  console.log("validDays", validDays);
  var penguins = dataSet;
  var graphWidth  = picSize + descriptionColSize + (colSize*validDays.length);
  var graphHeight = (rowSize * penguins.length) + (rowGap * penguins.length);
  var borderWidth = 1;


  //var colorScale = d3.scaleOrdinal(d3.schemeAccent);

  var graphSVG = d3.select(svgSelector)
              .attr("width", graphWidth + margins.left + margins.right)
              .attr("height", graphHeight + margins.top + margins.bottom + colLabelHeight);

  graphBorder = graphSVG.append("rect")
                     .attr("border-style", "solid")
                     .attr("x", margins.left)
                     .attr("y", margins.top + colLabelHeight)
                     .attr("width", graphWidth)
                     .attr("height", graphHeight)
                     .attr("fill", "white")
                     .style("stroke", "black")
                     .style("stroke-width", 1)
                     .classed("graph-border", true);

  var legend = graphSVG.append("g")
                          .classed("legend", true);

  var legendRects = legend.selectAll("rect")
                          .data(colorScaleArr)
                          .enter()
                          .append("rect")
                          .attr("x", function(color, i){return margins.left + 250 + 120 * i})
                          .attr("y", function(color, i){return 30})
                          .attr("height", function(color, i){return 20})
                          .attr("width", function(color, i){return 20})
                          .attr("fill", function(color){return color})

  var textArr = ["No data", "<50%", "50-60%", "60-70%", "70-80%", "80-90%", ">90%"]
  var legendText = legend.selectAll("text")
                          .data(textArr)
                          .enter()
                          .append("text")
                          .attr("x", function(color, i){return margins.left + 280 + 120 * i})
                          .attr("y", function(color, i){return 45})
                          .text(function(text){return  text})


  var columnDayLabelRow =  graphSVG.append("g")
                          .classed("label-row", true);

  var colDayLabels = columnDayLabelRow.selectAll("text")
                                .data(validDays)
                                .enter()
                                .append("text")
                                .attr("x", function(day, i){return dataStartX + colSize*i + colSize*0.2})
                                .attr("y", colLabelHeight*0.4 + margins.top)
                                .text(function(day){
                                  return "Day" + day;
                                })
                                .attr("font-size", labelSize)
                                .classed("day-label");

var columnTypeLabelRow =  graphSVG.append("g")
                        .classed("label-row", true);

var colTypeLabels = columnTypeLabelRow.selectAll("text:not(.day-label)")
                              .data(dayAndGradeType)
                              .enter()
                              .append("text")
                              .attr("x", function(day, i){console.log("HERE");return dataStartX + colSize*i + colSize*0.24})
                              .attr("y", colLabelHeight*0.8 + margins.top)
                              .text(function(type){
                                return type;
                              })
                              .attr("font-size", labelSize)


  var picColumn = graphSVG.append("g")
                          .classed("pic-column", true);


  var studentPics = picColumn.selectAll("image")
                              .data(penguins)
                              .enter()
                              .append("image")
                              .attr("xlink:href", function(peng){return "images/" + peng.picture})
                              .attr("width", picSize - 0.5)
                              .attr("height", rowSize - 0.5)
                              .attr("transform", function(peng, i){
                                return "translate(0" + margins.left + "," + ((rowSize*i) + margins.top + (rowGap*i) + colLabelHeight) + ")"
                              });

  var nameRow = graphSVG.append("g")
                          .classed("name-row", true);

  var studentNames = nameRow.selectAll("text")
                              .data(penguins)
                              .enter()
                              .append("text")
                              .attr("x", margins.left + picSize + 5)
                              .attr("y", function(peng, i){
                                return (rowSize*i) + margins.top + (rowGap*i) + rowSize * 0.7 + colLabelHeight;
                              })
                              //.attr("width", descriptionColSize)
                              //.attr("height", rowSize)
                              // .attr("transform", function(peng, i){
                              //   return "translate(" + (margins.left + picSize) + "," + ((rowSize*i) + margins.top + (rowGap*i)) + ")"
                              // })
                              .attr("font-family", "sans-serif")
                              .attr("font-size", nameFontSize)
                              .attr("fill", "black")
                              .text(function(peng){console.log("name:", peng.name); return peng.name;});

  var graphData = graphSVG.append("g")
                    .attr("x", margins.left)
                    .attr("y", margins.top)
                    .classed("graph-data", true);

  var penguinRows = []//Array of selections containing rectangles

  //Data rectangles


  var studentRows = graphData.selectAll("g")
                            .data(penguins)
                            .enter()
                            .append("g")
                            //Move rows to where they should be
                            .attr("transform", function(peng, i){
                              return "translate(0," + ((rowSize*i) + margins.top + (rowGap*i) + colLabelHeight) + ")"
                            })
                            .attr("student-name", function(peng){return peng.name})
                            .attr("class", function(peng, i){return "student-row"})


  var findIndexOfDay = function(dayObj, dayArr) {
    // console.log("day="+dayObj.day + "  :" +validDays.find(function(ele){
    //                                           return ele === dayObj.day;}))
    return validDays.find(function(day){return day === dayObj.day}) - 1
  }

  var gradeRects = studentRows.selectAll("rect")
                      .data(function(peng){return peng.grades})
                      .enter()
                      .append("rect")
                      //.attr("x", function(dayObj, i){return dataStartX + colSize*findIndexOfDay(dayObj, validDays)})
                      .attr("width", function(day, i){return colSize})
                      .attr("height", rowSize)
                      .style("stroke", "black")
                      .style("stroke-width", 1)
                      //change x based on day and y based on type(homework)
                      .attr("transform", function(dayObj, i){
                        //if (dayObj.type === "homework")
                        //{
                          //return "translate(" + (dataStartX + colSize*findIndexOfDay(dayObj, validDays)) + "," + rowSize/2 +")";
                        //}
                        //else{
                          return "translate(" + (dataStartX + colSize*findIndexOfDay(dayObj, validDays)) + ",0)";
                        //}
                      })
                      .attr("fill", function(dayObj){return colors(dayObj)})
                      .attr("fill-opacity", function(dayObj){
                        if (dayObj.type === "homework"){return 0}
                        else {return 1;}
                      })
                      //.attr("student-name", function(){return d3.select(this.parentNode).getAttribute("student-name")})
                      .attr("grade-type", function(dayObj, i){return dayObj.type})
                      .attr("day", function(dayObj, i){return dayObj.day})
                      .attr("grade", function(dayObj, i){return dayObj.grade + "/" + dayObj.max})
                      .classed("grade-rect", true);


  //Line settings
var lineContainer = graphSVG.append("g")
                            .attr("class", "line-container");

var picVerticalLine = lineContainer.append("line")
                      .attr("x1", picSize + margins.left)
                      .attr("y1", margins.top + colLabelHeight)
                      .attr("x2", picSize + margins.left)
                      .attr("y2", rowSize * penguins.length + margins.top + colLabelHeight)
                      .attr("stroke", "black")
                      .attr("stroke-width", 2)
                      .attr("fill", "none");

var descriptionVerticalLine = lineContainer.append("line")
                      .attr("x1", picSize + margins.left + descriptionColSize)
                      .attr("y1", margins.top + colLabelHeight)
                      .attr("x2", picSize + margins.left + descriptionColSize)
                      .attr("y2", rowSize * penguins.length + margins.top + colLabelHeight)
                      .attr("stroke", "black")
                      .attr("stroke-width", 2)
                      .attr("fill", "none");

    penguins.forEach(function(d, i){
      var rowLine = lineContainer.append("line")
                            .attr("x1", margins.left)
                            .attr("y1", (rowSize +rowGap)* i + margins.top + colLabelHeight)
                            .attr("x2", margins.left + graphWidth)
                            .attr("y2",  (rowSize +rowGap)* i + margins.top + colLabelHeight)
                            .attr("stroke", "black")
                            .attr("stroke-width", 3)
                            .attr("fill", "none");
    })
};


var initializeEventListeners = function(data){
  document.getElementById("switch-data").addEventListener("click", function(){
          var penguins = data;
          var validDays = []//Days that exist in the dataSet
          var dayAndGradeType = []//Quiz/test/final corresponding to days
          penguins.forEach(function(peng)
            {
            var validDaysTemp = peng.grades.forEach(function(gradeObj){
                if (!validDays.includes(gradeObj.day)){
                  validDays.push(gradeObj.day);
                  dayAndGradeType.push(gradeObj.type);
                };
              })
            });
          var studentRows = d3.selectAll(".student-row");
          console.log("rows", studentRows);


          var findIndexOfDay = function(dayObj, dayArr) {
            // console.log("day="+dayObj.day + "  :" +validDays.find(function(ele){
            //                                           return ele === dayObj.day;}))
            return validDays.find(function(day){return day === dayObj.day}) - 1
          }

          var gradeRects = studentRows.selectAll("rect")
                              .data(function(peng){return peng.grades})

                              //.attr("x", function(dayObj, i){return dataStartX + colSize*findIndexOfDay(dayObj, validDays)})
                              .attr("width", function(day, i){return colSize})
                              .attr("height", rowSize)
                              .style("stroke", "black")
                              .style("stroke-width", 1)
                              //change x based on day and y based on type(homework)
                              .attr("transform", function(dayObj, i){
                                //if (dayObj.type === "homework")
                                //{
                                  //return "translate(" + (dataStartX + colSize*findIndexOfDay(dayObj, validDays)) + "," + rowSize/2 +")";
                                //}
                                //else{
                                  return "translate(" + (dataStartX + colSize*findIndexOfDay(dayObj, validDays)) + ",0)";
                                //}
                              })
                              .attr("fill", function(dayObj){return colors(dayObj)})
                              .attr("fill-opacity", function(dayObj){
                                if (shownData === "quiz/test/final")
                                {
                                  if (dayObj.type === "homework"){return 1}
                                  else {return 0;}
                                }
                                else if (shownData === "homework"){

                                  if (dayObj.type === "homework"){return 0}
                                  else {return 1;}
                                }
                              })
                              //.attr("student-name", function(){return d3.select(this.parentNode).getAttribute("student-name")})
                              .attr("grade-type", function(dayObj, i){return dayObj.type})
                              .attr("day", function(dayObj, i){return dayObj.day})
                              .attr("grade", function(dayObj, i){return dayObj.grade + "/" + dayObj.max});
          if (shownData === "quiz/test/final"){
            shownData = "homework";
            document.getElementById("data-heading").innerText = "Homework Grades(%)";
          document.getElementById("switch-data").innerText = "See quiz/test/final grades";}
          else if (shownData === "homework"){
            shownData = "quiz/test/final";
            document.getElementById("data-heading").innerText = "Quiz/Test/Final Grades(%)";
          document.getElementById("switch-data").innerText = "See homework grades";}
          console.log("NOW SHOWING:", shownData)

        });

      document.getElementById("description").addEventListener("click", function(){
          window.alert("This chart allows you to analyze the change of the data based on colors. Each row represents a student and each column represents a day.  You can scroll sideways to see more data. The color of each cell illustrates the grade of one of quiz/test/final/homework. The purpose of this design is to compare each student as well as to illustrate the change throughout the semester. Using the chart, you can see some of the penguins, especially painter-penguin, penguin-grill, and pharaoh-penguin are struggling in the class while some others like pilot-penguin and crafty-penguin are constantly getting good grades.")
      });
  }


dataPromise.then(function(data){
      console.log("data", data)
      initializeEventListeners(data);
      drawChart(data, "#chart");
      //window.alert("This chart allows you to analyze the change of the data based on colors. Each row represents a student and each column represents a day.  You can scroll sideways to see more data. The color of each cell illustrates the grade of one of quiz/test/final/homework. The purpose of this design is to present the data to be able to comparable as well as to illustrate the change.")

    });
