
var input="";
function getInput(){
    input = $('#input').val();
    getAPIDataByArtist(input);
}

function getAPIDataByArtist(input){
    var dataArray="";
    var APIKey = "3de2caa5b3b3dc2a07650bbf658738c7";
    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+input +"&api_key="+APIKey+"&format=json";

    var xmlHttp0 = new XMLHttpRequest();   
    xmlHttp0.onreadystatechange = function(){
        if(xmlHttp0.readyState == 4 && xmlHttp0.status == 200){ 
            dataArray = JSON.parse(xmlHttp0.responseText).topalbums.album;
            for(var i=0; i<dataArray.length; i++){
                var albumName = dataArray[i].name;
                var mbid = dataArray[i].mbid;
                console.log(dataArray[i])
            }
        }
    }
    xmlHttp0.open("GET", url ,true);
    xmlHttp0.send();
}
