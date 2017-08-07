var stream = require('fs')
var request = require('request')
var writeIntoFiles = require('./Modules/writeIntoFiles.js')


var downloadableLinks=[]

//goes to the link specified and downloads the needed file to the correct chosen path
function downloadFile(link, downloadPath){
    return new Promise(function(resolve,reject){
        request.get(link)
                .on('error',function(error){
                    console.log("could not download due to this error: " + error)
                })
                .pipe(stream.createWriteStream(downloadPath))
                .on('close', function(){
                    resolve(true)
                })
    })
}

//downloads an array of links to a certain folder
function downloadMultiplefiles(downloadableLinks, downloadfolder){
    var downloadName
    
    for (var i = downloadableLinks.length-1 ; i >= 0; i--){
        downloadName = (downloadfolder + "/" + (i+1) + ".json.gz")
        console.log(downloadName + "             " + i)
        downloadFile(downloadableLinks[i], downloadName).then(console.log("finished  "  + i))
    }
    
}


//reads a txt file line by line
function readTxtLineByLine(inputfile){
    var array = []
    var array2= []
    var readStream = stream.createReadStream(inputfile)
    return new Promise (function (resolve,reject){

            readStream.on("data", function(data){
                 array = data.toString().split("\n");
                 for (var temp in array){
                    array2.push(array[temp])
                 }
            })
            .on('close', function(){
               return resolve (array2)
            })

        })
        
    
}

//call the functions to download the code
readTxtLineByLine('123.txt' ).then(function(response){
    var array = response

        downloadMultiplefiles(array, "./downloads")
}
    
);