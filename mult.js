const steps = 5;

function redraw()
{
  var colors = [];
  var multiplier = hexToRgb(document.getElementById("color").value);

  multiplier[0] /= 255;
  multiplier[1] /= 255;
  multiplier[2] /= 255;

  var mode = document.getElementById("mode").value;

  for (r = 0 ; r <= 1.0 ; r += 1.0 / steps)
  for (g = 0 ; g <= 1.0 ; g += 1.0 / steps)
  for (b = 0 ; b <= 1.0 ; b += 1.0 / steps)
  {
    var color;

    switch (mode)
    {
      case "Multiply":
        color = [
          r * multiplier[0],
          g * multiplier[1],
          b * multiplier[2]
        ];
        break;
      case "Screen":
        color = [
          1 - (1 - r) * (1 - multiplier[0]),
          1 - (1 - g) * (1 - multiplier[1]),
          1 - (1 - b) * (1 - multiplier[2])
        ];
        break;
      case "Overlay":
        color = [
          r < 0.5 ? 2 * r * multiplier[0] : 1 - (1 - 2 * (r - 0.5)) * (1 - multiplier[0]),
          g < 0.5 ? 2 * g * multiplier[1] : 1 - (1 - 2 * (g - 0.5)) * (1 - multiplier[1]),
          b < 0.5 ? 2 * b * multiplier[2] : 1 - (1 - 2 * (b - 0.5)) * (1 - multiplier[2])
        ];
        break;
      case "Color burn":
        color = [
          1 - (1 - r) / multiplier[0],
          1 - (1 - g) / multiplier[1],
          1 - (1 - b) / multiplier[2]
        ];
        break;
      case "Linear burn":
        color = [
          r + multiplier[0] - 1,
          g + multiplier[1] - 1,
          b + multiplier[2] - 1
        ];
        break;
      case "Color dodge":
        color = [
          r / (1 - multiplier[0]),
          g / (1 - multiplier[1]),
          b / (1 - multiplier[2])
        ];
        break;
      case "Linear dodge":
        color = [
          r + multiplier[0],
          g + multiplier[1],
          b + multiplier[2]
        ];
        break;
      case "Lighten":
        color = [
          Math.max(r, multiplier[0]),
          Math.max(g, multiplier[1]),
          Math.max(b, multiplier[2])
        ];
        break;
      case "Darken":
        color = [
          Math.min(r, multiplier[0]),
          Math.min(g, multiplier[1]),
          Math.min(b, multiplier[2])
        ];
        break;
    }

    clamp(color, 0, 1);

    color[0] *= 255;
    color[1] *= 255;
    color[2] *= 255;

    colors.push(color);
  }

  make_hcl_plot(colors, "hclPlot", 800);
}

function setup()
{
  document.getElementById("color").oninput = redraw;
  document.getElementById("mode").oninput = redraw;
  redraw();
}
