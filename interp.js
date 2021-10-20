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

function rgbToCss(rgb)
{
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
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

    if (colorCount == 2)
    {

      var row = document.createElement("div");
      row.classList.add("row");
      container.appendChild(row);

      cells = [];

      for (var i = 0 ; i < gridSize ; i++)
      {
        var cell = document.createElement("div");
        cell.classList.add("col");
        cell.classList.add("cell-" + i);
        cell.classList.add("cell");
        row.appendChild(cell);
        cells.push(cell);
      }
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

  if (colorCount == 2)
  {
    cells.forEach((cell, i) =>
    {
      var col = interpolate(colors[0], colors[1], i / cells.length);
      cell.style.backgroundColor = rgbToCss(col);
    });
  }
}

function resetNumber()
{
  colorCount = document.getElementById("numpoints").value;

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
