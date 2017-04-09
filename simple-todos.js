Tasks = new Mongo.Collection("CCDB1");
SpetialJoin = new Mongo.Collection("subALL4");


if (Meteor.isClient) {

    Template.PQform.events({

        "click .PointQbutton": function(event) {

                event.preventDefault();

                // Get value from form element

                var text2 = document.getElementById("coords2").value;
                var text1 = document.getElementById("coords1").value;



                Meteor.call("doMapReducePointQuery", text1, text2, function(error, result) {
                    console.log("hi");

                    if (error) {

                        console.error(error)
                    } else {

                        console.log("It works!");
                    }

                    //start doing sth with mapreduce result here:
                    for (var i = 0; i < result.length; i++) {
                        var coordinates = result[i]['value']['coords'];
                        var points = [];
                        for (var j = 0; j < result.length; j++) {
                            points.push(new google.maps.LatLng(coordinates[j][1], coordinates[j][0]))

                        }

                        var bermudaTriangle = new google.maps.Polygon({
                            path: points,
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35

                        });

                        bermudaTriangle.setMap(map);


                    }

                    map.setCenter({
                        lat: coordinates[0][1],
                        lng: coordinates[0][0]
                    });

                }); //end meteor call
            } //end event
    }); //end pqform event


    Template.WQform.events({


        "click .WindowQbutton": function(event) {
                event.preventDefault();

                var text3 = document.getElementById("coords3").value;
                var text4 = document.getElementById("coords4").value;
                var text5 = document.getElementById("coords5").value;
                var text6 = document.getElementById("coords6").value;
                // var winArr=[text3,text4,text5,text6];

                Meteor.call("doMapReduceWindowQuery", text3, text4, text5, text6, function(error, result) {

                    if (error) {
                        console.error(error)
                    } else {

                        console.log("window query works!");
                    }
                    console.log(result, "result");


                    //start doing sth with mapreduce result here:

                    for (var i = 0; i < result.length; i++) {
                        var points2 = [];
                        var coordinates = result[i]['value']['coords'];

                        for (var j = 0; j < 4; j++) {
                            points2.push(new google.maps.LatLng(coordinates[j][1], coordinates[j][0]));
                        }

                        var redAreas = new google.maps.Polygon({
                            path: points2,
                            strokeColor: '#4d4dff',
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                            fillColor: '#4d4dff',
                            fillOpacity: 0.35

                        });

                        redAreas.setMap(map);
                    }


                    map.setCenter({
                        lat: coordinates[0][1],
                        lng: coordinates[0][0]
                    });

                });
            } //end event
            // Prevent default browser form submit


    }); //end PQform



    Template.SJQform.events({

        "click .SJQbutton": function(event) {
            event.preventDefault();

            Meteor.call("doMapReduceSJQuery", "EHSAN", function(error, result) {

                if (error) {
                    console.error(error)
                } else {

                    console.log("SJ query works!");
                }
                console.log(result, "result");


                //start doing sth with mapreduce result here:

                for (var i = 0; i < result.length; i++) {
                    var points2 = [];
                    var coordinates = result[i]['value']['b'];

                    for (var j = 0; j < coordinates.length; j++) {
                        points2.push(new google.maps.LatLng(coordinates[j][1], coordinates[j][2]));
                        points2.push(new google.maps.LatLng(coordinates[j][3], coordinates[j][2]));
                        points2.push(new google.maps.LatLng(coordinates[j][3], coordinates[j][0]));
                        points2.push(new google.maps.LatLng(coordinates[j][1], coordinates[j][0]));
                    }

                    var redAreas = new google.maps.Polygon({
                        path: points2,
                        strokeColor: '#00cc00',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillColor: '#00cc00',
                        fillOpacity: 0.35

                    });

                    redAreas.setMap(map);
                }


                map.setCenter({
                    lat: coordinates[0][1],
                    lng: coordinates[0][0]
                });

            }); //end meteor call
        }, //end event


    });


    Template.myGooglemap.onRendered(function() {
        initMap();
    });
    var map;
    var poly;

    initMap = function() {

        var mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(32.347794, -86.795828)
                //center: new google.maps.LatLng(41.62331,-83.241144)

        };
        map = new google.maps.Map(document.getElementById('googleMap'),
            mapOptions);


        poly = new google.maps.Polyline({
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        poly.setMap(map);
        map.data.setStyle({});
        // Add a listener for the click event
        //      map.addListener('click', addLatLng);


    }

} //end isclient


CollectionNamePointQ = new Mongo.Collection('CollectionNamePointQ');
CollectionNameWinQ = new Mongo.Collection('CollectionNameWinQ');
CollectionNameSJQ = new Mongo.Collection('CollectionNameSJQ');

if (Meteor.isServer) {
    Meteor.methods({

        'doMapReducePointQuery': function(x1, y1) {

            var px = parseFloat(x1);
            var py = parseFloat(y1);
            //console.log(x1);
            //console.log(y1);

            var mapFn = function() {

                var key = this._id;
                var value = {
                    id: this._id,
                    type: this.type,
                    name: this.properties.ZCTA5CE10,
                    coords: [
                        [this.geometry.minlon, this.geometry.maxlat],
                        [this.geometry.maxlon, this.geometry.maxlat],
                        [this.geometry.maxlon, this.geometry.minlat],
                        [this.geometry.minlon, this.geometry.minlat]
                    ]
                };

                if (this.geometry.minlon <= px && px <= this.geometry.maxlon && this.geometry.minlat <= py && py <= this.geometry.maxlat) {
                    emit(key, value);
                }
            };

            var reduceFn = function(key, value) {
                var reduceobj = {

                    id: key,
                    type: NULL,
                    name: NULL,
                    coords: NULL
                };
                //console.log("hiiiiii");
                values.forEach(function(value) {
                    reduceobj.type = value.type;
                    reduceobj.name = value.name;
                    reduceobj.coords = value.coords;

                });
                return reduceobj;
            };

            var rawC1DB = Tasks.rawCollection();

            // convert mapReduce to synchronous function
            var syncMapReduce = Meteor.wrapAsync(rawC1DB.mapReduce, rawC1DB);

            // CollectionName will be overwritten after each mapReduce call
            syncMapReduce(mapFn, reduceFn, {
                out: "CollectionNamePointQ",
                scope: {
                    "px": px,
                    "py": py
                }

            });

            return CollectionNamePointQ.find({}).fetch();

        }

    });
    ///////////////////////////Window Query////////////////////////
    Meteor.methods({
        'doMapReduceWindowQuery': function(x1, y1, x2, y2) {

            var p1x = parseFloat(x1);
            var p1y = parseFloat(y1);
            var p2x = parseFloat(x2);
            var p2y = parseFloat(y2);

            console.log(p1x, p1y, p2x, p2y);
            //var p1x = -83.222294;
            // var p1y = 41.538385;
            // var p2x = -83.202862;
            // var p2y = 41.523729;



            var mapFn2 = function() {
                //var p1x=-83.21;minlon
                //var p1y=41.535;minlat
                //var p2x=-83.1;maxlon
                //var p2y=41.7;maxlat

                var key = this._id;
                var value = {

                    type: this.type,
                    name: this.properties.ZCTA5CE10,
                    coords: [
                        [this.geometry.minlon, this.geometry.maxlat],
                        [this.geometry.maxlon, this.geometry.maxlat],
                        [this.geometry.maxlon, this.geometry.minlat],
                        [this.geometry.minlon, this.geometry.minlat]
                    ]
                };

                if (!(this.geometry.minlon > p2x || this.geometry.minlat > p2y ||
                        this.geometry.maxlon < p1x || this.geometry.maxlat < p1y))

                {
                    emit(key, value);
                }
            };


            var reduceFn2 = function(key, value) {
                var reduceobj2 = {
                    id: key,
                    type: NULL,
                    name: NULL,
                    coords: NULL
                };

                values.forEach(function(value) {
                    reduceobj2.type = value.type;
                    reduceobj2.name = value.name;
                    reduceobj2.coords = value.coords;
                });
                return reduceobj2;
            };

            var rawDB2 = Tasks.rawCollection();

            // convert mapReduce to synchronous function
            var syncMapReduce = Meteor.wrapAsync(rawDB2.mapReduce, rawDB2);

            // CollectionName will be overwritten after each mapReduce call
            syncMapReduce(mapFn2, reduceFn2, {
                out: "CollectionNameWinQ",
                scope: {
                    "p1x": p1x,
                    "p1y": p1y,
                    "p2x": p2x,
                    "p2y": p2y
                }

            });

            return CollectionNameWinQ.find({}).fetch();
            //return 2000;
        }


    });

    ///////////////////////////////Spatial Join ///////////////////////////////////

    Meteor.methods({
        'doMapReduceSJQuery': function(msg) {
            console.log(msg)


            var Mapper = function() {
                array = [];
                var key = this.value.GridNum;
                var val = {
                    id: this._id,
                    bbox: this.value.bbox,
                    type: this.value.type
                };
                array.push(val);
                emit(key, {
                    a: array
                });
            };
            console.log("hello samira");



            var Reducer = function(key, values) {
                result = {
                    a: []
                };
                values.forEach(function(v1) {
                    result.a = v1.a.concat(result.a);
                });
                return result;
            };

            var finalizer = function(key, result) {
                final = {
                    b: []
                };
                for (var idx = 0; idx < result.a.length - 1; idx++) {
                    for (var idx2 = idx + 1; idx2 < result.a.length; idx2++) {
                        if (!(result.a[idx2].bbox[0] > result.a[idx].bbox[2] || result.a[idx2].bbox[1] > result.a[idx].bbox[3] ||
                                result.a[idx2].bbox[2] < result.a[idx].bbox[0] ||
                                result.a[idx2].bbox[3] < result.a[idx].bbox[1]) && (result.a[idx].type != result.a[idx2].type))

                        {

                            var connect = {
                                from: [result.a[idx].bbox],
                                to: [result.a[idx2].bbox]
                            }
                            final.b = final.b.concat(connect.from);
                            final.b = final.b.concat(connect.to);
                        };
                    };
                };
                return final;
            };


            var rawDB3 = SpetialJoin.rawCollection();

            // convert mapReduce to synchronous function
            var syncMapReduce = Meteor.wrapAsync(rawDB3.mapReduce, rawDB3);

            // CollectionName will be overwritten after each mapReduce call
            syncMapReduce(Mapper, Reducer, {
                out: "CollectionNameSJQ",
                finalize: finalizer

            });

            return CollectionNameSJQ.find({}).fetch();
            //return 2000;
        }


    });

    Meteor.startup(function() {


    });




}
