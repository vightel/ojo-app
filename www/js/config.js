var config = {
	streamer_url: 	"http://ojo-streamer.herokuapp.com",
	//bot_url: 		"http://ojo-bot.herokuapp.com",
	tiler_url: 		"http://ojo-tiler.herokuapp.com",

	//streamer_url: 	"http://localhost:7464",
	bot_url: 			"http://localhost:7465",
	
	fbAppId: 		"1505913686298260",
	fbAppSecret: 	"6d7172f7bc391f9e59600b04a71e5822",
	
    worldmapid:     "cappelaere.map-1d8e1acq",
	regions:    	[
	    { 	id: 		0, 
			region: 	"d02",
			name: 		'Central America',
			bbox:     	[-92.68, 6.17, -75.85, 19.08 ],
			target:   	[12.63, -84.27],
			min_zoom: 	5,
			max_zoom:  	18,
			map_id:   	"cappelaere.map-mx5g2tn3",
		    worldmapid: "cappelaere.map-1d8e1acq",
			bucket:   	"ojo-d2" 
		},
	    { 	id: 		1, 
			region: 	"d03",
			name: 		'Hispaniola',
	        bbox:     	[-74.94, 16.35, -64.98, 21.42 ],
	        target:   	[18.89, -69.96],
	        min_zoom: 	5,
			max_zoom:	18,
	        map_id:   	"cappelaere.map-q4hdwmh3",
		    worldmapid: "cappelaere.map-1d8e1acq",
	        bucket:   	"ojo-d3"
		},
	    { 	id: 		2, 
			name: 		'Namibia',
			region: 	"d04",
			bbox:     	[21.0, -21, 25.4, -17 ],
	        target:   	[-18, 23],
	        min_zoom: 	5,
			max_zoom:	18,
	        map_id:   	"cappelaere.map-q4hdwmh3",
		    worldmapid: "cappelaere.map-1d8e1acq",
	        bucket:   	"ojo-d4"
		}
	]
}