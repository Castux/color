var cube_corners = [
	[255,  0,  0],
	[255,255,  0],
	[  0,255,  0],
	[  0,255,255],
	[  0,  0,255],
	[255,  0,255],
	[  0,  0,  0],
	[255,255,255]
];

function to_3d_data(pixels)
{
	var x = [];
	var y = [];
	var z = [];
	var colors = [];
	var text = [];

	function add_point(p)
	{
		var [r,g,b] = p;
    var [h,c,l] = hcl(r,g,b);
		var angle = h * Math.PI * 2;
		x.push(c * Math.cos(angle) / 2);
		y.push(c * Math.sin(angle) / 2);
		z.push(l);
    var css = rgbToCss(p);
		colors.push(css);
		text.push(css);
	}

	pixels.forEach(add_point);

	var data =
	{
		type: "scatter3d",
		name: "Colors",
		x: x,
		y: y,
		z: z,
		text: text,
		mode: "markers",
		marker: {
			color: colors,
			opacity: 0,
			size: 15
		},
		hoverinfo: 'text'
	}

	return data;
}

function rgbToCss(rgb)
{
  return `rgb(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])})`;
}

function hcl(r,g,b)
{
	var max = Math.max(r,g,b);
	var min = Math.min(r,g,b);
	var chroma = max - min;
	var light = (max + min) / 2;

	if (chroma == 0)
	{
		return [0, 0, light / 255];
	}

	var h;
	switch (max)
	{
      case r: h = (g - b) / chroma + (g < b ? 6 : 0); break;
      case g: h = (b - r) / chroma + 2; break;
      case b: h = (r - g) / chroma + 4; break;
    }

	return [h / 6, chroma / 255, light / 255];
}

function rgb(h,c,l)
{
  var h2 = h * 6;

  var max = l + c/2;
  var min = l - c/2;
  var mid = min + (1 - Math.abs(h2 % 2 - 1)) * c;

  max *= 255;
  min *= 255;
  mid *= 255;

  switch (Math.floor(h2))
  {
    case 0:
      return [max, mid, min];
    case 1:
      return [mid, max, min];
    case 2:
      return [min, max, mid];
    case 3:
      return [min, mid, max];
    case 4:
      return [mid, min, max];
    case 5:
      return [max, min, mid];
  }
}

var staticLayout;
var staticSeries;

function make_hcl_plot(pixels, divName, box_size)
{
  if(!staticLayout)
  {
  	staticLayout =
  	{
  		width: box_size,
  		height: box_size,
  		margin: {
  			l: 0,
  			r: 0,
  			b: 0,
  			t: 0
  		},
  		scene: {
  			aspectmode: "manual",
  			aspectratio: {
  				x: 1, y: 1, z: 1,
  			},
  			xaxis: {range: [-0.5, 0.5]},
  			yaxis: {range: [-0.5, 0.5]},
  			zaxis: {range: [-0.01, 1.01]},
  		}
    };
  }

  var data = to_3d_data(pixels);

  if (!staticSeries)
  {
    var corners = to_3d_data(cube_corners);
  	corners.marker.symbol = 'diamond';
  	corners.marker.size = 8;
  	corners.marker.line = {width: 2};
    staticSeries = [data, corners];
  }
  else
  {
    staticSeries[0] = data;
  }

	Plotly.react(divName, staticSeries, staticLayout);
}

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

function clamp(arr, min, max)
{
  for(var i = 0 ; i < arr.length ; i++)
  {
    if (arr[i] < min)
      arr[i] = min;
    else if (arr[i] > max)
      arr[i] = max;
  }
}
