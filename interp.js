const gridSize = 12;
var cells = [];
var colorCount = 2;

function hexToRgb(hex)
{
  var aRgbHex = hex.match(/[a-f\d]{1,2}/g);
  var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16)
  ];
  return aRgb;
}

function interpolate(a, b, x)
{
  return [
    a[0] * (1-x) + b[0] * x,
    a[1] * (1-x) + b[1] * x,
    a[2] * (1-x) + b[2] * x,
  ];
}

function setupDivs()
{
    var container = document.getElementById("color-palette");
    container.innerHTML = "";

    cells = [];

    function addRow()
    {
      var row = document.createElement("div");
      row.classList.add("row");
      container.appendChild(row);

      var array = [];

      for (var i = 0 ; i < gridSize ; i++)
      {
        var cell = document.createElement("div");
        cell.classList.add("col");
        cell.classList.add("cell");
        row.appendChild(cell);
        array.push(cell);
      }

      cells.push(array);
    }

    switch (colorCount)
    {
      case 2:
        addRow();
        break;
      case 4:
        for(var i = 0; i < gridSize ; i++)
          addRow();
        break;
    }
}

function drawPalette()
{
  var colors = [];
  for(var i = 1; i <= colorCount; i++)
  {
    var input = document.getElementById("color" + i);
    colors[i - 1] = hexToRgb(input.value);
  }

  var results = [];

  if (colorCount == 2)
  {
    cells[0].forEach((cell, i) =>
    {
      var col = interpolate(colors[0], colors[1], i / (gridSize-1));
      cell.style.backgroundColor = rgbToCss(col);
      results.push(col);
    });
  }
  else if (colorCount == 4)
  {
    for(var i = 0; i < gridSize ; i++)
    {
      for(var j = 0; j < gridSize ; j++)
      {
        var cell = cells[i][j];
        var c1 = interpolate(colors[0], colors[1], j / (gridSize-1));
        var c2 = interpolate(colors[2], colors[3], j / (gridSize-1));
        var col = interpolate(c1, c2, i / (gridSize-1));
        cell.style.backgroundColor = rgbToCss(col);
        results.push(col);
      }
    }
  }

  make_hcl_plot(results, "hclPlot");
}

function resetNumber()
{
  colorCount = parseInt(document.getElementById("numpoints").value);

  for(var i = 1; i <= 4; i++)
  {
    var input = document.getElementById("color" + i);
    input.style.display = i <= colorCount ? "" : "none";
  }

  setupDivs();
  drawPalette();
}

function setup()
{
  document.getElementById("numpoints").onchange = resetNumber;
  for (let selector of document.getElementsByClassName("color-selector"))
  {
    selector.oninput = drawPalette;
  }

  resetNumber();
}
