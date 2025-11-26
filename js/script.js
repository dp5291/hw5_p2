/* File: script.js
GUI Assignment: Creating Dynamic table with jQuery Validation Part 1
Dhruvkumar Patel, UMass Lowell Computer Science, Dhruvkumar_patel1@student.uml.edu
Copyright (c) 2025 by Dhruvkumar. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by DP on 11/25, 2025
Description: The user inputs are validated using the jQuery validation plugin.
If all four values are valid, the multiplictaion table is generated. All the vlaidation
checks are done and page does not reload if there is an error.
part 2
Added jQuery UI sliders for each input , two-way binding with the text boxes and jQuery UI tabbed
interface. A new tab is created every time when user clicks on save table, labeled with the parameters.
Also, individual tabs can be closed using close icon and multiple tabs can be selected, and delete at a
same time using button (delete selected)
citation:
Table creation references
 https://www.w3schools.com/jsref/met_table_insertrow.asp 
 https://www.w3schools.com/jsref/met_table_createthead.asp
 https://www.w3schools.com/jsref/met_node_appendchild.asp
 https://jqueryvalidation.org/jQuery.validator.addMethod/
 https://jqueryvalidation.org/validate/
 https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
 https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch06_SliderWidget.pdf
*/
// Global constants
var MIN = -50;
var MAX = 50;
var MAX_CELLS = 200 * 200;

function buildTable(minCol, maxCol, minRow, maxRow) {
  var grid = document.getElementById("grid");
  grid.innerHTML = ""; // clear any existing table

  // Create table head
  var thead = grid.createTHead();
  var headRow = thead.insertRow();

  // Top-left empty corner cell
  var corner = document.createElement("th");
  corner.textContent = "";
  headRow.appendChild(corner);

  // Column headers
  for (var c = minCol; c <= maxCol; c++) {
    var th = document.createElement("th");
    th.textContent = c;
    headRow.appendChild(th);
  }

  // Create table body
  var tbody = grid.createTBody();

  // Generate multiplication rows
  for (var r = minRow; r <= maxRow; r++) {
    var tr = tbody.insertRow();

    // Row header
    var thLeft = document.createElement("th");
    thLeft.textContent = r;
    tr.appendChild(thLeft);

    // Product cells
    for (var c2 = minCol; c2 <= maxCol; c2++) {
      var td = tr.insertCell();
      td.textContent = r * c2;
    }
  }
}

  var validator;

  //validator for checking min is not greater than max
  $.validator.addMethod("greaterEqualTo", function (value, element, param) {
    var target = $(param);
    var thisVal = parseFloat(value);
    var targetVal = parseFloat(target.val());

    if (isNaN(thisVal) || isNaN(targetVal)) {
      return true;
    }

    return thisVal >= targetVal;
  },
  "Maximum value must be greater than or equal to the minimum value."
);

  // store validator globally so slider can access it
  validator = $("#controls").validate({
    // Rules for each input 
    rules: {
      minCol: {
        required: true,
        number: true,
        range: [MIN, MAX]
      },
      maxCol: {
        required: true,
        number: true,
        range: [MIN, MAX],
        greaterEqualTo: "#minCol"
      },
      minRow: {
        required: true,
        number: true,
        range: [MIN, MAX]
      },
      maxRow: {
        required: true,
        number: true,
        range: [MIN, MAX],
        greaterEqualTo: "#minRow"
      }
    },

    // error message 
    messages: {
      minCol: {
        required: "Please enter a minimum column value.",
        number: "Please enter a valid number for the minimum column.",
        range: "Column values must be between -50 and 50."
      },
      maxCol: {
        required: "Please enter a maximum column value.",
        number: "Please enter a valid number for the maximum column.",
        range: "Column values must be between -50 and 50.",
        greaterEqualTo: "Maximum column must be greater than or equal to the minimum column."
      },
      minRow: {
        required: "Please enter a minimum row value.",
        number: "Please enter a valid number for the minimum row.",
        range: "Row values must be between -50 and 50."
      },
      maxRow: {
        required: "Please enter a maximum row value.",
        number: "Please enter a valid number for the maximum row.",
        range: "Row values must be between -50 and 50.",
        greaterEqualTo: "Maximum row must be greater than or equal to the minimum row."
      }
    },

    // For the error message where to place
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    }
  });

  $(document).ready(function () {
    var $status = $("#status");
  
    // activate the Tabs widget
    var $tabs = $("#tabs").tabs();
    var tabCounter = 1;
  
    // Create a new tab with the current table
    function createTableTab(minCol, maxCol, minRow, maxRow) {
      var label = minCol + " to " + maxCol + " by " + minRow + " to " + maxRow;
      var id = "tab-" + (tabCounter++);
  
      var $li = $("<li></li>");
      
      // Checkbox to delete multiple tabs
      var $checkbox = $("<input>", {
        type: "checkbox",
        class: "tab-check"
      });

      // Link with the close icon
      var $link = $("<a></a>").attr("href", "#" + id).text(label);
      var $closeIcon = $('<span class="ui-icon ui-icon-close" role="presentation"></span>');
  
      $li.append($checkbox).append($link).append($closeIcon);
      $tabs.find("ul").append($li);

      // copy of the table
      var $panel = $("<div></div>", { id: id })
      $panel.append($("#grid").clone().removeAttr("id"));
      $tabs.append($panel);
  
      // refresh Tabs widget and activate the new tab
      $tabs.tabs("refresh");
      var idx = $tabs.find("ul li").length - 1;
      $tabs.tabs("option", "active", idx);
    }
    
    // Click on close icon to delete that tab
    $tabs.on("click", "span.ui-icon-close", function () {
      var $li = $(this).closest("li");
      var panelId = $li.find("a").attr("href");   
      $(panelId).remove();                        
      $li.remove();                               
      $tabs.tabs("refresh");
    });
  
    // Delete all tabs which are selected
    $("#deleteTabs").on("click", function () {
      var $checked = $("#tabs .tab-check:checked");
    
      if ($checked.length === 0) {
        alert("No tabs selected to delete.");
        return;
      }
    
      $checked.each(function () {
        var $li = $(this).closest("li");
        var panelId = $li.find("a").attr("href"); 
        $(panelId).remove();                      
        $li.remove();                             
      });
    
      $tabs.tabs("refresh");
    });

  
  // Live table working
  function liveTable() {
    if (!$("#controls").valid()) {
      $("#grid").empty();
      return;
    }

    var minCol = Number($("#minCol").val());
    var maxCol = Number($("#maxCol").val());
    var minRow = Number($("#minRow").val());
    var maxRow = Number($("#maxRow").val());

    var total = (maxCol - minCol + 1) * (maxRow - minRow + 1);
    if (total > MAX_CELLS) {
      $("#grid").innerHTML = "";
      $status.removeClass("ok").addClass("err")
        .text("Error: range too large.");
      return;
    }

    buildTable(minCol, maxCol, minRow, maxRow);
    $status.removeClass("err").addClass("ok").text("Preview updated.");
  }

// Slider Widget
// min / max / value follow the book examples, slide callback updates the page.
var sliderOpts = {
  min: MIN,
  max: MAX,
  value: 0,                      
  slide: function (event, ui) {  
    //"slider-minCol" → input id "minCol"
    var sliderId = $(this).attr("id");      
    var inputId = sliderId.replace("slider-", ""); // "minCol"
    var $input = $("#" + inputId);

    // update the text box to sync with slider
    $input.val(ui.value);

    // validate and update live table
    validator.element($input);
    liveTable();
  }
};

// Initialize all four sliders with one call
$("#slider-minCol, #slider-maxCol, #slider-minRow, #slider-maxRow").slider(sliderOpts);

// whenever user types any numbers , slider moves too
$("#minCol, #maxCol, #minRow, #maxRow").on("input", function () {
  var val = parseInt(this.value, 10);
  var sliderSelector = "#slider-" + this.id; // e.g. "minCol" → "#slider-minCol"

  if (!isNaN(val) && val >= MIN && val <= MAX) {
    $(sliderSelector).slider("value", val);
  }

  validator.element(this);
  liveTable();
});

// Save table to new tab
  $("#controls").on("submit", function (event) {
    event.preventDefault();
    if (!$("#controls").valid()) return;

    var minCol = Number($("#minCol").val());
    var maxCol = Number($("#maxCol").val());
    var minRow = Number($("#minRow").val());
    var maxRow = Number($("#maxRow").val());

    buildTable(minCol, maxCol, minRow, maxRow);
    createTableTab(minCol, maxCol, minRow, maxRow);

    $status.text("Table Saved to New Tab!").addClass("ok");
  });

  // To start table at value 0
  function setDefaultValues() {
    $("#minCol, #maxCol, #minRow, #maxRow").val(0);
    $("#slider-minCol, #slider-maxCol, #slider-minRow, #slider-maxRow").slider("value", 0);
    buildTable(0, 0, 0, 0);
  }
  setDefaultValues();
});
