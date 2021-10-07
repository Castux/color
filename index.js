var canvas;
var ctx;
var original_data;

const box_size = 500;

function render_image()
{
	var hue = document.getElementById("hue_box").checked;
	var saturation = document.getElementById("saturation_box").checked;
	var lightness = document.getElementById("lightness_box").checked;

	var new_data = ctx.createImageData(original_data);
	for(var i = 0; i < original_data.data.length ; i += 4)
	{
		var r = original_data.data[i];
		var g = original_data.data[i + 1];
		var b = original_data.data[i + 2];
		var a = original_data.data[i + 3];

		var max = Math.max(r,g,b);
		var min = Math.min(r,g,b);
		var light = (max + min) / 2;
		var chroma = (max - min) / 2;

		if (!hue)
		{
			r = max;
			g = min;
			b = min;
		}
		if (!lightness)
		{
			r = r - light + 127.5;
			g = g - light + 127.5;
			b = b - light + 127.5;

			light = 127.5;
		}
		if (!saturation)
		{
			var max_chroma = light > 127.5 ? 255 - light : light;
			if (chroma != 0)
			{
				r = (r - light) / chroma * max_chroma + light;
				g = (g - light) / chroma * max_chroma + light;
				b = (b - light) / chroma * max_chroma + light;
			}
			else
			{
				r = light + max_chroma;
				g = light - max_chroma;
				b = light - max_chroma;
			}
		}

		new_data.data[i]     = Math.floor(r);
		new_data.data[i + 1] = Math.floor(g);
		new_data.data[i + 2] = Math.floor(b);
		new_data.data[i + 3] = a;
	}

	ctx.putImageData(new_data, 0, 0);
	process_pixels(new_data.data);
}

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

cube_corners.forEach(p =>
{
	var [h,c,l] = hcl(p[0],p[1],p[2]);
	p.push(h);
	p.push(c);
	p.push(l);
});

function to_3d_data(pixels)
{
	var x = [];
	var y = [];
	var z = [];
	var colors = [];
	var text = [];

	function add_point(p)
	{
		var [r,g,b,h,c,l] = p;
		var angle = h * Math.PI * 2;
		x.push(c * Math.cos(angle) / 2);
		y.push(c * Math.sin(angle) / 2);
		z.push(l);
		colors.push(`rgb(${r},${g},${b})`);
		text.push(`${r},${g},${b}`);
	}

	pixels.forEach(add_point);

	var data =
	{
		type: "scatter3d",
		name: "Pixels",
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

function make_hcl_plot(pixels)
{
	var data = to_3d_data(pixels);
	var corners = to_3d_data(cube_corners);
	corners.marker.symbol = 'diamond';
	corners.marker.size = 8;
	corners.marker.line = {width: 2};

	var layout =
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

	Plotly.newPlot('hcl-plot', [data, corners], layout);
}

function make_hc_plot(pixels)
{
	var x = [];
	var y = [];
	var colors = [];
	var text = [];

	var hashed = {};

	for(var i = 0 ; i < pixels.length ; i++)
	{
		var [r,g,b,h,c,l] = pixels[i];

		if (!hashed[[h,c]])
		{
			r = r - (l - 0.5) * 255;
			g = g - (l - 0.5) * 255;
			b = b - (l - 0.5) * 255;

			var angle = h * Math.PI * 2;
			x.push(c * Math.cos(angle) / 2);
			y.push(c * Math.sin(angle) / 2);
			colors.push(`rgb(${r},${g},${b})`);
			text.push(`${r},${g},${b}`);

			hashed[[h,c]] = true;
		}
	}

	var data =
	{
		type: "scattergl",
		name: "Pixels",
		x: x,
		y: y,
		text: text,
		mode: "markers",
		marker: {
			color: colors,
			size: 10,
			line: {width: 0}
		},
		hoverinfo: 'text'
	}

	var layout =
	{
		width: box_size,
		height: box_size,
		margin: {
			l: 0,
			r: 0,
			b: 0,
			t: 0
		},
		xaxis: {range: [-0.51, 0.51]},
		yaxis: {range: [-0.51, 0.51]},
		shapes: [{
			type: 'circle',
			xref: 'x',
			yref: 'y',
			x0: -0.5,
			y0: -0.5,
			x1: 0.5,
			y1: 0.5,
			line: {
				color: 'rgb(50, 50, 50)'
			}
		}]
	}

	Plotly.newPlot('hc-plot', [data], layout);
}

function process_pixels(data)
{
	var pixels = [];
	var hashed = {};

	for(var i = 0; i < data.length ; i += 4)
	{
		var r = data[i];
		var g = data[i + 1];
		var b = data[i + 2];

		var [h,c,l] = hcl(r,g,b);
		var p = [r,g,b,h,c,l];

		if(!hashed[p])
		{
			pixels.push(p);
			hashed[p] = true;
		}
	}

	make_hcl_plot(pixels);
	make_hc_plot(pixels);
}

function on_file_selected(e)
{
	var image_src = URL.createObjectURL(event.target.files[0]);
	var img = new Image();
	img.src = image_src;
	img.onload = function()
	{
		if (img.width > img.height)
		{
			canvas.width = box_size;
			canvas.height = box_size / img.width * img.height;
		}
		else
		{
			canvas.height = box_size;
			canvas.width = box_size / img.height * img.width;
		}
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		original_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		canvas.removeAttribute("data-caman-id");
		render_image();
	};
}

function on_boxes_changed(e)
{
	render_image();
}

function setup()
{
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	var file_selector = document.getElementById("file_selector");
	file_selector.onchange = on_file_selected;

	document.getElementById("hue_box").onchange = on_boxes_changed;
	document.getElementById("saturation_box").onchange = on_boxes_changed;
	document.getElementById("lightness_box").onchange = on_boxes_changed;
}
