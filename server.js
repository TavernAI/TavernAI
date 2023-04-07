var express = require('express');
var app = express();
var fs = require('fs');
const readline = require('readline');
const open = require('open');

var rimraf = require("rimraf");
const multer  = require("multer");
const https = require('https');
const http = require('http');
//const PNG = require('pngjs').PNG;
const extract = require('png-chunks-extract');
const encode = require('png-chunks-encode');
const PNGtext = require('png-chunk-text');
const ExifReader = require('exifreader');

const sharp = require('sharp');
sharp.cache(false);
const path = require('path');

const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const ipaddr = require('ipaddr.js');
const json5 = require('json5');
var sanitize_filename = require("sanitize-filename");


const config = require(path.join(process.cwd(), './config.conf'));
const server_port = config.port;
const whitelist = config.whitelist;
const whitelistMode = config.whitelistMode;
let listenIp = config.listenIp || '127.0.0.1';

if(!whitelistMode || whitelist.length > 1){
    listenIp = '0.0.0.0';
}
const autorun = config.autorun;
const characterFormat = config.characterFormat;
const charaCloudMode = config.charaCloudMode;
const charaCloudServer = config.charaCloudServer;
const connectionTimeoutMS = config.connectionTimeoutMS;


var Client = require('node-rest-client').Client;
var client = new Client();





var api_server = "";//"http://127.0.0.1:5000";
//var server_port = 8000;

const api_novelai = "https://api.novelai.net";
const api_openai = "https://api.openai.com/v1";
var response_get_story;
var response_generate;
var response_generate_novel;
var response_generate_openai;
var request_promt;
var response_promt;
var response_characloud_loadcard;
var response_characloud_getallcharacters;
var characters = {};
var character_i = 0;
var response_create;
var response_edit;
var response_dw_bg;
var response_getstatus;
var response_getstatus_novel;
var response_getstatus_openai;
var response_getlastversion;
var api_key_novel;
var api_key_openai;

var is_colab = false;
var charactersPath = 'public/characters/';
var chatsPath = 'public/chats/';
if (is_colab && process.env.googledrive == 2){
    charactersPath = '/content/drive/MyDrive/TavernAI/characters/';
    chatsPath = '/content/drive/MyDrive/TavernAI/chats/';
}
const jsonParser = express.json({limit: '100mb'});
const urlencodedParser = express.urlencoded({extended: true, limit: '100mb'});

// CSRF Protection //
const doubleCsrf = require('csrf-csrf').doubleCsrf;

const CSRF_SECRET = crypto.randomBytes(8).toString('hex');
const COOKIES_SECRET = crypto.randomBytes(8).toString('hex');

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } = doubleCsrf({
	getSecret: () => CSRF_SECRET,
	cookieName: "X-CSRF-Token",
	cookieOptions: {
		httpOnly: true,
		sameSite: "strict",
		secure: false
	},
	size: 64,
	getTokenFromRequest: (req) => req.headers["x-csrf-token"]
});

app.get("/csrf-token", (req, res) => {
    res.json({
        "token": generateToken(res)
    });
});

app.get("/timeout", (req, res) => {
    res.json({
        "timeout": connectionTimeoutMS
    });
});

app.use(cookieParser(COOKIES_SECRET));
app.use(doubleCsrfProtection);

// CORS Settings //
const cors = require('cors');
const CORS = cors({
	origin: 'null',
	methods: ['OPTIONS']
});

app.use(CORS);

app.use(function (req, res, next) { //Security
    let clientIp = req.connection.remoteAddress;
    let ip = ipaddr.parse(clientIp);
    // Check if the IP address is IPv4-mapped IPv6 address
    if (ip.kind() === 'ipv6' && ip.isIPv4MappedAddress()) {
      const ipv4 = ip.toIPv4Address().toString();
      clientIp = ipv4;
    } else {
      clientIp = ip;
      clientIp = clientIp.toString();
    }
    
     //clientIp = req.connection.remoteAddress.split(':').pop();
    if (whitelistMode === true && !whitelist.includes(clientIp)) {
        console.log('Forbidden: Connection attempt from '+ clientIp+'. If you are attempting to connect, please add your IP address in whitelist or disable whitelist mode in config.conf in root of TavernAI folder.\n');
        return res.status(403).send('<b>Forbidden</b>: Connection attempt from <b>'+ clientIp+'</b>. If you are attempting to connect, please add your IP address in whitelist or disable whitelist mode in config.conf in root of TavernAI folder.');
    }
    next();
});

app.use((req, res, next) => {
  if (req.url.startsWith('/characters/') && is_colab && process.env.googledrive == 2) {
      
    const filePath = path.join(charactersPath, decodeURIComponent(req.url.substr('/characters'.length)));
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (!err) {
        res.sendFile(filePath);
      } else {
        res.send('Character not found: '+filePath);
        //next();
      }
    });
  } else {
    next();
  }
});
app.use(express.static(__dirname + "/public", { refresh: true }));




app.use('/backgrounds', (req, res) => {
  const filePath = decodeURIComponent(path.join(process.cwd(), 'public/backgrounds', req.url.replace(/%20/g, ' ')));
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }
    //res.contentType('image/jpeg');
    res.send(data);
  });
});
app.use('/characters', (req, res) => {
    let filePath = decodeURIComponent(path.join(process.cwd(), charactersPath, req.url.replace(/%20/g, ' ')));
    filePath = filePath.split('?v=');
    filePath = filePath[0];
    fs.readFile(filePath, (err, data) => {
    if (err) {
        res.status(404).send('File not found');
        return;
    }
    //res.contentType('image/jpeg');
    res.send(data);
  });
});
app.use(multer({dest:"uploads"}).single("avatar"));
app.get("/", function(request, response){
    response.sendFile(__dirname + "/public/index.html"); 
    //response.send("<h1>Главная страница</h1>");
});
app.get("/notes/*", function(request, response){
    response.sendFile(__dirname + "/public"+request.url+".html"); 
    //response.send("<h1>Главная страница</h1>");
});
app.post("/getlastversion", jsonParser, function(request, response_getlastversion = response){
    if(!request.body) return response_getlastversion.sendStatus(400);
    
    const repo = 'TavernAI/TavernAI';
    let req;
    req = https.request({
        hostname: 'github.com',
        path: `/${repo}/releases/latest`,
        method: 'HEAD'
    }, (res) => {
        if(res.statusCode === 302) {
            const glocation = res.headers.location;
            const versionStartIndex = glocation.lastIndexOf('@')+1;
            const version = glocation.substring(versionStartIndex);
            //console.log(version);
            response_getlastversion.send({version: version});
        }else{
            response_getlastversion.send({version: 'error'});
        }
    });
    
    req.on('error', (error) => {
        console.error(error);
        response_getlastversion.send({version: 'error'});
    });

    req.end();
        
});
//**************Kobold api
app.post("/generate", jsonParser, function(request, response_generate = response){
    if(!request.body) return response_generate.sendStatus(400);
    //console.log(request.body.prompt);
    //const dataJson = json5.parse(request.body);
    request_promt = request.body.prompt;
    
    //console.log(request.body);
    var this_settings = { prompt: request_promt,
                        use_story:false,
                        use_memory:false,
                        use_authors_note:false,
                        use_world_info:false,
                        max_context_length: request.body.max_context_length
                        //temperature: request.body.temperature,
                        //max_length: request.body.max_length
                        };
    if(request.body.singleline) {
        this_settings.singleline = true
    }
                        
    if(request.body.gui_settings == false){
        var sampler_order = [request.body.s1,request.body.s2,request.body.s3,request.body.s4,request.body.s5,request.body.s6,request.body.s7];
        this_settings = { prompt: request_promt,
                        use_story:false,
                        use_memory:false,
                        use_authors_note:false,
                        use_world_info:false,
                        max_context_length: request.body.max_context_length,
                        max_length: request.body.max_length,
                        rep_pen: request.body.rep_pen,
                        rep_pen_range: request.body.rep_pen_range,
                        rep_pen_slope: request.body.rep_pen_slope,
                        temperature: request.body.temperature,
                        tfs: request.body.tfs,
                        top_a: request.body.top_a,
                        top_k: request.body.top_k,
                        top_p: request.body.top_p,
                        typical: request.body.typical,
                        sampler_order: sampler_order
                        };
        if(request.body.singleline) {
            this_settings.singleline = true
        }
    }

    console.log(this_settings);
    var args = {
        data: this_settings,
        headers: { "Content-Type": "application/json" },
        requestConfig: {
            timeout: connectionTimeoutMS
        }
    };
    client.post(api_server+"/v1/generate",args, function (data, response) {
        if(response.statusCode == 200){
            console.log(data);
            response_generate.send(data);
        }
        if(response.statusCode == 422){
            console.log('Validation error');
            response_generate.send({error: true});
        }
        if(response.statusCode == 501 || response.statusCode == 503 || response.statusCode == 507){
            console.log(data);
            response_generate.send({error: true});
        }
    }).on('error', function (err) {
        console.log(err);
	//console.log('something went wrong on the request', err.request.options);
        response_generate.send({error: true});
    });
});
app.post("/savechat", jsonParser, function(request, response){
    //console.log(request.data);
    //console.log(request.body.bg);
     //const data = request.body;
    //console.log(request);
    //console.log(request.body.chat);
    //var bg = "body {background-image: linear-gradient(rgba(19,21,44,0.75), rgba(19,21,44,0.75)), url(../backgrounds/"+request.body.bg+");}";
    var dir_name = String(request.body.avatar_url).replace(`.${characterFormat}`,'');
    let chat_data = request.body.chat;
    let jsonlData = chat_data.map(JSON.stringify).join('\n');
    fs.writeFile(chatsPath+dir_name+"/"+request.body.file_name+'.jsonl', jsonlData, 'utf8', function(err) {
        if(err) {
            response.send(err);
            return console.log(err);
            //response.send(err);
        }else{
            //response.redirect("/");
            response.send({result: "ok"});
        }
    });
    
});
app.post("/getchat", jsonParser, function(request, response){
    //console.log(request.data);
    //console.log(request.body.bg);
     //const data = request.body;
    //console.log(request);
    //console.log(request.body.chat);
    //var bg = "body {background-image: linear-gradient(rgba(19,21,44,0.75), rgba(19,21,44,0.75)), url(../backgrounds/"+request.body.bg+");}";
    var dir_name = String(request.body.avatar_url).replace(`.${characterFormat}`,'');

    fs.stat(chatsPath+dir_name, function(err, stat) {
            
        if(stat === undefined){

            fs.mkdirSync(chatsPath+dir_name);
            response.send({});
            return;
        }else{
            
            if(err === null){
                
                fs.stat(chatsPath+dir_name+"/"+request.body.file_name+".jsonl", function(err, stat) {
                    
                    if (err === null) {
                        
                        if(stat !== undefined){
                            fs.readFile(chatsPath+dir_name+"/"+request.body.file_name+".jsonl", 'utf8', (err, data) => {
                                if (err) {
                                  console.error(err);
                                  response.send(err);
                                  return;
                                }
                                //console.log(data);
                                const lines = data.split('\n');

                                // Iterate through the array of strings and parse each line as JSON
                                const jsonData = lines.map(json5.parse);
                                response.send(jsonData);


                            });
                        }
                    }else{
                        response.send({});
                        //return console.log(err);
                        return;
                    }
                });
            }else{
                console.error(err);
                response.send({});
                return;
            }
        }
        

    });

    
});
app.post("/getstatus", jsonParser, function(request, response_getstatus = response){
    if(!request.body) return response_getstatus.sendStatus(400);
    api_server = request.body.api_server;
    if(api_server.indexOf('localhost') != -1){
        api_server = api_server.replace('localhost','127.0.0.1');
    }
    var args = {
        headers: { "Content-Type": "application/json" }
    };
    client.get(api_server+"/v1/model",args, function (data, response) {
        if(response.statusCode == 200){
            if(data.result != "ReadOnly"){
                
                //response_getstatus.send(data.result);
            }else{
                data.result = "no_connection";
            }
        }else{
            data.result = "no_connection";
        }
        response_getstatus.send(data);
        //console.log(response.statusCode);
        //console.log(data);
        //response_getstatus.send(data);
        //data.results[0].text
    }).on('error', function (err) {
        //console.log('');
	//console.log('something went wrong on the request', err.request.options);
        response_getstatus.send({result: "no_connection"});
    });
});
function checkServer(){
    //console.log('Check run###################################################');
    api_server = 'http://127.0.0.1:5000';
    var args = {
        headers: { "Content-Type": "application/json" }
    };
    client.get(api_server+"/v1/model",args, function (data, response) {
        console.log(data.result);
        //console.log('###################################################');
        console.log(data);
    }).on('error', function (err) {
        console.log(err);
        //console.log('');
	//console.log('something went wrong on the request', err.request.options);
        //console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    });
}

//***************** Main functions
function checkCharaProp(prop) {
  return (String(prop) || '')
      .replace(/[\u2018\u2019‘’]/g, "'")
      .replace(/[\u201C\u201D“”]/g, '"');
}
function charaFormatData(data){
    let name;
    if(data.ch_name === undefined){
        name = data.name;
    }else{
        name = data.ch_name;
    }
    name = checkCharaProp(name);
    if(name.length === 0){
        name = 'null';
    }
    var char = {"public_id": checkCharaProp(data.public_id), "name": name, "description": checkCharaProp(data.description), "personality": checkCharaProp(data.personality), "first_mes": checkCharaProp(data.first_mes), "avatar": 'none', "chat": Date.now(), "mes_example": checkCharaProp(data.mes_example), "scenario": checkCharaProp(data.scenario), "edit_date": Date.now(), "create_date": Date.now(), "add_date": Date.now()};
    return char;
}
app.post("/createcharacter", urlencodedParser, function(request, response){
    
    if(!request.body) return response.sendStatus(400);
    if (!fs.existsSync(charactersPath+request.body.ch_name+`.${characterFormat}`)){
        if(!fs.existsSync(chatsPath+request.body.ch_name) )fs.mkdirSync(chatsPath+request.body.ch_name);

        let filedata = request.file;
        //console.log(filedata.mimetype);
        var fileType = ".png";
        var img_file = "ai";
        var img_path = "public/img/";
        
        var char = charaFormatData(request.body);//{"name": request.body.ch_name, "description": request.body.description, "personality": request.body.personality, "first_mes": request.body.first_mes, "avatar": 'none', "chat": Date.now(), "last_mes": '', "mes_example": ''};
        char = JSON.stringify(char);
        if(!filedata){
            
            charaWrite('./public/img/fluffy.png', char, request.body.ch_name, characterFormat, response);
            
        }else{
            
            img_path = "./uploads/";
            img_file = filedata.filename
            if (filedata.mimetype == "image/jpeg") fileType = ".jpeg";
            if (filedata.mimetype == "image/png") fileType = ".png";
            if (filedata.mimetype == "image/gif") fileType = ".gif";
            if (filedata.mimetype == "image/bmp") fileType = ".bmp";
            if (filedata.mimetype == "image/webp") fileType = ".webp";
            charaWrite(img_path+img_file, char, request.body.ch_name, characterFormat, response);
        }
        //console.log("The file was saved.");

    }else{
        response.send("Error: A character with that name already exists.");
    }
    //console.log(request.body);
    //response.send(request.body.ch_name);

    //response.redirect("https://metanit.com")
});


app.post("/editcharacter", urlencodedParser, function(request, response){
    if(!request.body) return response.sendStatus(400);
    let filedata = request.file;
    //console.log(filedata.mimetype);
    var fileType = ".png";
    var img_file = "ai";
    var img_path = charactersPath;
    
    var char = charaFormatData(request.body);//{"name": request.body.ch_name, "description": request.body.description, "personality": request.body.personality, "first_mes": request.body.first_mes, "avatar": request.body.avatar_url, "chat": request.body.chat, "last_mes": request.body.last_mes, "mes_example": ''};
    char.chat = request.body.chat;
    char.create_date = request.body.create_date;
    if(request.body.add_date != undefined){
        char.add_date = request.body.add_date;
    }else{
        char.add_date = request.body.create_date;
    }
    char.edit_date = Date.now();

    char = JSON.stringify(char);
    let target_img = (request.body.avatar_url).replace(`.${characterFormat}`, '');
    if(!filedata){

        charaWrite(img_path+request.body.avatar_url, char, target_img, characterFormat, response, 'Character saved');
    }else{
        //console.log(filedata.filename);
        img_path = "uploads/";
        img_file = filedata.filename;

        charaWrite(img_path+img_file, char, target_img, characterFormat, response, 'Character saved');
        //response.send('Character saved');
    }
});
app.post("/deletecharacter", urlencodedParser, function(request, response){
    if(!request.body) return response.sendStatus(400);
    rimraf(charactersPath+request.body.avatar_url, (err) => { 
        if(err) {
            response.send(err);
            return console.log(err);
        }else{
            //response.redirect("/");
            let dir_name = request.body.avatar_url;
            rimraf(chatsPath+dir_name.replace(`.${characterFormat}`,''), (err) => { 
                if(err) {
                    response.send(err);
                    return console.log(err);
                }else{
                    //response.redirect("/");

                    response.send('ok');
                }
            });
        }
    });
});
/*
async function charaWrite(source_img, data, target_img, format = 'webp', response = undefined, mes = 'ok'){
    try {
        // Load the image in any format
        sharp.cache(false);
        target_img = sanitize_filename(target_img);
        switch(format){
            case 'webp':
                return new Promise((resolve, reject) => {
                    var image = sharp(source_img);
                    let webp_parameters = {'quality':80, lossless: true, near_lossless:false, smartSubsample: true, effort: 6};
                    if(source_img.indexOf('.png') !== -1){
                        webp_parameters = {};
                    }
                    image.webp(webp_parameters).withMetadata({
                        exif: {
                            IFD0: {
                                UserComment: data
                            }
                        }
                    }).toBuffer((err, buffer) => {
                        if (err) { 
                            console.log(err);
                            reject(err);
                        } else {
                            fs.writeFile(charactersPath+target_img+'.webp', buffer, (err) => {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    if (response !== undefined) response.send(mes);
                                    resolve({});
                                }
                            });
                        }
                    });
                });

                
            case 'png':
                
                var image = await sharp(source_img).resize(400, 600).toFormat('png').toBuffer();// old 170 234
                // Convert the image to PNG format
                //const pngImage = image.toFormat('png');

                // Resize the image to 100x100
                //const resizedImage = pngImage.resize(100, 100);

                // Get the chunks
                var chunks = extract(image);
                 var tEXtChunks = chunks.filter(chunk => chunk.create_date === 'tEXt');

                // Remove all existing tEXt chunks
                for (var tEXtChunk of tEXtChunks) {
                    chunks.splice(chunks.indexOf(tEXtChunk), 1);
                }
                // Add new chunks before the IEND chunk
                var base64EncodedData = Buffer.from(data, 'utf8').toString('base64');
                chunks.splice(-1, 0, PNGtext.encode('chara', base64EncodedData));
                //chunks.splice(-1, 0, text.encode('lorem', 'ipsum'));

                fs.writeFileSync(charactersPath+target_img+'.png', new Buffer.from(encode(chunks)));
                if(response !== undefined) response.send(mes);
                break;
            default:
                break;
                
        }   

    } catch (err) {
        console.log(err);
        if(response !== undefined) response.send(err);
    }
}
async function processImage(imagePath) {
  for (let i = 0; i < 50; i++) {
    const processedImagePath = imagePath;
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      let qwer = crypto.randomBytes(400).toString('hex');
      console.log(qwer);
      const processedImage = await sharp(imageBuffer).withMetadata({
                        exif: {
                            IFD0: {
                                UserComment: qwer
                            }
                        }
                    }).toBuffer();
      fs.writeFileSync(processedImagePath, processedImage);
      console.log(`Iteration ${i}: Success`);
    } catch (err) {
      console.log(`Iteration ${i}: Error: ${err}`);
    }
  }
}

const imagePath = 'image.webp';
processImage(imagePath);
      */
     /*
    async function processImage(imagePath, target_img, data, resolve, reject) {
    const processedImagePath = imagePath;
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const processedImage = await sharp(imageBuffer).withMetadata({
                        exif: {
                            IFD0: {
                                UserComment: data
                            }
                        }
                    }).toBuffer();
      fs.writeFileSync(charactersPath+target_img+'.webp', processedImage);//processedImagePath, processedImage);
      resolve({});
    } catch (err) {
      console.log(err);
            reject(err);
    }
}
*/
async function charaWrite(source_img, data, target_img, format = 'webp', response = undefined, mes = 'ok'){
    try {
        // Load the image in any format
        sharp.cache(false);
        target_img = sanitize_filename(target_img);
        switch(format){
            case 'webp':
                return new Promise(async (resolve, reject) => {

                    //let webp_parameters = {'quality':80, lossless: true, near_lossless:false, smartSubsample: true, effort: 6};
                    try {
                      const imageBuffer = fs.readFileSync(source_img);
                      const processedImage = await sharp(imageBuffer).resize(400, 600).webp({'quality':95}).withMetadata({
                                        exif: {
                                            IFD0: {
                                                UserComment: data
                                            }
                                        }
                                    }).toBuffer();
                      fs.writeFileSync(charactersPath+target_img+'.webp', processedImage);
                      resolve({});
                      if (response !== undefined) response.send(mes);
                    } catch (err) {
                      console.log(err);
                            reject(err);
                    }
                });

                
            case 'png':
                
                var image = await sharp(source_img).resize(400, 600).toFormat('png').toBuffer();// old 170 234
                // Convert the image to PNG format
                //const pngImage = image.toFormat('png');

                // Resize the image to 100x100
                //const resizedImage = pngImage.resize(100, 100);

                // Get the chunks
                var chunks = extract(image);
                 var tEXtChunks = chunks.filter(chunk => chunk.create_date === 'tEXt');

                // Remove all existing tEXt chunks
                for (var tEXtChunk of tEXtChunks) {
                    chunks.splice(chunks.indexOf(tEXtChunk), 1);
                }
                // Add new chunks before the IEND chunk
                var base64EncodedData = Buffer.from(data, 'utf8').toString('base64');
                chunks.splice(-1, 0, PNGtext.encode('chara', base64EncodedData));
                //chunks.splice(-1, 0, text.encode('lorem', 'ipsum'));

                fs.writeFileSync(charactersPath+target_img+'.png', new Buffer.from(encode(chunks)));
                if(response !== undefined) response.send(mes);
                break;
            default:
                break;
                
        }   

    } catch (err) {
        console.log(err);
        if(response !== undefined) response.send(err);
    }
}


async function charaRead(img_url, input_format){
    let format;
    sharp.cache(false);
    if(input_format === undefined){
        if(img_url.indexOf('.webp') !== -1){
            format = 'webp';
        }else{
            format = 'png';
        }
    }else{
        format = input_format;
    }
    
    switch(format){
        case 'webp':
            const exif_data = await ExifReader.load(fs.readFileSync(img_url));
            const char_data = exif_data['UserComment']['description'];
            if (char_data === 'Undefined' && exif_data['UserComment'].value && exif_data['UserComment'].value.length === 1) {
                return exif_data['UserComment'].value[0];
            }
            return char_data;
        case 'png':
            const buffer = fs.readFileSync(img_url);
            const chunks = extract(buffer);
             
            const textChunks = chunks.filter(function (chunk) {
              return chunk.name === 'tEXt';
            }).map(function (chunk) {
                //console.log(text.decode(chunk.data));
              return PNGtext.decode(chunk.data);
            });
            var base64DecodedData = Buffer.from(textChunks[0].text, 'base64').toString('utf8');
            return base64DecodedData;//textChunks[0].text;
            //console.log(textChunks[0].keyword); // 'hello'
            //console.log(textChunks[0].text);    // 'world'
        default:
            break;
    }                   

}

app.post("/getcharacters", jsonParser, async function(request, response) {
  try {
    const files = await fs.promises.readdir(charactersPath);
    const imgFiles = files.filter(file => file.endsWith(`.${characterFormat}`));
    const characters = {};
    let i = 0;

    for (const item of imgFiles) {
      const imgData = await charaRead(charactersPath + item);
      let jsonObject;

      try {
        
        jsonObject = json5.parse(imgData);
        jsonObject.avatar = item;
        characters[i] = jsonObject;
        i++;
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error("Character info from index " +i+ " is not valid JSON!", error);
        } else {
          console.error("An unexpected error loading character index " +i+ " occurred.", error);
        }
        console.error("Pre-parsed character data:");
        console.error(imgData);
      }
    }

    response.send(JSON.stringify(characters));
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});
app.post("/getbackgrounds", jsonParser, function(request, response){
    var images = getImages("public/backgrounds");
    if(is_colab === true){
        images = ['tavern.png'];
    }
    response.send(JSON.stringify(images));
    
});
app.post("/iscolab", jsonParser, function(request, response){
    let send_data = false;
    if(process.env.colaburl !== undefined){
        send_data = String(process.env.colaburl).trim();
    }
    response.send({colaburl:send_data});
    
});
app.post("/getuseravatars", jsonParser, function(request, response){
    var images = getImages("public/User Avatars");
    response.send(JSON.stringify(images));
    
});
app.post("/setbackground", jsonParser, function(request, response){
    //console.log(request.data);
    //console.log(request.body.bg);
     //const data = request.body;
    //console.log(request);
    //console.log(1);
    let bg;
    if(request.body.bg == 'none'){
        bg = "#bg1 {display: none;}";
    }else{
        bg = "#bg1 {background-image: "+request.body.bg+";}";
    }
    fs.writeFile('public/css/bg_load.css', bg, 'utf8', function(err) {
        if(err) {
            response.send(err);
            return console.log(err);
        }else{
            //response.redirect("/");
            response.send({result:'ok'});
        }
    });
    
});
app.post("/delbackground", jsonParser, function(request, response){
    if(!request.body) return response.sendStatus(400);
    rimraf('public/backgrounds/'+request.body.bg, (err) => { 
        if(err) {
            response.send(err);
            return console.log(err);
        }else{
            //response.redirect("/");
            response.send('ok');
        }
    });
    
});
app.post("/downloadbackground", urlencodedParser, function(request, response){
    response_dw_bg = response;
    if(!request.body) return response.sendStatus(400);

    let filedata = request.file;
    //console.log(filedata.mimetype);
    var fileType = ".png";
    var img_file = "ai";
    var img_path = "public/img/";

    img_path = "uploads/";
    img_file = filedata.filename;
    if (filedata.mimetype == "image/jpeg") fileType = ".jpeg";
    if (filedata.mimetype == "image/png") fileType = ".png";
    if (filedata.mimetype == "image/gif") fileType = ".gif";
    if (filedata.mimetype == "image/bmp") fileType = ".bmp";
    if (filedata.mimetype == "image/webp") fileType = ".webp";
    fs.copyFile(img_path+img_file, 'public/backgrounds/'+img_file+fileType, (err) => {
        if(err) {
            
            return console.log(err);
        }else{
            //console.log(img_file+fileType);
            response_dw_bg.send(img_file+fileType);
        }
        //console.log('The image was copied from temp directory.');
    });


});

app.post("/savesettings", jsonParser, function(request, response){


    fs.writeFile('public/settings.json', JSON.stringify(request.body), 'utf8', function(err) {
        if(err) {
            response.send(err);
            return console.log(err);
            //response.send(err);
        }else{
            //response.redirect("/");
            response.send({result: "ok"});
        }
    });
    
});
app.post('/getsettings', jsonParser, (request, response) => { //Wintermute's code
    const koboldai_settings = [];
    const koboldai_setting_names = [];
    const novelai_settings = [];
    const novelai_setting_names = [];
    const settings = fs.readFileSync('public/settings.json', 'utf8',  (err, data) => {
    if (err) return response.sendStatus(500);

        return data;
    });
  //Kobold
    const files = fs
    .readdirSync('public/KoboldAI Settings')
    .sort(
      (a, b) =>
        new Date(fs.statSync(`public/KoboldAI Settings/${b}`).mtime) -
        new Date(fs.statSync(`public/KoboldAI Settings/${a}`).mtime)
    );

    files.forEach(item => {
        const file = fs.readFileSync(
        `public/KoboldAI Settings/${item}`,
        'utf8',
            (err, data) => {
                if (err) return response.sendStatus(500)

                return data;
            }
        );
        koboldai_settings.push(file);
        koboldai_setting_names.push(item.replace(/\.[^/.]+$/, ''));
    });
    
  //Novel
    const files2 = fs
    .readdirSync('public/NovelAI Settings')
    .sort(
      (a, b) =>
        new Date(fs.statSync(`public/NovelAI Settings/${b}`).mtime) -
        new Date(fs.statSync(`public/NovelAI Settings/${a}`).mtime)
    );
    
    files2.forEach(item => {
    const file2 = fs.readFileSync(
        `public/NovelAI Settings/${item}`,
        'utf8',
        (err, data) => {
            if (err) return response.sendStatus(500);

            return data;
        }
    );

        novelai_settings.push(file2);
        novelai_setting_names.push(item.replace(/\.[^/.]+$/, ''));
    });
    
    //Styles
    const designs = fs.readdirSync('public/designs')
        .filter(file => file.endsWith('.css'))
        .sort();
    
    response.send({
        charaCloudMode: charaCloudMode,
        charaCloudServer: charaCloudServer,
        characterFormat: characterFormat,
        settings,
        designs,
        koboldai_settings,
        koboldai_setting_names,
        novelai_settings,
        novelai_setting_names
    });
});

app.post("/savestyle", jsonParser, function(request, response){
    const this_style = request.body.style;
    let file_data = '@import "../designs/classic.css";';
    if(this_style != 'classic.css'){
        file_data = '@import "../designs/classic.css";@import "../designs/'+this_style+'";';
    }

    fs.writeFile('public/css/designs.css', file_data, 'utf8', function(err) {
        if(err) {
            response.send(err);
            return console.log(err);
            //response.send(err);
        }else{
            //response.redirect("/");
            response.send({result: "ok"});
        }
    });
    
});

function getCharaterFile(directories,response,i){ //old need del
    if(directories.length > i){
        
        fs.stat(charactersPath+directories[i]+'/'+directories[i]+".json", function(err, stat) {
            if (err == null) {
                fs.readFile(charactersPath+directories[i]+'/'+directories[i]+".json", 'utf8', (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    //console.log(data);

                    characters[character_i] = {};
                    characters[character_i] = data;
                    i++;
                    character_i++;
                    getCharaterFile(directories,response,i);
                });
            }else{
                i++;
                getCharaterFile(directories,response,i);
            }
        });
        
    }else{
        response.send(JSON.stringify(characters));
    }
}
function getImages(path) {
    return fs.readdirSync(path).sort(function (a, b) {
return new Date(fs.statSync(path + '/' + a).mtime) - new Date(fs.statSync(path + '/' + b).mtime);
}).reverse();
}
function getKoboldSettingFiles(path) {
    return fs.readdirSync(path).sort(function (a, b) {
return new Date(fs.statSync(path + '/' + a).mtime) - new Date(fs.statSync(path + '/' + b).mtime);
}).reverse();
}
function getDirectories(path) {
  return fs.readdirSync(path).sort(function (a, b) {
return new Date(fs.statSync(path + '/' + a).mtime) - new Date(fs.statSync(path + '/' + b).mtime);
}).reverse();
}

//***********Novel.ai API 

app.post("/getstatus_novelai", jsonParser, function(request, response_getstatus_novel =response){
    
    if(!request.body) return response_getstatus_novel.sendStatus(400);
    api_key_novel = request.body.key;
    var data = {};
    var args = {
        data: data,
        
        headers: { "Content-Type": "application/json",  "Authorization": "Bearer "+api_key_novel}
    };
    client.get(api_novelai+"/user/subscription",args, function (data, response) {
        if(response.statusCode == 200){
            //console.log(data);
            response_getstatus_novel.send(data);//data);
        }
        if(response.statusCode == 401){
            console.log('Access Token is incorrect.');
            response_getstatus_novel.send({error: true});
        }
        if(response.statusCode == 500 || response.statusCode == 501 || response.statusCode == 501 || response.statusCode == 503 || response.statusCode == 507){
            console.log(data);
            response_getstatus_novel.send({error: true});
        }
    }).on('error', function (err) {
        //console.log('');
	//console.log('something went wrong on the request', err.request.options);
        response_getstatus_novel.send({error: true});
    });
});



app.post("/generate_novelai", jsonParser, function(request, response_generate_novel = response){
    if(!request.body) return response_generate_novel.sendStatus(400);

    console.log(request.body);
    var data = {
    "input": request.body.input,
    "model": request.body.model,
    "parameters": {
                "use_string": request.body.use_string,
		"temperature": request.body.temperature,
		"max_length": request.body.max_length,
		"min_length": request.body.min_length,
                "top_a": request.body.top_a,
                "top_k": request.body.top_k,
                "top_p": request.body.top_p,
                "typical_p": request.body.typical_p,
		"tail_free_sampling": request.body.tail_free_sampling,
		"repetition_penalty": request.body.repetition_penalty,
		"repetition_penalty_range": request.body.repetition_penalty_range,
                "repetition_penalty_slope": request.body.repetition_penalty_slope,
		"repetition_penalty_frequency": request.body.repetition_penalty_frequency,
		"repetition_penalty_presence": request.body.repetition_penalty_presence,
		//"stop_sequences": {{187}},
		//bad_words_ids = {{50256}, {0}, {1}};
		//generate_until_sentence = true;
		"use_cache": request.body.use_cache,
		//use_string = true;
		"return_full_text": request.body.return_full_text,
		"prefix": request.body.prefix,
		"order": request.body.order
                }
    };
                        
    var args = {
        data: data,
        headers: { "Content-Type": "application/json",  "Authorization": "Bearer "+api_key_novel},
        requestConfig: {
            timeout: connectionTimeoutMS
        }
    };
    client.post(api_novelai+"/ai/generate",args, function (data, response) {
        if(response.statusCode == 201){
            console.log(data);
            response_generate_novel.send(data);
        }
        if(response.statusCode == 400){
            console.log('Validation error');
            response_generate_novel.send({error: true});
        }
        if(response.statusCode == 401){
            console.log('Access Token is incorrect');
            response_generate_novel.send({error: true});
        }
        if(response.statusCode == 402){
            console.log('An active subscription is required to access this endpoint');
            response_generate_novel.send({error: true});
        }
        if(response.statusCode == 500 || response.statusCode == 409){
            console.log(data);
            response_generate_novel.send({error: true});
        }
    }).on('error', function (err) {
        //console.log('');
	//console.log('something went wrong on the request', err.request.options);
        response_generate_novel.send({error: true});
    });
});
//***********Open.ai API 

app.post("/getstatus_openai", jsonParser, function(request, response_getstatus_openai = response){
    if(!request.body) return response_getstatus_openai.sendStatus(400);
    api_key_openai = request.body.key;
    var args = {
        headers: { "Authorization": "Bearer "+api_key_openai}
    };
    client.get(api_openai+"/engines/text-davinci-003", args, function (data, response) {
        if(response.statusCode == 200){
            response_getstatus_openai.send(data);
        }
        if(response.statusCode == 401){
            console.log('Invalid Authentication');
            response_getstatus_openai.send({error: true});
        }
        if(response.statusCode == 429){
            console.log('Rate limit reached for requests');
            response_getstatus_openai.send({error: true});
        }
        if(response.statusCode == 500){
            console.log('The server had an error while processing your request');
            response_getstatus_openai.send({error: true});
        }
    }).on('error', function (err) {
        //console.log('');
	//console.log('something went wrong on the request', err.request.options);
        response_getstatus_openai.send({error: true});
    });
});



app.post("/generate_openai", jsonParser, function(request, response_generate_openai){
    if(!request.body) return response_generate_openai.sendStatus(400);
    console.log(request.body);
    
    var data = {
        "model": request.body.model,
        "max_tokens": request.body.max_tokens,
        "temperature": request.body.temperature,
        "top_p": request.body.top_p,
        "presence_penalty": request.body.presence_penalty,
        "frequency_penalty": request.body.frequency_penalty,
        "stop": request.body.stop
    };
    let request_path = '';
    if(request.body.model === 'gpt-3.5-turbo' || request.body.model === 'gpt-3.5-turbo-0301' || request.body.model === 'gpt-4' || request.body.model === 'gpt-4-32k'){
        request_path = '/chat/completions';
        data.messages = request.body.messages;
        
    }else{
        request_path = '/completions';
        data.prompt = request.body.prompt;

    }
    var args = {
        data: data,
        headers: { "Content-Type": "application/json",  "Authorization": "Bearer "+api_key_openai},
        requestConfig: {
            timeout: connectionTimeoutMS
        }
    };
    
    client.post(api_openai+request_path,args, function (data, response) {
        try {
            if(request.body.model === 'gpt-3.5-turbo' || request.body.model === 'gpt-3.5-turbo-0301'){
                console.log(data);
                if(data.choices[0].message !== undefined){
                    console.log(data.choices[0].message);
                }


            }else{
                console.log(data);
            }
            console.log(response.statusCode);
            if(response.statusCode <= 299){
                response_generate_openai.send(data);
            }
            if(response.statusCode == 401){
                console.log('Invalid Authentication');
                response_generate_openai.send({error: true});
            }
            if(response.statusCode == 429){
                console.log('Rate limit reached for requests');
                response_generate_openai.send({error: true});
            }
            if(response.statusCode == 500){
                console.log('The server had an error while processing your request');
                response_generate_openai.send({error: true});
            }
        }catch (error) {
            console.log("An error occurred: " + error);
            response_generate_openai.send({error: true});
        }
    }).on('error', function (err) {
        //console.log('');
	//console.log('something went wrong on the request', err.request.options);
        response_generate_openai.send({error: true});
    });
});

app.post("/getallchatsofchatacter", jsonParser, function(request, response){
    if(!request.body) return response.sendStatus(400);

    var char_dir = (request.body.avatar_url).replace(`.${characterFormat}`,'');
    fs.readdir(chatsPath+char_dir, (err, files) => {
        if (err) {
          console.error(err);
          response.send({error: true});
          return;
        }

        // filter for JSON files
        const jsonFiles = files.filter(file => path.extname(file) === '.jsonl');

        // sort the files by name
        //jsonFiles.sort().reverse();

        // print the sorted file names
        var chatData = {};
        let ii = jsonFiles.length;
        for(let i = jsonFiles.length-1; i >= 0; i--){
            const file = jsonFiles[i];

            const fileStream = fs.createReadStream(chatsPath+char_dir+'/'+file);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let lastLine;

            rl.on('line', (line) => {
                lastLine = line;
            });

            rl.on('close', () => {
                if(lastLine){
                    let jsonData = json5.parse(lastLine);
                    if(jsonData.name !== undefined){
                        chatData[i] = {};
                        chatData[i]['file_name'] = file;
                        chatData[i]['mes'] = jsonData['mes'];
                        ii--;
                        if(ii === 0){ 
                            response.send(chatData);
                        }
                    }else{
                        return;
                    }
                  }
                rl.close();
            });
        }
    });
    
});
function setCardName(file){
    let i = 1;
    let base_name = file;
    while (fs.existsSync(charactersPath+file+`.${characterFormat}`)) {
        file = base_name+i;
        i++;
    }
    return file;
}
app.post("/importcharacter", urlencodedParser, async function(request, response){
    if(!request.body) return response.sendStatus(400);

        let img_name = '';
        let filedata = request.file;
        //console.log(filedata.filename);
        var format = request.body.file_type;
        //console.log(format);
        if(filedata){
            if(format == 'json'){
                fs.readFile('./uploads/'+filedata.filename, 'utf8', (err, data) => {
                    if (err){
                        console.log(err);
                        response.send({error:true});
                    }
                    const jsonData = json5.parse(data);
                    
                    if(jsonData.name !== undefined){
                        img_name = setCardName(jsonData.name);
                        let pre_data = {"name": jsonData.name, "description": jsonData.description, "personality": jsonData.personality, "first_mes": jsonData.first_mes, "avatar": 'none', "chat": Date.now(), "mes_example": jsonData.mes_example, "scenario": jsonData.scenario};
                        let char = charaFormatData(pre_data);
                        char = JSON.stringify(char);
                        charaWrite('./public/img/fluffy.png', char, img_name, characterFormat, response, {file_name: img_name});
                    }else if(jsonData.char_name !== undefined){//json Pygmalion notepad
                        img_name = setCardName(jsonData.char_name);
                        let pre_data = {"name": jsonData.char_name, "description": jsonData.char_persona, "personality": '', "first_mes": jsonData.char_greeting, "avatar": 'none', "chat": Date.now(), "mes_example": jsonData.example_dialogue, "scenario": jsonData.world_scenario};
                        let char = charaFormatData(pre_data);
                        char = JSON.stringify(char);
                        charaWrite('./public/img/fluffy.png', char, img_name, characterFormat, response, {file_name: img_name});
                    }else{
                        console.log('Incorrect character format .json');
                        response.send({error:true});
                    }
                });
            }else{
                try{
                    var img_data = await charaRead('./uploads/'+filedata.filename, format);
                    let jsonData = json5.parse(img_data);
                    img_name = setCardName(jsonData.name);
                    if(checkCharaProp(img_name).length > 0){
                        let char = charaFormatData(jsonData);
                        char = JSON.stringify(char);
                        charaWrite('./uploads/'+filedata.filename, char, img_name, characterFormat, response, {file_name: img_name});
                    }else{
                        console.log('Incorrect character card');
                        response.send({error:true});
                    }
                }catch(err){
                    console.log(err);
                    response.send({error:true});
                }
            }
        }
});

app.post("/importchat", urlencodedParser, function(request, response){
    if(!request.body) return response.sendStatus(400);

        var format = request.body.file_type;
        let filedata = request.file;
        let avatar_url = (request.body.avatar_url).replace(`.${characterFormat}`, '');
        let ch_name = request.body.character_name;
        //console.log(filedata.filename);
        //var format = request.body.file_type;
        //console.log(format);
       //console.log(1);
        if(filedata){

            /** Raw format; assumes:
             * You: Hello! *Waves*
             * Them: *Smiles* Hello!
             */
            if(format === 'txt'){
                const fileStream = fs.createReadStream('./uploads/'+filedata.filename, "utf8");
                const rl = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });
                let created = Date.now();
                var new_chat = [];
                new_chat.push({
                    user_name: "You",
                    character_name: ch_name,
                    create_date: created,
                });
                rl.on("line", line => {
                    if(line && line.length) {
                        let is_user = !!line.match(/^You:/);
                        const text = line
                            .replace(/^[^:]*: ?/, "")
                            .trim()
                        ;
                        if(text) {
                            new_chat.push({
                                name: is_user ? "You" : ch_name,
                                is_user: is_user,
                                is_name: true,
                                send_date: ++created,
                                mes: text
                            });
                        }
                    }
                });
                rl.on("close", () => {
                    const chatJsonlData = new_chat.map(JSON.stringify).join('\n');
                    fs.writeFile(chatsPath+avatar_url+'/'+Date.now()+'.jsonl', chatJsonlData, 'utf8', function(err) {
                        if(err) {
                            response.send(err);
                            return console.log(err);
                        }else{
                            response.send({res:true});
                        }
                    });
                });
            } else if(format === 'json'){
                fs.readFile('./uploads/'+filedata.filename, 'utf8', (err, data) => {

                    if (err){
                        console.log(err);
                        response.send({error:true});
                    }

                    const jsonData = json5.parse(data);
                    var new_chat = [];
                    /** Collab format: array of alternating exchanges, e.g.
                     *  { chat: [
                     *      "You: Hello there.",
                     *      "Them: \"Oh my! Hello!\" *They wave.*"
                     *  ] }
                     */
                    if(jsonData.chat && Array.isArray(jsonData.chat)){
                        let created = Date.now();
                        new_chat.push({
                            user_name: "You",
                            character_name: ch_name,
                            create_date: created,
                        });
                        jsonData.chat.forEach(snippet => {
                            let is_user = !!snippet.match(/^You:/);
                            // replace all quotes around text, but not inside it
                            const text = snippet
                                .replace(/^[^:]*: ?/, "")
                                .trim()
                                .replace(/ +/g, ' ')
                                .replace(/" *$/g, '')
                                .replace(/" *\n/g, '\n')
                                .replace(/\n"/g, '\n')
                                .replace(/^"/g, '')
                                .replace(/" ?\*/g, ' *')
                                .replace(/\* ?"/g, '* ')
                            ;
                            new_chat.push({
                                name: is_user ? "You" : ch_name,
                                is_user: is_user,
                                is_name: true,
                                send_date: ++created,
                                mes: text
                            });
                        });
                        const chatJsonlData = new_chat.map(JSON.stringify).join('\n');
                        fs.writeFile(chatsPath+avatar_url+'/'+Date.now()+'.jsonl', chatJsonlData, 'utf8', function(err) {
                            if(err) {
                                response.send(err);
                                return console.log(err);
                            }else{
                                response.send({res:true});
                            }
                        });
                    } else if(jsonData.histories !== undefined){
                        let i = 0;
                        new_chat[i] = {};
                        new_chat[0]['user_name'] = 'You';
                        new_chat[0]['character_name'] = ch_name;
                        new_chat[0]['create_date'] = Date.now();
                        i++;
                        jsonData.histories.histories[0].msgs.forEach(function(item) {
                            new_chat[i] = {};
                            if(item.src.is_human == true){
                                new_chat[i]['name'] = 'You';
                            }else{
                                new_chat[i]['name'] = ch_name;
                            }
                            new_chat[i]['is_user'] = item.src.is_human;
                            new_chat[i]['is_name'] = true;
                            new_chat[i]['send_date'] = Date.now();
                            new_chat[i]['mes'] = item.text;
                            i++;
                        });
                        const chatJsonlData = new_chat.map(JSON.stringify).join('\n');
                        fs.writeFile(chatsPath+avatar_url+'/'+Date.now()+'.jsonl', chatJsonlData, 'utf8', function(err) {
                            if(err) {
                                response.send(err);
                                return console.log(err);
                                //response.send(err);
                            }else{
                                //response.redirect("/");
                                response.send({res:true});
                            }
                        });
                        
                    }else{
                        response.send({error:true});
                        return;
                    }

                });
            } else if(format === 'jsonl'){
                const fileStream = fs.createReadStream('./uploads/'+filedata.filename);
                const rl = readline.createInterface({
                  input: fileStream,
                  crlfDelay: Infinity
                });
                
                rl.once('line', (line) => {
                    let jsonData = json5.parse(line);
                    
                    if(jsonData.user_name !== undefined){
                        fs.copyFile('./uploads/'+filedata.filename, chatsPath+avatar_url+'/'+Date.now()+'.jsonl', (err) => {
                            if(err) {
                                response.send({error:true});
                                return console.log(err);
                            }else{
                                response.send({res:true});
                                return;
                            }
                        });
                    }else{
                        //response.send({error:true});
                        return;
                    }
                    rl.close();
                });
            }

        }

});



//********CHARACLOUD API***********//
app.post("/characloud_getallcharacters", jsonParser, function(request, response_characloud_getallcharacters = response){
    try {
        client.get(charaCloudServer + "/characters", function (data, response) {
            if (response.statusCode === 200) {
                response_characloud_getallcharacters.send(data);
            } else {
                response_characloud_getallcharacters.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log("No connection to charaCloud");//console.log(err);
            response_characloud_getallcharacters.sendStatus(500);
        });
    } catch (err) {
        console.log(err);
        response_characloud_getallcharacters.sendStatus(500);
    }
});

app.post("/characloud_loadcard", jsonParser, function(request, response_characloud_loadcard = response){
    let public_id = request.body.public_id;
    const url = charaCloudServer+'/cards/'+public_id+'.webp';
    const filename = path.join('uploads', public_id+'.webp');
    //let this_chara_data = charaRead(filename);

    const file = fs.createWriteStream(filename);
    const protocol = url.split(':')[0];
    const web_module = protocol === 'https' ? https : http;
    web_module.get(url, (response) => {
        response.pipe(file);

        file.on('finish', async function(){
            file.close();
      
            try{
                const char_json = await charaRead(filename);

                let char = json5.parse(char_json);
            
                charaWrite(filename, JSON.stringify(charaFormatData(char)), setCardName(char.name), characterFormat, response_characloud_loadcard, {send: 'ok'});
            } catch (error) {
                if (error instanceof SyntaxError) {
                  console.log(`String is not valid JSON!`);
                } else {
                  console.log(`An unexpected error occurred: ${error}`);
                }
            }
        });
    }).on('error', (err) => {
        fs.unlink(filename, () => {
            console.error(`Error downloading file: ${err.message}`);
        });
    });
});

app.post("/characloud_search_character", jsonParser, function(request, response_characloud_search){
    let search_string = request.body.q;
    try {
        client.get(charaCloudServer + "/characters?q="+search_string, function (data, response) {
            if (response.statusCode === 200) {
                response_characloud_search.send(data);
            } else {
                response_characloud_search.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            response_characloud_search.sendStatus(500);
        });
    } catch (err) {
        console.log(err);
        response_characloud_search.sendStatus(500);
    }
});

app.post("/characloud_serverstatus", jsonParser, function(request, response_characloud_server_status){
    try {
        client.get(charaCloudServer + "/server/status", function (data, response) {
            if (response.statusCode === 200) {
                response_characloud_server_status.send(data);
            } else {
                response_characloud_server_status.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            response_characloud_server_status.sendStatus(500);
        });
    } catch (err) {
        console.log(err);
        response_characloud_server_status.sendStatus(500);
    }
});

app.listen(server_port, listenIp, function() {
    if(process.env.colab !== undefined){
        if(process.env.colab == 2){
            is_colab = true;
        }
    }
    console.log('Launching...');
    initialization();
    if(autorun) open('http:127.0.0.1:'+server_port);
    console.log('TavernAI started: http://127.0.0.1:'+server_port);
    
});

function initialization(){
    const folderPath = charactersPath;
    // get all files in folder
    let this_format;
    let old_format;
    if(characterFormat === 'webp'){
        this_format = 'webp';
        old_format = 'png';
    }else{
        this_format = 'png';
        old_format = 'webp';
    }
    fs.readdir(folderPath, async (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        
        for (const file of files) {
                const filePath = path.join(folderPath, file);
            // check if file is png image
            if (!file.endsWith(`.${old_format}`)) {
                continue;
            }
            
            // read metadata
            const json_metadata = await charaRead(filePath);
            const metadata = json5.parse(json_metadata);
            // check if metadata contains chara.name
            if (!metadata || !metadata.name) {
                continue;
            }

            // choose target filename
            let targetName = setCardName(file.replace(`.${old_format}`, ''));
            let targetPath = path.join(folderPath, targetName+`.${this_format}`);

            // write image
            await charaWrite(filePath, JSON.stringify(metadata), targetName, this_format);

            // delete original file
            if (fs.existsSync(targetPath)) { //make to check (need to meake charaWrite is )
            // delete original file
            fs.unlink(filePath, err => {
                if (err) {
                  console.error('Error deleting file:', err);
                } else {
                    console.log(targetName+' has been converted to .'+this_format);
                  //console.log('Deleted file:', filePath);
                }
            });
          } else {
                console.error('Error writing file:', targetPath);
          }
        }
    });
    clearUploads();
}

function clearUploads() {
    let folderPath = './uploads';
    fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    for (const file of files) {
        const filePath = path.join(folderPath, file);

        fs.unlink(filePath, err => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                //console.log('Deleted file:', filePath);
            }
        });
    }
  });
}

/*

async function processImage(imagePath) {
  for (let i = 0; i < 500; i++) {
    const processedImagePath = imagePath;
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      let qwer = crypto.randomBytes(Math.floor(Math.random() * 2000)).toString('hex');
      let aaa = `{"public_id":"undefined",${qwer}"}`;
      const processedImage = await sharp(imageBuffer).resize(400, 600).webp({'quality':95}).withMetadata({
                        exif: {
                            IFD0: {
                                UserComment: aaa
                            }
                        }
                    }).toBuffer();
      fs.writeFileSync(processedImagePath, processedImage);
      console.log(`Iteration ${i}: Success`);
    } catch (err) {
      console.log(`Iteration ${i}: Error: ${err}`);
    }
  }
}

const imagePath = 'image.webp';
processImage(imagePath);
*/