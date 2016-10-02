
(function() {

    //Event Handlers
    document.getElementById('champsearch').addEventListener('keypress', function(event) { on_search(event); });
    document.getElementById('champsearch2').addEventListener('keypress', function(event) { on_search(event); });
    var filters = document.getElementsByClassName('filter');
    for(var i = 0; i < filters.length; i++){
        filters[i].addEventListener('click', shop_filter);
    }
    var gameinputs = document.getElementsByClassName('gamedatainput');
    for(var i = 0; i < gameinputs.length; i++){
        gameinputs[i].addEventListener('keypress', update_gamedata);
    }
    document.getElementById('nav2').addEventListener('click', display_runes);
    document.getElementById('nav4').addEventListener('click', display_gamedata);
    document.getElementById('nav5').addEventListener('click', display_shop);
    var shop_icons = document.getElementsByClassName('shopicon');
    for(var i = 0; i < shop_icons.length; i++){
        shop_icons[i].addEventListener('click', add_inventory);
        shop_icons[i].addEventListener('mouseover', item_stats);
    }
    var inventory_icons = document.getElementsByClassName('inventoryicon');
    for(var i = 0; i < inventory_icons.length; i++){
        inventory_icons[i].addEventListener('click', remove_inventory);
        inventory_icons[i].addEventListener('mouseover', item_stats);
    }
    document.getElementById('passiveicon').addEventListener('click', changePassive);
    document.getElementById('abilityoneicon').addEventListener('click', changeAbilityOne);
    document.getElementById('abilitytwoicon').addEventListener('click', changeAbilityTwo);
    document.getElementById('abilitythreeicon').addEventListener('click', changeAbilityThree);
    document.getElementById('abilityfouricon').addEventListener('click', changeAbilityFour);
    
    document.body.addEventListener('click', function(event) { test(event); });

    function test(e){
        document.body.style.backgroundImage = "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg)";
    }

    function on_search(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13){
            //champion icon
            var champname = document.getElementById('champsearch2').value;
            if(champname == 'cocaine'){
                champname = document.getElementById('champsearch').value;
                document.getElementById('champsearch2').value = champname;
            }
            var name = champname;
            var icon = document.getElementById('champicon');
            
            //need to grab latest patch number and insert here
            var icon_url = "http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/";
            var almost = name.concat(".png");
            icon.src = icon_url.concat(almost);
            
            //splash art
            var splash_url = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
            almost = name.concat("_0.jpg");
            splash_url = splash_url.concat(almost);
            document.getElementById('bgimg').src = splash_url;
            
            /*check if result is a 404
            
            var icon = document.getElementById('champicon');
            icon.src = "Icons/nochamp.png";
            console.log("that's not a real champ, silly goose");  "+name+"'s*/
            
            /*transition into base stats screen*/
            document.getElementById('welcometitle').innerHTML = "Nice choice. Now let's get down to business.";
            document.getElementById('welcometext').innerHTML = ""+name+"'s base stats are on the left and their abilities are below. To start planning your build, we'll need some information. Use the tabs on the right to add runes, scores, and items. Your stats and scalings will update as you go.";
            
            document.getElementById('champsearch').style.visibility = 'hidden';
            document.getElementById('champsearch2').style.visibility = 'visible';
            document.getElementById('transbarmid').style.visibility = 'visible';
            document.getElementById('transbox').style.visibility = 'hidden';
            document.getElementById('abilitybox').style.visibility = 'visible';
            
            /*get base stats from API*/
            setTimeout(get_base_stats(), 1);
            setTimeout(change_passive(), 1);
            setTimeout(change_abilities(), 1);
            setTimeout(changePassive(), 1);
            
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var shop_array = [];
                    var item_info = [];
                    
                    for(var key in json.data){
                        if(json.data.hasOwnProperty(key)){	
                            shop_array.push(key);
                            item_info.push(json.data[key]);
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].maps["11"] == false){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].consumed == true){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsDistortion"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsCaptain"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsAlacrity"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsFuror"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                    }
                    j=0;
                    for(i=0; i<72; i++){
                        var num = i.toString();
                        var shop_icon_string = "shop_icon"
                        var shop_id = shop_icon_string.concat(num);
                        var item_url = "http://ddragon.leagueoflegends.com/cdn/6.8.1/img/item/";
                        var temp = shop_array[j];
                        
                        var mid_shop_array = temp.concat(".png");
                        var shop_source = document.getElementById(shop_id);

                        if(i < shop_array.length){
                            shop_source.src = item_url.concat(mid_shop_array);
                        } else {
                            shop_source.src = "icons/EmptyIcon_Item.png";
                        }
                        j++;
                    }
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    
                }
            });
        }
    }

        
    function get_base_stats(){
            var champ_name = "";
            champ_name = $("#champsearch2").val();
            if(champ_name=="cocaine"){
                champ_name = $("#champsearch").val();
            }
            console.log(champ_name);
            $.ajax({
                url: 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=stats&api_key=59080bd8-1d31-44be-8a1e-3ecd9a372501',
                type: 'GET',
                dataType: 'json',
                data:{},
                success: function (json) {
                    var champname_nospaces = champ_name.replace(" ", "");
                    champname_nospaces = champname_nospaces.toLowerCase().trim();
            
                    pass = json.data[champ_name].stats;
                    console.log(pass);
            
                    var stats = {attackrange:"0",mpperlevel:"0",mp:"0",attackdamage:"0",hp:"0",hpperlevel:"0",attackdamageperlevel:"0",armor:"0",mpregenperlevel:"0",
                                 hpregen:"0",critperlevel:"0",spellblockperlevel:"0",mpregen:"0",
                                 attackspeedperlevel:"0",spellblock:"0",movespeed:"0",attackspeedoffset:"0",crit:"0",hpregenperlevel:"0",armorperlevel:"0"};
            
                    for(var property in stats)
                    {
                        if(stats.hasOwnProperty(property))
                        {
                            stats[property]=json.data[champ_name].stats[property];
                        }
                    }
                    
                    //document.getElementById("mpperlevel").value=stats.mpperlevel;
                    document.getElementById("mana").innerHTML = Math.round(stats.mp);
                    document.getElementById("attackdamage").innerHTML = Math.round(stats.attackdamage);
                    document.getElementById("health").innerHTML = Math.round(stats.hp);
                    //document.getElementById("hpperlevel").value=stats.hpperlevel;
                    //document.getElementById("attackdamageperlevel").value=stats.attackdamageperlevel;
                    document.getElementById("armor").innerHTML = Math.round(stats.armor);
                    //document.getElementById("mpregenperlevel").value=stats.mpregenperlevel;
                    document.getElementById("healthregen").innerHTML = Math.round(stats.hpregen);
                    //document.getElementById("critperlevel").value=stats.critperlevel;
                    //document.getElementById("mrperlevel").value=stats.spellblockperlevel;
                    document.getElementById("manaregen").innerHTML = Math.round(stats.mpregen);
                    //document.getElementById("attackspeedperlevel").value=stats.attackspeedperlevel;
                    document.getElementById("magicresist").innerHTML = Math.round(stats.spellblock);
                    document.getElementById("movespeed").innerHTML = Math.round(stats.movespeed);
                    document.getElementById("criticalchance").innerHTML = Math.round(stats.crit);
                    //document.getElementById("hpregenperlevel").value=stats.hpregenperlevel;
                    //document.getElementById("armorperlevel").value=stats.armorperlevel;
                    //document.getElementById("attackspeedoffset").value=stats.attackspeedoffset;
                }
            })
    }

    function change_passive(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
        
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var champ_name_nospaces = champ_name.replace(" ", "");
                    champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                    
                    <!-- changing passive icon -->
                    pass = json.data[champ_name].passive.image.full;
                    console.log(pass);
                    
                    var passive = document.getElementById('passiveicon');
                    
                    var passive_url = "http://ddragon.leagueoflegends.com/cdn/5.23.1/img/passive/";
                    var almost_two = pass.concat(".png");
                    passive.src = passive_url.concat(pass);
                    
                    <!-- passive description -->
                    var pass_text = document.getElementById('abilitytext');
                    //pass_text.innerHTML = json.data[champ_name].passive.description;
                    
                    var pass_title = document.getElementById('abilityname');
                    pass_title.innerHTML = json.data[champ_name].passive.name;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    
                }
            });
        }
    }

    function change_abilities(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
        
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var champ_name_nospaces = champ_name.replace(" ", "");
                    champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                    
                    
                    var abilities= ["", "", "", ""];
                    for(i=0; i<4; i++){
            
                        abilities[i] = json.data[champ_name].spells[i].image.full;
                        console.log(abilities[i]);
                    }
                    
                    
                    
                    var ability_url = "http://ddragon.leagueoflegends.com/cdn/5.23.1/img/spell/"
                    var ab_one = document.getElementById('abilityoneicon');
                    var ab_two = document.getElementById('abilitytwoicon');
                    var ab_three = document.getElementById('abilitythreeicon');
                    var ab_four = document.getElementById('abilityfouricon');
                    for(j=0; j<4; j++){
                        if(j==0){
                            ab_one.src = ability_url.concat(abilities[j]);
                        }
                        if(j==1){
                            ab_two.src = ability_url.concat(abilities[j]);
                        }
                        if(j==2){
                            ab_three.src = ability_url.concat(abilities[j]);
                        }
                        if(j==3){
                            ab_four.src = ability_url.concat(abilities[j]);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    
                }
            });
        }
    }

    function changePassive(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){	
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {},
                success: function (json) {
                    
                    var champ_name_nospaces = champ_name.replace(" ", "");
                    champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
        
                    <!-- passive description -->
                    var pass_text = document.getElementById('abilitytext');
                    pass_text.innerHTML = json.data[champ_name].passive.description;
                                
                    var pass_title = document.getElementById('abilityname');
                    pass_title.innerHTML = json.data[champ_name].passive.name;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {}
            });
        }				
    }
            
    function changeAbilityOne(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
            
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {},
                success: function (json) {
                var champ_name_nospaces = champ_name.replace(" ", "");
                champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                            
                            
                <!-- ability description -->			
                var ab_one_text = document.getElementById('abilitytext');
                
                var ab_one_title = document.getElementById('abilityname');
                ab_one_title.innerHTML = json.data[champ_name].spells[0].name;
                            
                <!-- replacing placeholder values with real data -->
                var str = json.data[champ_name].spells[0].tooltip;			
                    str = str.replace(/{/g, '').replace(/}/g, '');
                    
                    var e_array = str.match(/[e][0-9]/g);
                    var f_array = str.match(/[f][0-9]/g);
                    var a_array = str.match(/[a][0-9]/g);
                    
                    var varslength;
                    
                    if(f_array != null && a_array != null){
                        varslength = f_array.length + a_array.length;
                    }
                    if(f_array == null && a_array != null){
                        varslength = a_array.length;
                    }
                    if(a_array == null && f_array != null){
                        varslength = f_array.length;
                    }
                    if(f_array == null && a_array == null){
                        varslength = 0;
                    }	
                            
                    if(e_array != null){
                        for(i=0; i < e_array.length; i++){
                            var e_array_two = [""];
                            e_array_two[i] = e_array[i].replace(/\D/g, '');
                            e_array_two[i] = Number(e_array_two[i]);
                            str = str.replace(e_array[i] , json.data[champ_name].spells[0].effectBurn[e_array_two[i]]);
                        }
                    }
                    
                    
                    if(f_array != null){
                        for(j=0; j < f_array.length; j++){
                            for(h=0; h < varslength; h++){
                                if(json.data[champ_name].spells[0].vars[h] != undefined){
                                    if(json.data[champ_name].spells[0].vars[h].key == f_array[j]){
                                        str = str.replace(f_array[j] , json.data[champ_name].spells[0].vars[h].coeff);
                                    }
                                }
                            }
                        }
                    }
                    

                    //ability power
                    if(a_array != null){
                        
                        for(k=0; k < a_array.length; k++){
                            for(g=0; g < varslength; g++){
                                console.log(varslength);
                                if(json.data[champ_name].spells[0].vars[g] != undefined){
                                    if(json.data[champ_name].spells[0].vars[g].key == a_array[k]){
                                        //str = str.replace(a_array[k] , json.data[champ_name].spells[0].vars[g].coeff);

                                        var scaling=document.getElementById("abilitypower").innerHTML;
                                        scaling=scaling*json.data[champ_name].spells[0].vars[g].coeff;
                                        console.log(scaling);

                                        str = str.replace(a_array[k], scaling);
                                    }
                                }
                            }
                            
                        }
                    }
                    ab_one_text.innerHTML = str;
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                
                }
            });
        }
    }	
    function changeAbilityTwo(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
        
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var champ_name_nospaces = champ_name.replace(" ", "");
                    champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                    
                    <!-- passive description -->
                    var ab_two_text = document.getElementById('abilitytext');
                    
                    var ab_two_title = document.getElementById('abilityname');
                    ab_two_title.innerHTML = json.data[champ_name].spells[1].name;
                    
                    
                    <!-- replacing placeholder values with real data -->
                    var str = json.data[champ_name].spells[1].tooltip;
                    
                    str = str.replace(/{/g, '').replace(/}/g, '');
                    
                    var e_array = str.match(/[e][0-9]/g);
                    var f_array = str.match(/[f][0-9]/g);
                    var a_array = str.match(/[a][0-9]/g);
                    
                    var varslength;
                    
                    if(f_array != null && a_array != null){
                        varslength = f_array.length + a_array.length;
                    }
                    if(f_array == null && a_array != null){
                        varslength = a_array.length;
                    }
                    if(a_array == null && f_array != null){
                        varslength = f_array.length;
                    }
                    if(f_array == null && a_array == null){
                        varslength = 0;
                    }	
                    
                    if(e_array != null){
                        for(i=0; i < e_array.length; i++){
                            console.log(e_array[i]);
                            var e_array_two = [""];
                            e_array_two[i] = e_array[i].replace(/\D/g, '');
                            e_array_two[i] = Number(e_array_two[i]);
                            str = str.replace(e_array[i] , json.data[champ_name].spells[1].effectBurn[e_array_two[i]]);
                        }
                    }
                    
                    
                    if(f_array != null){
                        for(j=0; j < f_array.length; j++){
                            for(h=0; h < varslength; h++){
                                if(json.data[champ_name].spells[1].vars[h] != undefined){
                                    if(json.data[champ_name].spells[1].vars[h].key == f_array[j]){
                                        str = str.replace(f_array[j] , json.data[champ_name].spells[1].vars[h].coeff);
                                    }
                                }
                            }
                        }
                    }
                    
                    if(a_array != null){
                        
                        for(k=0; k < a_array.length; k++){
                            for(g=0; g < varslength; g++){
                                if(json.data[champ_name].spells[1].vars[g] != undefined){
                                    if(json.data[champ_name].spells[1].vars[g].key == a_array[k]){
                                        //str = str.replace(a_array[k] , json.data[champ_name].spells[1].vars[g].coeff);

                                        var scaling=document.getElementById("abilitypower").innerHTML;
                                        scaling=scaling*json.data[champ_name].spells[1].vars[g].coeff;
                                        console.log(scaling);

                                        str = str.replace(a_array[k], scaling);
                                    }
                                }
                            }
                            
                        }
                    }
                    ab_two_text.innerHTML = str;
                    
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
            
                }
            });
        }
    }	
    function changeAbilityThree(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
        
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var champ_name_nospaces = champ_name.replace(" ", "");
                    champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                    
                    <!-- passive description -->
                    var ab_three_text = document.getElementById('abilitytext');
                    
                    var ab_three_title = document.getElementById('abilityname');
                    ab_three_title.innerHTML = json.data[champ_name].spells[2].name;
                    
                    <!-- replacing placeholder values with real data -->
                    var str = json.data[champ_name].spells[2].tooltip;
                    
                    str = str.replace(/{/g, '').replace(/}/g, '');
                    
                    var e_array = str.match(/[e][0-9]/g);
                    var f_array = str.match(/[f][0-9]/g);
                    var a_array = str.match(/[a][0-9]/g);
                    
                    var varslength;
                    
                    if(f_array != null && a_array != null){
                        varslength = f_array.length + a_array.length;
                    }
                    if(f_array == null && a_array != null){
                        varslength = a_array.length;
                    }
                    if(a_array == null && f_array != null){
                        varslength = f_array.length;
                    }
                    if(f_array == null && a_array == null){
                        varslength = 0;
                    }	
                    
                    if(e_array != null){
                        for(i=0; i < e_array.length; i++){

                            var e_array_two = [""];
                            e_array_two[i] = e_array[i].replace(/\D/g, '');
                            e_array_two[i] = Number(e_array_two[i]);
                            str = str.replace(e_array[i] , json.data[champ_name].spells[2].effectBurn[e_array_two[i]]);
                        }
                    }
                    
                    
                    if(f_array != null){
                        for(j=0; j < f_array.length; j++){
                            for(h=0; h < varslength; h++){
                                if(json.data[champ_name].spells[2].vars[h] != undefined){
                                    if(json.data[champ_name].spells[2].vars[h].key == f_array[j]){
                                        str = str.replace(f_array[j] , json.data[champ_name].spells[2].vars[h].coeff);
                                    }
                                }
                            }
                        }
                    }
                    
                    if(a_array != null){
                        
                        for(k=0; k < a_array.length; k++){
                            for(g=0; g < varslength; g++){
                                console.log(json.data[champ_name].spells[2].vars[g].key);
                                if(json.data[champ_name].spells[2].vars[g] != undefined){
                                    if(json.data[champ_name].spells[2].vars[g].key == a_array[k]){
                                        //str = str.replace(a_array[k] , json.data[champ_name].spells[2].vars[g].coeff);

                                        //setTimeout(getstats, 1000);
                                        var scaling=document.getElementById("abilitypower").innerHTML;
                                        scaling=scaling*json.data[champ_name].spells[2].vars[g].coeff;
                                        console.log(scaling);

                                        str = str.replace(a_array[k], scaling);
                                    }
                                }
                            }
                            
                        }
                    }
                    ab_three_text.innerHTML = str;
                    
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                
                }
            });
        }
    }	
    function changeAbilityFour(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
        
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var champ_name_nospaces = champ_name.replace(" ", "");
                    champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                    
                    <!-- passive description -->
                    var ab_four_text = document.getElementById('abilitytext');
                    
                    var ab_four_title = document.getElementById('abilityname');
                    ab_four_title.innerHTML = json.data[champ_name].spells[3].name;
                    
                    <!-- replacing placeholder values with real data -->
                    var str = json.data[champ_name].spells[3].tooltip;
                    
                    str = str.replace(/{/g, '').replace(/}/g, '');
                    
                    var e_array = str.match(/[e][0-9]/g);
                    var f_array = str.match(/[f][0-9]/g);
                    var a_array = str.match(/[a][0-9]/g);
                    
                    var varslength;
                    
                    if(f_array != null && a_array != null){
                        varslength = f_array.length + a_array.length;
                    }
                    if(f_array == null && a_array != null){
                        varslength = a_array.length;
                    }
                    if(a_array == null && f_array != null){
                        varslength = f_array.length;
                    }
                    if(f_array == null && a_array == null){
                        varslength = 0;
                    }	
                    
                    if(e_array != null){
                        for(i=0; i < e_array.length; i++){
                            console.log(e_array[i]);
                            var e_array_two = [""];
                            e_array_two[i] = e_array[i].replace(/\D/g, '');
                            e_array_two[i] = Number(e_array_two[i]);
                            str = str.replace(e_array[i] , json.data[champ_name].spells[3].effectBurn[e_array_two[i]]);
                        }
                    }
                    
                    
                    if(f_array != null){
                        for(j=0; j < f_array.length; j++){
                            for(h=0; h < varslength; h++){
                                if(json.data[champ_name].spells[3].vars[h] != undefined){
                                    if(json.data[champ_name].spells[3].vars[h].key == f_array[j]){
                                        str = str.replace(f_array[j] , json.data[champ_name].spells[3].vars[h].coeff);
                                    }
                                }
                            }
                        }
                    }
                    
                    if(a_array != null){
                        
                        for(k=0; k < a_array.length; k++){
                            for(g=0; g < varslength; g++){
                                if(json.data[champ_name].spells[3].vars[g] != undefined){
                                    if(json.data[champ_name].spells[3].vars[g].key == a_array[k]){
                                        //str = str.replace(a_array[k] , json.data[champ_name].spells[3].vars[g].coeff);

                                        //setTimeout(getstats, 1000);
                                        var scaling=document.getElementById("abilitypower").innerHTML;
                                        scaling=scaling*json.data[champ_name].spells[3].vars[g].coeff;
                                        console.log(scaling);

                                        str = str.replace(a_array[k], scaling);
                                    }
                                }
                            }
                            
                        }
                    }
                    ab_four_text.innerHTML = str;
                    
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    
                }
            });
        }	
    }

    /*display the shop*/
    function display_runes(){
    }
    
    function display_shop(){
        document.getElementById('inventory').style.display = 'inline-block';
        document.getElementById('shop').style.display = 'inline-block';
        document.getElementById('filterlist').style.display = 'inline-block';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        /*document.getElementById('runes').style.display = 'none';*/
        document.getElementById('gamedata').style.display = 'none';
        document.getElementById('gamedata2').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
    }

    function display_gamedata(){
        document.getElementById('inventory').style.display = 'none';
        document.getElementById('shop').style.display = 'none';
        document.getElementById('filterlist').style.display = 'none';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        /*document.getElementById('runes').style.display = 'none';*/
        document.getElementById('gamedata').style.display = 'block';
        document.getElementById('gamedata2').style.display = 'block';
        document.getElementById('datadescription').style.display = 'block';
    }

    function shop_filter(){
        $.ajax({
            url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                var shop_array = [];
                var item_info = [];
                var tag_info = [];
                var shop_array_modified = [];
                
                for(var key in json.data){
                    if(json.data.hasOwnProperty(key)){	
                        shop_array.push(key);
                        item_info.push(json.data[key]);
                        tag_info.push(json.data[key].tags);
                    }
                }	
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].maps["11"] == false){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].consumed == true){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsDistortion"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsCaptain"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsAlacrity"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsFuror"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                
                var check_health = document.getElementById('health_filter').checked;
                var check_MR = document.getElementById('MR_filter').checked;
                var check_armor = document.getElementById('armor_filter').checked;
                var check_AD = document.getElementById('AD_filter').checked;
                var check_AS = document.getElementById('AS_filter').checked;
                var check_crit = document.getElementById('crit_filter').checked;
                var check_lifesteal = document.getElementById('lifesteal_filter').checked;
                var check_AP = document.getElementById('AP_filter').checked;
                var check_CDR = document.getElementById('CDR_filter').checked;
                var check_mana = document.getElementById('mana_filter').checked;
                var check_mana_regen = document.getElementById('mana_regen_filter').checked;
                var check_MS = document.getElementById('MS_filter').checked;
                
                
                for(k=0; k < shop_array.length; k++){
                    if(check_health == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Health'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_MR == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'SpellBlock'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_armor == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Armor'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_AD == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Damage'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_AS == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'AttackSpeed'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_crit == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'CriticalStrike'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_lifesteal == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'LifeSteal'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_AP == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'SpellDamage'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_CDR == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'CooldownReduction'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_mana == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Mana'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_mana_regen == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'ManaRegen'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_MS == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'NonbootsMovement' || tag_info[k][tem] == 'Boots'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }



                    
                
                j=0;
                for(i=0; i<72; i++){
                    if(shop_array_modified[j] != undefined){
                        var num = i.toString();
                        var shop_icon_string = "shop_icon"
                        var shop_id = shop_icon_string.concat(num);
                        var item_url = "http://ddragon.leagueoflegends.com/cdn/5.23.1/img/item/";
                        var temp = shop_array_modified[j];
                        var mid_shop_array = temp.concat(".png");
                        
                        var shop_source = document.getElementById(shop_id);
                        shop_source.src = item_url.concat(mid_shop_array);
                        j++;
                    }else{
                        var num = i.toString();
                        var shop_icon_string = "shop_icon"
                        var shop_id = shop_icon_string.concat(num);
                        
                        var shop_source = document.getElementById(shop_id);
                        shop_source.src = "icons/EmptyIcon_Item.png";
                        j++;
                    }

                }
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error filtering the shop");
            }
        });
    }

    function add_inventory(){ 
        console.log('i got called!');
        var shop_image = document.getElementById(this.id);
        var clicked_image = shop_image.src;
        var iven_zero = document.getElementById('inventory_item0');
        var iven_one = document.getElementById('inventory_item1');
        var iven_two = document.getElementById('inventory_item2');
        var iven_three = document.getElementById('inventory_item3');
        var iven_four = document.getElementById('inventory_item4');
        var iven_five = document.getElementById('inventory_item5');
        
        var zero_src = iven_zero.src;
        var one_src = iven_one.src;
        var two_src = iven_two.src;
        var three_src = iven_three.src;
        var four_src = iven_four.src;
        var five_src = iven_five.src;

        var src_temp_zero = zero_src.substr(zero_src.length - 25, zero_src.length);
        var src_temp_one = one_src.substr(one_src.length - 25, one_src.length);
        var src_temp_two = two_src.substr(two_src.length - 25, two_src.length);
        var src_temp_three = three_src.substr(three_src.length - 25, three_src.length);
        var src_temp_four = four_src.substr(four_src.length - 25, four_src.length);
        var src_temp_five = five_src.substr(five_src.length - 25, five_src.length);
        
        var empty_item = "/icons/EmptyIcon_Item.png";
        if(src_temp_zero == empty_item){
            iven_zero.src = clicked_image;
        }else{
            if(src_temp_one == empty_item){
                iven_one.src = clicked_image;
            }else{
                if(src_temp_two == empty_item){
                    iven_two.src = clicked_image;
                }else{
                    if(src_temp_three == empty_item){
                        iven_three.src = clicked_image;
                    }else{
                        if(src_temp_four == empty_item){
                            iven_four.src = clicked_image;
                        }else{
                            if(src_temp_five == empty_item){
                                iven_five.src = clicked_image;
                            }
                        }
                    }
                }
            }	
        }

        var item_id = clicked_image;
        item_id = item_id.substr(item_id.length - 8);
        item_id = item_id.slice(0,4);

        console.log(item_id);
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + item_id + "?itemData=all&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184";

        $.ajax({
            url:  item_url,
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {  
                if(json.stats.hasOwnProperty('FlatArmorMod')){
                    console.log("yay i did it");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            }
        });
    }
    
    function update_gamedata(){
    }
    
    function remove_inventory(){
        var inven_image = document.getElementById(this.id);
        var image_source = inven_image.src;
        inven_image.src = "icons/EmptyIcon_Item.png";
        
        var remove_id = image_source;
        remove_id = remove_id.substr(remove_id.length - 8);
        remove_id = remove_id.slice(0,4);
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + remove_id + "?itemData=all&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184";

        <!-- will be used to send item information to the database -->
        $.ajax({
            url:  item_url,
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {	
                //console.log(json.stats); <!-- you can post the stats and gold, and they should have everything we need besides unique passive stats, but screw those-->
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            }
        });
    }

    function item_stats(){
        console.log("guess who was called?");
        var inven_image = document.getElementById(this.id);
        var image_source = inven_image.src;
        
        var stats = document.getElementById('hoverinfo');
            
        var item_id = image_source;
        item_id = item_id.substr(item_id.length - 8);
        item_id = item_id.slice(0,4);
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + item_id + "?itemData=all&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184";
        
        
        var src_temp = image_source.substr(image_source.length - 25, image_source.length);

            
        
        if(src_temp != "/icons/EmptyIcon_Item.png"){
            $.ajax({
                url:  item_url,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {	
                    //console.log(json.gold.total);
                    stats.innerHTML = "Gold: " + json.gold.total + "      |      " + json.sanitizedDescription;
                    if(json.stats.hasOwnProperty('FlatArmorMod')){
                        console.log("yay i did it");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Summoner data!");
                }
            });
        }else{
            stats.innerHTML = "Empty Item Slot"
        }
    }
})();
