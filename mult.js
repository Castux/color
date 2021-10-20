const steps = 5;

function redraw()
{
  var colors = [];
  var multiplier = hexToRgb(document.getElementById("color").value);

  for (r = 0 ; r <= 255 ; r += 255 / steps)
  for (g = 0 ; g <= 255 ; g += 255 / steps)
  for (b = 0 ; b <= 255 ; b += 255 / steps)
  {
    colors.push([
      r * multiplier[0] / 255,
      g * multiplier[1] / 255,
      b * multiplier[2] / 255
    ]);
  }

  make_hcl_plot(colors, "hclPlot", 800);
}

function setup()
{
  document.getElementById("color").oninput = redraw;
  redraw();
}
