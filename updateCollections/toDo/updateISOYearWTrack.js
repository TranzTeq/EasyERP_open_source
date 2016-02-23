var mongoose = require('mongoose');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
var dbObject;
require('../../models/index.js');

dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var query;
    var wTrackSchema;
    var wTrack;

    console.log("Connection to weTrack is success");

    wTrackSchema = mongoose.Schemas.wTrack;
    wTrack = dbObject.model("wTrack", wTrackSchema);

    query = wTrack.find({$or:[{month:12, week:1},{month:1, week: 53}]});

    query.exec(function (error, res) {
        if (error) {
            return console.dir(error);
        }
        var isoYear;

        res.forEach(function(wt){
            isoYear = isoWeekYearComposer(wt);
            wTrack.findByIdAndUpdate(wt._id, {$set: {'isoYear': isoYear}}, function(err, response){
                if (err){
                    console.log(err);
                }

                console.log(response);
            });
        });
    });

});

