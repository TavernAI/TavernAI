const { express, path, fs, jsonParser, charaCloudServer, client, json5, https, http, crypto, updateSettings, urlencodedParser, sharp, charaRead, charaWrite, uuid, 
    characterFormat, charaFormatData, setCardName, utf8Encode, utf8Decode, extract, encode, PNGtext, ExifReader } = require('../server');

const needle  = require("needle");
var ALPHA_KEY;
var MAIN_KEY;
var MASTER_TOKEN;
router = express.Router();

router.get("/characters", function(request, response_characloud_getallcharacters){
    try {
        client.get(charaCloudServer + "/api/characters", function (data, response) {
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
router.get("/board", function(request, response_characloud_getallcharacters){
    try {
        client.get(charaCloudServer + "/api/characters/board", function (data, response) {
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
router.post("/characters/load", jsonParser, function(request, response_characloud_loadcard){
    try {
        let public_id_short = request.body.public_id_short;
        let user_name = request.body.user_name;
        const url = `${charaCloudServer}/${user_name}/${public_id_short}.webp`;
        const filename = path.join('uploads', uuid.v4().replace(/-/g, '') + '.webp');
        //let this_chara_data = charaRead(filename);

        const file = fs.createWriteStream(filename);
        const protocol = url.split(':')[0];
        const web_module = protocol === 'https' ? https : http;
        web_module.get(url, (response) => {
            response.pipe(file);

            file.on('finish', async function () {
                file.close();

                try {
                    const char_json = await charaRead(filename);

                    let char = json5.parse(char_json);
                    let card_name = setCardName(char.name);
                    let character_data = charaFormatData(char);
                    await charaWrite(filename, JSON.stringify(character_data), path.join('public', 'characters', card_name), characterFormat);
                    character_data.filename = `${card_name}.${characterFormat}`;
                    return response_characloud_loadcard.status(200).json(character_data);
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        console.log(`String is not valid JSON!`);
                    } else {
                        console.log(`An unexpected error occurred: ${error}`);
                        
                    }
                    return response_characloud_loadcard.status(400).json({error: error.toString()});
                }
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => {
                console.error(`Error downloading file: ${err.message}`);
                return response_characloud_loadcard.status(400).json({error: err.toString()});
            });
        });
    } catch (err) {
        console.log(err);
        return response_characloud_loadcard.status(400).json({error: err.toString()});
    }
});

router.post("/characters/search", jsonParser, function(request, response_characloud_search){
    let search_string = request.body.q;
    try {
        const encoded_search_string = encodeURIComponent(search_string);
        client.get(charaCloudServer + "/api/characters?q="+encoded_search_string, function (data, response) {
            if (response.statusCode === 200) {
                response_characloud_search.send(data);
            } else {
                return response_characloud_search.status(400).json(data);
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_search.status(400).json({error: err.toString()});
        });
    } catch (err) {
        console.log(err);
        return response_characloud_search.status(400).json({error: err.toString()});
    }
});

router.post("/server/status", jsonParser, function(request, response_characloud_server_status){
    try {
        client.get(charaCloudServer + "/api/server/status", function (data, response) {
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

router.post("/users/registration", jsonParser, function (request, response_characloud_registration) {
    try {
        
        let {name, email, password, re_token = undefined} = request.body;

        MAIN_KEY = generateMainKey(password);
        password = MAIN_KEY;

        var args = {
            data: {name, email, password},
            headers: {"Content-Type": "application/json"},
            requestConfig: {
                timeout: 10 * 1000
            },
            responseConfig: {
                timeout: 10 * 1000
            }
        };
        if(re_token !== undefined){
            args.data.re_token = re_token;
        }
        client.post(charaCloudServer + "/api/users/registration", args, function (data, response) {
            try {
                if (response.statusCode === 201) {
                    console.log('Profile has been registered.');
                    return response_characloud_registration.status(201).json(data);
                } else {
                    console.log(data);
                    return response_characloud_registration.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_registration.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_registration.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_registration.sendStatus(500);
    }
});

router.post("/users/login", jsonParser, function (request, response_characloud_login) {
    try {
        let {name, password, type} = request.body;
        if(type === 'password'){
            MAIN_KEY = generateMainKey(password);
        }else if(type === 'ALPHA_KEY'){
            MAIN_KEY = generateMainKeyAB(password, BETA_KEY); //password = ALPHA_KEY
        }else{
            return response_characloud_login.sendStatus(500);
        }
        password = MAIN_KEY;
        var args = {
            data: {name, password},
            headers: {"Content-Type": "application/json"},
            requestConfig: {
                timeout: 10 * 1000
            },
            responseConfig: {
                timeout: 10 * 1000
            }
        };
        client.post(charaCloudServer + "/api/users/login", args, function (data, response) {
            try {
                if (response.statusCode === 200) {
                    if(type === 'password') console.log('Login');
                    MASTER_TOKEN = data.token;
                    delete data.token;
                    data.ALPHA_KEY = ALPHA_KEY;
                    updateSettings({'BETA_KEY': BETA_KEY});
                    return response_characloud_login.status(200).json(data);
                } else {
                    console.log(data);
                    return response_characloud_login.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_login.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_login.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_login.sendStatus(500);
    }
});
router.post("/users/logout", jsonParser, function (request, response_characloud_logout) {
    try {
        updateSettings({'BETA_KEY': ''});
        response_characloud_logout.status(200).json({'message':'success'});
    } catch (err) {
        console.log(err);
        return response_characloud_logout.sendStatus(500);
    }
});
router.post("/characters/prepublish", urlencodedParser, async function(request, response){
    try {
        if (!request.body)
            return response.sendStatus(400);
        let filename;
        let sourcePath;
        let type; // upload, select //upload file, select from local library
        if(request.file){
            type = 'upload';
            let filedata = request.file;
            filename = filedata.filename;
            sourcePath = './uploads/' + filename;
        }else{
            type = 'select';
            filename = request.body.filename_local;
            filename = filename.replace(`.${characterFormat}`, '');
            sourcePath = `./public/characters/${filename}.${characterFormat}`;
        }
        const stats = fs.statSync(sourcePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        if (fileSizeInKB > 800) {
            console.log(`Error: The maximum file size should not exceed 800 kb`);
            return response.status(400).json({error: `The maximum file size should not exceed 800 kb`});
        }
        sharp(sourcePath)
                .metadata()
                .then(async (metadata) => {
                    // Check if the source file exists
                    if (!fs.existsSync(sourcePath)) {
                        console.log(`Error: ${sourcePath} does not exist`);
                        return response.status(400).json({error: `Error: ${sourcePath} does not exist`});
                    }

                    // Rename the file
                    const destPath = `./public/cardeditor/${filename}.${metadata.format}`; // Destination file path
                    if(type === 'upload'){
                        fs.renameSync(sourcePath, destPath);
                    }else if(type === 'select'){
                        fs.copyFileSync(sourcePath, destPath);
                    }

                    //console.log(`Renamed ${sourcePath} to ${destPath}`);
                    let character_json_data = false;
                    try {
                        character_json_data = await charaRead(destPath, metadata.format);
                    } catch (err) {
                        throw new Error('Failed to read character data');
                    }
                    if (character_json_data !== false) {
                        let character_data;
                        try {
                            character_data = json5.parse(character_json_data);
                            if (character_data.name !== undefined) {
                                return response.status(200).json({character: character_json_data, image: `${filename}.${metadata.format}`, image_size: fileSizeInKB});
                            } else {
                                throw new Error('Failed to read character data');
                            }
                        } catch (err) {
                            console.log(err);
                            throw new Error('Failed to read character data');
                        }

                    } else {
                        throw new Error('Failed to read character data');
                    }

                }).catch((err) => {
            console.error(err);
            return response.status(400).json({error: err.toString()});
        });
    } catch (err) {
        console.log(err);
        return response.status(400).json({error: err.toString()});
    }

});


router.post("/characters/publish", jsonParser, async function (request, response_characloud_publish) {
    try {
        let character_data = request.body.character_data;
        let character_img = request.body.character_img;
        const type = request.body.type; //create_online, edit_online
        let target_filename = request.body.target_filename; // target file name for update character from editor
        
        let user_name;
        let public_id_short;
        if(type === 'edit_online'){
            if(character_data.user_name !== undefined && character_data.public_id_short !== undefined){
                user_name = character_data.user_name;
                public_id_short = character_data.public_id_short;
            }else{
                throw new Error(`Parameters for 'edit_online' type did not setup`);
            }
        }
        let new_file = uuid.v4().replace(/-/g, '');

        let formated_character_data = charaFormatData(character_data);
        if(type === 'update_locally'){
            formated_character_data.chat = character_data.chat;
        }
        const character_data_json = JSON.stringify(formated_character_data);
        if (type === 'create_online' || type === 'edit_online') {
            await charaWrite(`./public/cardeditor/${character_img}`, character_data_json, `./public/cardeditor/${new_file}`, 'webp');
            const imagePath = `./public/cardeditor/${new_file}.webp`;
            let data = {
                image: {
                    file: imagePath,
                    content_type: "image/webp"
                }
            };
            let headers = {
                'Authorization': 'Bearer ' + MASTER_TOKEN
            };
            let url;
            if (type === 'create_online') {
                url = charaCloudServer + '/api/characters';
            } else if (type === 'edit_online') {
                url = charaCloudServer + `/api/characters/${user_name}/${public_id_short}`;
            }
            needle.post(url, data, {multipart: true, headers: headers, timeout: 10000}, function (err, result) {
                if (err && err.code === 'ECONNRESET') {
                    console.error('Timeout error:', err);
                    // Handle the timeout error here
                    return response_characloud_publish.status(503).json({error: 'The request timed out'});
                } else if (err) {
                    console.error('Error:', err);
                    // Handle other errors here
                    return response_characloud_publish.status(500).json({error: err.toString()});
                }
                if (result.statusCode >= 400) { // check response status code
                    console.error(result.body);
                    return response_characloud_publish.status(result.statusCode).json({error: result.body});
                }
                return response_characloud_publish.status(200).json(result.body);
            });
        }else if(type === 'add_locally'){
            new_file = setCardName(character_data.name);
            await charaWrite(`./public/cardeditor/${character_img}`, character_data_json, `./public/characters/${new_file}`, characterFormat);
            return response_characloud_publish.status(200).json({file_name: new_file});
        }else if(type === 'update_locally'){
            target_filename = target_filename.replace(`.${characterFormat}`,'');
            await charaWrite(`./public/cardeditor/${character_img}`, character_data_json, `./public/characters/${target_filename}`, characterFormat);
            return response_characloud_publish.status(200).json({file_name: target_filename});
        }
    } catch (err) {
        console.log(err);
        return response_characloud_publish.status(400).json({error: err.toString()});
    }
});

router.post("/user/characters", jsonParser, function (request, response_characloud_user_characters) {
    try {
        let {name, page, perpage} = request.body;

        let this_master_token = MASTER_TOKEN;
        if(this_master_token === undefined || this_master_token === ''){
            this_master_token = '';
        }
        var options = {
            headers: {
                'Authorization': 'Bearer ' + this_master_token
            }
        };
        client.get(charaCloudServer + `/api/users/${name}/characters?perpage=${perpage}&page=${page}`, options, function (data, response) {
            try {
                if (response.statusCode === 200) {
                    return response_characloud_user_characters.status(200).json(data);
                } else {
                    console.log(data);
                    return response_characloud_user_characters.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_user_characters.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_user_characters.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_user_characters.status(400).json({error: err.toString()});
    }
});
router.post("/characters/get", jsonParser, function (request, response_characloud_character) {
    try {
        
        let {user_name, public_id_short, mode} = request.body;
        client.get(charaCloudServer + `/api/characters/${user_name}/${public_id_short}`, function (data, response) {
            try {
                if (response.statusCode === 200) {
                    //return response_characloud_character.status(200).json(data);
                    let public_id = request.body.public_id;
                    let url;
                    if(mode === 'moderation_edit'){
                        url = `${charaCloudServer}/users/${user_name}/moderation/${public_id_short}.webp`;
                    }else{
                        url = `${charaCloudServer}/${user_name}/${public_id_short}.webp`;
                    }

                    const img_card_name = uuid.v4().replace(/-/g, '') + '.webp';
                    const filename = path.join('public', 'cardeditor', img_card_name);
                    //let this_chara_data = charaRead(filename);

                    const file = fs.createWriteStream(filename);
                    const protocol = url.split(':')[0];
                    const web_module = protocol === 'https' ? https : http;
                    web_module.get(url, (response) => {
                        response.pipe(file);

                        file.on('finish', async function () {
                            file.close();

                            try {
                                const char_json = await charaRead(filename);
                                const sourcePath = filename;
                                const stats = fs.statSync(sourcePath);
                                const fileSizeInBytes = stats.size;
                                const fileSizeInKB = fileSizeInBytes / 1024;
                                let char = json5.parse(char_json);
                                return response_characloud_character.status(200).json({online_data: data, character_data: char, image: img_card_name, image_size: fileSizeInKB});
                                //charaWrite(filename, JSON.stringify(charaFormatData(char)), setCardName(char.name), characterFormat, response_characloud_loadcard, {send: 'ok'});
                            } catch (error) {
                                if (error instanceof SyntaxError) {
                                    console.log(`String is not valid JSON!`);
                                } else {
                                    console.log(`An unexpected error occurred: ${error}`);
                                }
                                return response_characloud_character.status(400).json({error: error});
                            }
                        });
                    }).on('error', (err) => {
                        fs.unlink(filename, () => {
                            console.log(err);
                            return response_characloud_character.status(400).json({error: err.toString()});
                        });
                    });
                } else {
                    console.log(data);
                    return response_characloud_character.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_character.status(400).json({error: err.toString()});
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_character.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_character.status(400).json({error: err.toString()});
    }
});

router.post("/characters/delete", jsonParser, function (request, response_characloud_delete) {
    try {
        var options = {
            headers: {
                'Authorization': 'Bearer ' + MASTER_TOKEN
            }
        };
        let {user_name, public_id_short, mode} = request.body;
        client.delete(charaCloudServer + `/api/characters/${user_name}/${public_id_short}?mode=${mode}`, options, function (data, response) {
            try {
                if (response.statusCode === 200) {
                        return response_characloud_delete.status(200).json(data);
     
                } else {
                    console.log(data);
                    return response_characloud_delete.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_delete.status(400).json({error: err.toString()});
            }
        }).on('error', function (err) {
            console.log(err);
            console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_delete.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_delete.status(400).json({error: err.toString()});
    }
});

router.post("/characters/avatar", urlencodedParser, async function(request, response){
    try {
        if (!request.body)
            return response.sendStatus(400);

        let img_name = '';
        let filedata = request.file;
        var format = request.body.file_type;
        const sourcePath = './uploads/' + filedata.filename;

        // Resize and convert the image to WebP format
        const outputPath = path.join(process.cwd(), 'public', 'cardeditor', filedata.filename + '.webp');
        await sharp(sourcePath)
            .resize(400, 600)
            .toFormat('webp')
            .toFile(outputPath);

        // Send a response with the URL of the converted image
        const outputUrl = filedata.filename + '.webp';
        response.status(200).json({ image: outputUrl });
    } catch (err) {
        console.log(err);
        return response.status(400).json({error: err.toString()});
    }
});

router.post("/users/avatar", urlencodedParser, async function (request, response) {
    try {
        if (!request.body)
            return response.sendStatus(400);
        let user_name = request.body.user_name;
        let img_name = '';
        let filedata = request.file;
            //console.log(filedata.filename);
        var format = request.body.file_type;
        const sourcePath = './uploads/' + filedata.filename;
        const stats = fs.statSync(sourcePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        if (fileSizeInKB > 80) {
            //console.log(`Error: The maximum file size should not exceed 80 kb`);
            //return response.status(400).json({error: `The maximum file size should not exceed 80 kb`});
        }
        sharp(sourcePath)
                .metadata()
                .then(async (metadata) => {
                    try {
                        // Check if the source file exists
                        if (!fs.existsSync(sourcePath)) {
                            console.log(`Error: ${sourcePath} does not exist`);
                            return response.status(400).json({error: `Error: ${sourcePath} does not exist`});
                        }
                        //if (metadata.width > 600 || metadata.heigth > 600) {
                            //console.log(`Error: Image ${metadata.heigth}x${metadata.width} Max height/width: 600px`);
                            //return response.status(400).json({error: `Error: Image ${metadata.heigth}x${metadata.width} Max height/width: 600px`});
                        //}
                        const destPath = './uploads/user_avatar.webp';
                        await sharp(sourcePath)
                        .resize(100, 100)
                        .toFormat('webp')
                        .toFile(destPath);
                
                        const imagePath = destPath;
                        let data = {
                            image: {
                                file: imagePath,
                                content_type: "image/webp"
                            }
                        };
                        let headers = {
                            'Authorization': 'Bearer ' + MASTER_TOKEN
                        };
                        let url = charaCloudServer + `/api/users/${user_name}/avatar`;
                        needle.post(url, data, {multipart: true, headers: headers, timeout: 10000}, function (err, result) {
                            if (err && err.code === 'ECONNRESET') {
                                console.error('Timeout error:', err);
                                // Handle the timeout error here
                                return response.status(503).json({error: 'The request timed out'});
                            } else if (err) {
                                console.error('Error:', err);
                                // Handle other errors here
                                return response.status(500).json({error: err.toString()});
                            }
                            if (result.statusCode >= 300) { // check response status code
                                console.error(result.body);
                                return response.status(result.statusCode).json({error: result.body});
                            }
                            return response.status(200).json(result.body);
                        });

                    } catch (err) {
                        console.log(err);
                        return response.status(400).json({error: err.toString()});
                    }
                }).catch((err) => {
            console.error(err);
            return response.status(400).json({error: err.toString()});
        });
    } catch (err) {
        console.log(err);
        return response.status(400).json({error: err.toString()});
    }

});

router.post("/category/characters", jsonParser, function (request, response_characloud_category) {
    try {
        let {category} = request.body;
        client.get(charaCloudServer + `/api/categories/${category}/characters`, function (data, response) {
            try {
                if (response.statusCode === 200) {
                    return response_characloud_category.status(200).json(data);
                } else {
                    console.log(data);
                    return response_characloud_category.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_category.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            //console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_category.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_category.status(400).json({error: err.toString()});
    }
});
router.post("/categories", jsonParser, function (request, response_characloud_category) {
    try {
        let {category} = request.body;
        client.get(charaCloudServer + `/api/categories`, function (data, response) {
            try {
                if (response.statusCode === 200) {
                    return response_characloud_category.status(200).json(data);
                } else {
                    console.log(data);
                    return response_characloud_category.status(response.statusCode).json(data);
                }
            } catch (err) {
                console.log(err);
                return response_characloud_category.sendStatus(500);
            }
        }).on('error', function (err) {
            console.log(err);
            //console.log("No connection to charaCloud");//console.log(err);
            return response_characloud_category.sendStatus(504);
        });
    } catch (err) {
        console.log(err);
        return response_characloud_category.status(400).json({error: err.toString()});
    }
});
function generateMainKey(password) {
    ALPHA_KEY = crypto.createHash('sha256').update('ALPHA_KEY_' + password).digest('hex');
    BETA_KEY = crypto.createHash('sha256').update('BETA_KEY_' + password).digest('hex');
    return crypto.createHash('sha256').update(ALPHA_KEY + '_' + BETA_KEY).digest('hex');

}
function generateMainKeyAB(ALPHA_KEY, BETA_KEY){
    return crypto.createHash('sha256').update(ALPHA_KEY + '_' + BETA_KEY).digest('hex');
}
module.exports = router;