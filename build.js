
(function() {

    var champion = window.localStorage.getItem('champname');

    var re = /(\b[a-z](?!\s))/g; 
    console.log(champion);
    champion = champion.toLowerCase();
    champion = champion.replace(/'+/g, '');
    champion = champion.replace(/\s/g, '');
    champion = champion.replace(re, function(x){return x.toUpperCase();});

    console.log(champion);
    document.getElementById('champsearch2').value = champion;
    
    var name = champion;
    var icon = document.getElementById('champicon');
    
    //need to grab latest patch number and insert here
    var icon_url = "https://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/";
    var almost = name.concat(".png");
    icon.src = icon_url.concat(almost);
    
    //splash art
    var splash_url = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
    almost = name.concat("_0.jpg");
    splash_url = splash_url.concat(almost);
    document.getElementById('bgimg').src = splash_url;

    //Event Handlers
    document.getElementById('champsearch2form').addEventListener('submit', function(e) { on_search(e);});
    var filters = document.getElementsByClassName('filter');
    for(var i = 0; i < filters.length; i++){
        filters[i].addEventListener('click', shop_filter);
    }
    var gameinputs = document.getElementsByClassName('gamedatainput');
    for(var i = 0; i < gameinputs.length; i++){
        gameinputs[i].addEventListener('keypress', update_gamedata);
    }
    document.getElementById('nav3').addEventListener('click', display_runes);
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
    var rune_handlers = document.getElementsByClassName('runeselect');
    for(var i = 0; i < rune_handlers.length; i++){
        rune_handlers[i].id = 'runeselect' + i;
        rune_handlers[i].addEventListener('click', highlight_rune);
        if(rune_handlers[i].innerHTML === '0'){
            rune_handlers[i].style.border = '1px solid #f2f2f2';
        }
    }
    var level_handlers = document.getElementsByClassName('levelselect');
    for(var i = 0; i < level_handlers.length; i++){
        level_handlers[i].id = 'levelselect' + i;
        level_handlers[i].addEventListener('click', highlight_level);
        if(level_handlers[i].innerHTML === '0'){
            level_handlers[i].style.border = '1px solid #f2f2f2';
        }
    }
    
    //get the full item json from ddragon
    var item_json;
    
    $.ajax({
        url:  'https://ddragon.leagueoflegends.com/cdn/6.12.1/data/en_US/item.json',
        type: 'GET',
        dataType: 'json',
        data: {
            
        },
        success: function (json) {
            item_json = json;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
    
    //get the full champion json from Riot API
    var passive_json;
    $.ajax({
        url:  'https://theonebuild-env.us-west-2.elasticbeanstalk.com/passive/',
        type: 'GET',
        dataType: 'json',
        data: {
            
        },
        success: function (json) {
            passive_json = json;
            change_passive(passive_json);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
    
    var ability_json;
    $.ajax({
        url:  'https://theonebuild-env.us-west-2.elasticbeanstalk.com/spells/',
        type: 'GET',
        dataType: 'json',
        data: {
            
        },
        success: function (json) {
            ability_json = json;
            change_abilities(ability_json);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
    
    document.getElementById('passiveicon').addEventListener('click', clickPassive);
    document.getElementById('abilityoneicon').addEventListener('click', changeAbilityOne);
    document.getElementById('abilitytwoicon').addEventListener('click', changeAbilityTwo);
    document.getElementById('abilitythreeicon').addEventListener('click', changeAbilityThree);
    document.getElementById('abilityfouricon').addEventListener('click', changeAbilityFour);

    document.getElementById('blue_sentinel').addEventListener('change', function(){update_gamedata("blue_sentinel");});
    document.getElementById('hand_of_baron').addEventListener('change', function(){update_gamedata("hand_of_baron");});
    document.getElementById('elder_dragon').addEventListener('change', function(){update_gamedata("elder_dragon");});
    
    document.getElementById('kills').addEventListener('keyup', sum_gold);
    document.getElementById('assists').addEventListener('keyup', sum_gold);
    document.getElementById('minionkills').addEventListener('keyup', sum_gold);
    document.getElementById('barons').addEventListener('keyup', sum_gold);
    document.getElementById('riftheralds').addEventListener('keyup', sum_gold);
    document.getElementById('gametime').addEventListener('keyup', sum_gold);
    document.getElementById('towers').addEventListener('keyup', sum_gold);
    document.getElementById('jungleclears').addEventListener('keyup', sum_gold);
    console.log(document.getElementById('kills').value);
    
    //Variables for tracking the stats
    var rune_health = 0;
    var rune_healthreg = 0;
    var rune_healthpercent = 0;
    var rune_mana = 0;
    var rune_manareg = 0;
    var rune_ad = 0;
    var rune_as = 0;
    var rune_crit = 0;
    var rune_ap = 0;
    var rune_magpen = 0;
    var rune_percentmagpen = 0;
    var rune_armorpen = 0;
    var rune_percentarmorpen = 0;
    var rune_cdr = 0;
    var rune_percentms = 0;
    var rune_mr = 0;
    var rune_armor = 0;
    var rune_quint_ap = 0;
    var rune_quint_armor = 0;
    var rune_quint_cdr = 0;
    var rune_quint_gold = 0;
    var rune_quint_health = 0;
    var rune_quint_healthreg = 0;
    var rune_quint_mana = 0;
    var rune_quint_manareg = 0;
    var rune_quint_percenthealth = 0;
    var rune_quint_exp = 0;
    var rune_quint_lifesteal = 0;
    var rune_quint_ms = 0;
    var rune_quint_revival = 0;
    var rune_quint_spellvamp = 0;

    var item_health = 0;
    var item_healthreg = 0;
    var item_mana = 0;
    var item_manareg = 0;
    var item_ad = 0;
    var item_as = 0;
    var item_crit = 0;
    var item_ap = 0;
    var item_magpen = 0;
    var item_percentmagpen = 0;
    var item_armorpen = 0;
    var item_percentarmorpen = 0;
    var item_cdr = 0;
    var item_ms = 0;
    var item_percentms = 0;
    var item_mr = 0;
    var item_armor = 0;

    var base_health = 0;
    var base_healthreg = 0;
    var base_mana = 0;
    var base_manareg = 0;
    var base_ad = 0;
    var base_crit = 0;
    var base_ms = 0;
    var base_mr = 0;
    var base_armor = 0;

    var health_per_level = 0;
    var mana_per_level = 0;
    var ad_per_level = 0;
    var manareg_per_level = 0;
    var mr_per_level = 0;
    var as_per_level = 0;
    var healthreg_per_level = 0;
    var armor_per_level = 0;
    var attack_speed_offset = 0;

    var attack_speed_offset_val = 0.625;

    var level = 1;

    //get all the information from the api and display it
    get_base_stats();
    initializeShop();
    
    
    //Game Data Variables 59.4 44.4
    var kill_worth = 300;
    var assist_worth = 125; //50% of kill gold split among everyone who got an assist
    var melee_worth = 19.8;
    var caster_worth = 14.8;
    var siege_worth = 40;
    var baron_worth = 300;
    var riftherald_worth = 50;
    var tower_worth = 125;
    var jungleclear_worth = 402; // does not include red or blue
    var avgminion_worth = 20.54;
    var start_gold = 500;
    var gold_generation = 20.4 / 10; // 20.4 per 10 seconds
    
    function sum_gold(){
        var temp = document.getElementById('kills').value;
        var num_kills = document.getElementById('kills').value;
        var num_assist = document.getElementById('assists').value;
        var num_minions = document.getElementById('minionkills').value;
        var num_barons = document.getElementById('barons').value;
        var num_riftheralds = document.getElementById('riftheralds').value;
        var gametime = document.getElementById('gametime').value;
        var num_towers = document.getElementById('towers').value;
        var num_jungleclears = document.getElementById('jungleclears').value;
        
        var split_gametimes = gametime.split(':');
        var gametime_sec = (split_gametimes[0] * 60) + split_gametimes[1];
        var total_gold;
        if(isNaN(gametime_sec) === false){
            total_gold = start_gold + (kill_worth * num_kills) + (assist_worth * num_assist) + (avgminion_worth * num_minions) + (baron_worth * num_barons) + (riftherald_worth * num_riftheralds) + (gold_generation * gametime_sec) + (tower_worth * num_towers) + (jungleclear_worth * num_jungleclears);
        }else{
            total_gold = start_gold + (kill_worth * num_kills) + (assist_worth * num_assist) + (avgminion_worth * num_minions) + (baron_worth * num_barons) + (riftherald_worth * num_riftheralds) + (tower_worth * num_towers) + (jungleclear_worth * num_jungleclears);
        }
        console.log(total_gold);
        
        var html_gold = document.getElementsByClassName('goldamt');
        if(isNaN(total_gold) === false){
            total_gold = Math.floor(total_gold);
            for(var i = 0; i < html_gold.length; i++){
                html_gold[i].innerHTML = total_gold;
            }
        }
    }

    var blue_sentinel_ap_percent = .15;
    var blue_sentinel_cdr = 10;
    var blue_sentinel_mana_regen = 1;

    var baron_ad_and_ap = 40;

    //flag for percentage increase
    var blue_buff, ap_before_percentage = 0;

    function initializeShop(){
        $.ajax({
            url:  'https://ddragon.leagueoflegends.com/cdn/6.12.1/data/en_US/item.json',
            type: 'GET',
            dataType: 'json',
            data: {
                
            },
            success: function (json) {
                item_json = json;
                var shop_array = [];
                var item_info = [];
                
                for(var key in item_json.data){
                    if(item_json.data.hasOwnProperty(key)){	
                        shop_array.push(key);
                        item_info.push(item_json.data[key]);
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
                for(i=0; i<56; i++){
                    var num = i.toString();
                    var shop_icon_string = "shop_icon"
                    var shop_id = shop_icon_string.concat(num);
                    var item_url = "https://ddragon.leagueoflegends.com/cdn/6.10.1/img/item/";
                    var temp = shop_array[j];
                    
                    var mid_shop_array = temp.concat(".png");
                    var shop_source = document.getElementById(shop_id);

                    if(i < shop_array.length){
                        shop_source.src = item_url.concat(mid_shop_array);
                    } else {
                        shop_source.src = "Pictures/emptyitemicon.png";
                        console.log(shop_source.src);
                    }
                    j++;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                
            }
        });
        
    }

    function on_search(e){
        //champion icon
        console.log(document.getElementById('champsearch2'));
        var champname = document.getElementById('champsearch2').value;
        var re = /(\b[a-z](?!\s))/g; 
        champname = champname.replace(re, function(x){return x.toUpperCase();});
        if(champname == 'cocaine'){
            champname = document.getElementById('champsearch').value;
            document.getElementById('champsearch2').value = champname;
        }
        var name = champname;
        var icon = document.getElementById('champicon');
        
        //need to grab latest patch number and insert here
        var icon_url = "https://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/";
        var almost = name.concat(".png");
        icon.src = icon_url.concat(almost);
        
        //splash art
        var splash_url = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
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
        
        window.localStorage.setItem('champname', document.getElementById('champsearch2').value);
    }

    
    function update_stats(){
        console.log(as_per_level);
        document.getElementById("health").innerHTML = (rune_health + rune_quint_health + item_health + base_health + ((level-1) * health_per_level)).toFixed(2);
        document.getElementById("healthregen").innerHTML = (rune_healthreg + rune_quint_healthreg + item_healthreg + base_healthreg + ((level-1) * healthreg_per_level)).toFixed(2);
        document.getElementById("mana").innerHTML = (rune_mana + rune_quint_mana + item_mana + base_mana + ((level-1) * mana_per_level)).toFixed(2);
        document.getElementById("manaregen").innerHTML = (rune_manareg + rune_quint_manareg + item_manareg + base_manareg + ((level-1) * manareg_per_level)).toFixed(2);
        document.getElementById("attackdamage").innerHTML = (rune_ad + item_ad + base_ad + ((level-1) * ad_per_level)).toFixed(2);
        document.getElementById("attackspeed").innerHTML = (rune_as + item_as + ((level-1) * as_per_level) + attack_speed_offset_val/(1 + attack_speed_offset)).toFixed(2);
        document.getElementById("criticalchance").innerHTML = (rune_crit + item_crit + base_crit).toFixed(2);
        document.getElementById("abilitypower").innerHTML = (rune_ap + rune_quint_ap + item_ap).toFixed(2);
        document.getElementById("magicpen").innerHTML = (rune_magpen + item_magpen).toFixed(2);
        document.getElementById("percentmagicpen").innerHTML = (rune_percentmagpen + item_percentmagpen).toFixed(2);
        document.getElementById("armorpen").innerHTML = (rune_armorpen + item_armorpen).toFixed(2);
        document.getElementById("percentarmorpen").innerHTML = (rune_percentarmorpen + item_percentarmorpen).toFixed(2);
        document.getElementById("cooldownreduction").innerHTML = (rune_cdr + rune_quint_cdr + item_cdr).toFixed(2);
        document.getElementById("movespeed").innerHTML = (base_ms).toFixed(2);
        document.getElementById("magicresist").innerHTML = (rune_mr + item_mr + base_mr + ((level-1) * mr_per_level)).toFixed(2);
        document.getElementById("armor").innerHTML = (rune_armor + rune_quint_armor + item_armor + base_armor + ((level-1) * armor_per_level)).toFixed(2);
    }

    
    function get_base_stats(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        console.log(champ_name);
        var champname_nospaces = champ_name.replace(" ", "");
        champname_nospaces = champname_nospaces.toLowerCase().trim();
        $.ajax({
            url:  'https://ddragon.leagueoflegends.com/cdn/6.12.1/data/en_US/champion.json',
            type: 'GET',
            dataType: 'json',
            data: {
                
            },
            success: function (json) {
                champ_json = json;
                pass = champ_json.data[champ_name].stats;
                console.log(pass);

                var stats = {attackrange:"0",mpperlevel:"0",mp:"0",attackdamage:"0",hp:"0",hpperlevel:"0",attackdamageperlevel:"0",armor:"0",mpregenperlevel:"0",
                             hpregen:"0",critperlevel:"0",spellblockperlevel:"0",mpregen:"0",
                             attackspeedperlevel:"0",spellblock:"0",movespeed:"0",attackspeedoffset:"0",crit:"0",hpregenperlevel:"0",armorperlevel:"0"};

                for(var property in stats)
                {
                    if(stats.hasOwnProperty(property))
                    {
                        stats[property]=champ_json.data[champ_name].stats[property];
                    }
                }
                
                mana_per_level = Math.round(stats.mpperlevel);
                base_mana = Math.round(stats.mp);
                base_ad = Math.round(stats.attackdamage);
                base_health = Math.round(stats.hp);
                health_per_level = Math.round(stats.hpperlevel);
                ad_per_level = Math.round(stats.attackdamageperlevel);
                base_armor = Math.round(stats.armor);
                manareg_per_level = Math.round(stats.mpregenperlevel);
                base_healthreg = Math.round(stats.hpregen);
                mr_per_level = Math.round(stats.spellblockperlevel);
                base_manareg = Math.round(stats.mpregen);
                as_per_level = Math.round(stats.attackspeedperlevel);
                as_per_level = as_per_level/100;
                base_mr = Math.round(stats.spellblock);
                base_ms = Math.round(stats.movespeed);
                base_critchance = Math.round(stats.crit);
                healthreg_per_level = Math.round(stats.hpregenperlevel);
                armor_per_level = Math.round(stats.armorperlevel);
                attack_speed_offset = Math.round(stats.attackspeedoffset);
                update_stats();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                
            }
        });
    }

    function change_passive(json){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
            var champ_name_nospaces = champ_name.replace(" ", "");
            champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
            
            <!-- changing passive icon -->
            pass = json.data[champ_name].passive.image.full;
            console.log(pass);
            
            var passive = document.getElementById('passiveicon');
            
            var passive_url = "https://ddragon.leagueoflegends.com/cdn/5.23.1/img/passive/";
            var almost_two = pass.concat(".png");
            passive.src = passive_url.concat(pass);
            
            <!-- passive description -->
            var pass_text = document.getElementById('abilitytext');
            pass_text.innerHTML = json.data[champ_name].passive.description;
            
            var pass_title = document.getElementById('abilityname');
            pass_title.innerHTML = json.data[champ_name].passive.name;
        }
    }

    function change_abilities(json){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        var champ_name_nospaces = champ_name.replace(" ", "");
        champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
        
        
        var abilities= ["", "", "", ""];
        for(i=0; i<4; i++){

            abilities[i] = json.data[champ_name].spells[i].image.full;
            console.log(abilities[i]);
        }
        
        
        
        var ability_url = "https://ddragon.leagueoflegends.com/cdn/5.23.1/img/spell/"
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
    }
    
    function clickPassive(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){	
            var champ_name_nospaces = champ_name.replace(" ", "");
            champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();

            <!-- passive description -->
            var pass_text = document.getElementById('abilitytext');
            pass_text.innerHTML = passive_json.data[champ_name].passive.description;
                        
            var pass_title = document.getElementById('abilityname');
            pass_title.innerHTML = passive_json.data[champ_name].passive.name;
        }				
    }
            
    function changeAbilityOne(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
            var champ_name_nospaces = champ_name.replace(" ", "");
            champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
                        
                        
            <!-- ability description -->			
            var ab_one_text = document.getElementById('abilitytext');
            
            var ab_one_title = document.getElementById('abilityname');
            ab_one_title.innerHTML = ability_json.data[champ_name].spells[0].name;
                        
            <!-- replacing placeholder values with real data -->
            var str = ability_json.data[champ_name].spells[0].tooltip;			
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
                    str = str.replace(e_array[i] , ability_json.data[champ_name].spells[0].effectBurn[e_array_two[i]]);
                }
            }
            
            
            if(f_array != null){
                for(j=0; j < f_array.length; j++){
                    for(h=0; h < varslength; h++){
                        if(json.data[champ_name].spells[0].vars[h] != undefined){
                            if(json.data[champ_name].spells[0].vars[h].key == f_array[j]){
                                str = str.replace(f_array[j] , ability_json.data[champ_name].spells[0].vars[h].coeff);
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
                        if(ability_json.data[champ_name].spells[0].vars[g] != undefined){
                            if(ability_json.data[champ_name].spells[0].vars[g].key == a_array[k]){
                                //str = str.replace(a_array[k] , json.data[champ_name].spells[0].vars[g].coeff);

                                var scaling=document.getElementById("abilitypower").innerHTML;
                                scaling=scaling*ability_json.data[champ_name].spells[0].vars[g].coeff;
                                console.log(scaling);

                                str = str.replace(a_array[k], scaling);
                            }
                        }
                    }
                    
                }
            }
            ab_one_text.innerHTML = str;
        }
    }	
    function changeAbilityTwo(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
            var champ_name_nospaces = champ_name.replace(" ", "");
            champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
            
            <!-- passive description -->
            var ab_two_text = document.getElementById('abilitytext');
            
            var ab_two_title = document.getElementById('abilityname');
            ab_two_title.innerHTML = ability_json.data[champ_name].spells[1].name;
            
            
            <!-- replacing placeholder values with real data -->
            var str = ability_json.data[champ_name].spells[1].tooltip;
            
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
                    str = str.replace(e_array[i] , ability_json.data[champ_name].spells[1].effectBurn[e_array_two[i]]);
                }
            }
            
            
            if(f_array != null){
                for(j=0; j < f_array.length; j++){
                    for(h=0; h < varslength; h++){
                        if(ability_json.data[champ_name].spells[1].vars[h] != undefined){
                            if(ability_json.data[champ_name].spells[1].vars[h].key == f_array[j]){
                                str = str.replace(f_array[j] , ability_json.data[champ_name].spells[1].vars[h].coeff);
                            }
                        }
                    }
                }
            }
            
            if(a_array != null){
                
                for(k=0; k < a_array.length; k++){
                    for(g=0; g < varslength; g++){
                        if(ability_json.data[champ_name].spells[1].vars[g] != undefined){
                            if(ability_json.data[champ_name].spells[1].vars[g].key == a_array[k]){
                                //str = str.replace(a_array[k] , json.data[champ_name].spells[1].vars[g].coeff);

                                var scaling=document.getElementById("abilitypower").innerHTML;
                                scaling=scaling*ability_json.data[champ_name].spells[1].vars[g].coeff;
                                console.log(scaling);

                                str = str.replace(a_array[k], scaling);
                            }
                        }
                    }
                    
                }
            }
            ab_two_text.innerHTML = str;
        }
    }	
    function changeAbilityThree(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
            var champ_name_nospaces = champ_name.replace(" ", "");
            champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
            
            <!-- passive description -->
            var ab_three_text = document.getElementById('abilitytext');
            
            var ab_three_title = document.getElementById('abilityname');
            ab_three_title.innerHTML = ability_json.data[champ_name].spells[2].name;
            
            <!-- replacing placeholder values with real data -->
            var str = ability_json.data[champ_name].spells[2].tooltip;
            
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
                    str = str.replace(e_array[i] , ability_json.data[champ_name].spells[2].effectBurn[e_array_two[i]]);
                }
            }
            
            
            if(f_array != null){
                for(j=0; j < f_array.length; j++){
                    for(h=0; h < varslength; h++){
                        if(ability_json.data[champ_name].spells[2].vars[h] != undefined){
                            if(ability_json.data[champ_name].spells[2].vars[h].key == f_array[j]){
                                str = str.replace(f_array[j] , ability_json.data[champ_name].spells[2].vars[h].coeff);
                            }
                        }
                    }
                }
            }
            
            if(a_array != null){
                
                for(k=0; k < a_array.length; k++){
                    for(g=0; g < varslength; g++){
                        if(ability_json.data[champ_name].spells[2].vars[g] != undefined){
                            if(ability_json.data[champ_name].spells[2].vars[g].key == a_array[k]){
                                //str = str.replace(a_array[k] , json.data[champ_name].spells[2].vars[g].coeff);

                                //setTimeout(getstats, 1000);
                                var scaling=document.getElementById("abilitypower").innerHTML;
                                scaling=scaling*ability_json.data[champ_name].spells[2].vars[g].coeff;
                                console.log(scaling);

                                str = str.replace(a_array[k], scaling);
                            }
                        }
                    }
                    
                }
            }
            ab_three_text.innerHTML = str;
        }
    }	
    function changeAbilityFour(){
        var champ_name = "";
        champ_name = $("#champsearch2").val();
        var re = /(\b[a-z](?!\s))/g; 
        champ_name = champ_name.replace(re, function(x){return x.toUpperCase();});
        if(champ_name=="cocaine"){
            champ_name = $("#champsearch").val();
        }
        if(champ_name !== ""){
            var champ_name_nospaces = champ_name.replace(" ", "");
            champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
            
            <!-- passive description -->
            var ab_four_text = document.getElementById('abilitytext');
            
            var ab_four_title = document.getElementById('abilityname');
            ab_four_title.innerHTML = ability_json.data[champ_name].spells[3].name;
            
            <!-- replacing placeholder values with real data -->
            var str = ability_json.data[champ_name].spells[3].tooltip;
            
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
                    str = str.replace(e_array[i] , ability_json.data[champ_name].spells[3].effectBurn[e_array_two[i]]);
                }
            }
            
            
            if(f_array != null){
                for(j=0; j < f_array.length; j++){
                    for(h=0; h < varslength; h++){
                        if(ability_json.data[champ_name].spells[3].vars[h] != undefined){
                            if(ability_json.data[champ_name].spells[3].vars[h].key == f_array[j]){
                                str = str.replace(f_array[j] , ability_json.data[champ_name].spells[3].vars[h].coeff);
                            }
                        }
                    }
                }
            }
            
            if(a_array != null){
                
                for(k=0; k < a_array.length; k++){
                    for(g=0; g < varslength; g++){
                        if(ability_json.data[champ_name].spells[3].vars[g] != undefined){
                            if(ability_json.data[champ_name].spells[3].vars[g].key == a_array[k]){
                                //str = str.replace(a_array[k] , json.data[champ_name].spells[3].vars[g].coeff);

                                //setTimeout(getstats, 1000);
                                var scaling=document.getElementById("abilitypower").innerHTML;
                                scaling=scaling*ability_json.data[champ_name].spells[3].vars[g].coeff;
                                console.log(scaling);

                                str = str.replace(a_array[k], scaling);
                            }
                        }
                    }
                    
                }
            }
            ab_four_text.innerHTML = str;
        }	
    }

    /*display the shop*/
    function display_runes(){
        console.log('hey');
        document.getElementById('inventory').style.display = 'none';
        document.getElementById('shop').style.display = 'none';
        document.getElementById('filterlist').style.display = 'none';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        document.getElementById('runes').style.display = 'inline-block';
        document.getElementById('gamedata').style.display = 'none';
        document.getElementById('gamedata2').style.display = 'none';
        document.getElementById('gamedatabuffs').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
        document.getElementById('gold1').style.display = 'none';
        document.getElementById('gold2').style.display = 'none';
        
    }
    
    function display_shop(){
        document.getElementById('inventory').style.display = 'inline-block';
        document.getElementById('shop').style.display = 'inline-block';
        document.getElementById('filterlist').style.display = 'inline-block';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        document.getElementById('runes').style.display = 'none';
        document.getElementById('gamedata').style.display = 'none';
        document.getElementById('gamedata2').style.display = 'none';
        document.getElementById('gamedatabuffs').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
        document.getElementById('gold1').style.display = 'inline-block';
        document.getElementById('gold2').style.display = 'none';
    }

    function display_gamedata(){
        document.getElementById('inventory').style.display = 'none';
        document.getElementById('shop').style.display = 'none';
        document.getElementById('filterlist').style.display = 'none';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        document.getElementById('runes').style.display = 'none';
        document.getElementById('gamedata').style.display = 'inline-block';
        document.getElementById('gamedata2').style.display = 'inline-block';
        document.getElementById('gamedatabuffs').style.display = 'inline-block';
        document.getElementById('datadescription').style.display = 'inline-block';
        document.getElementById('gold1').style.display = 'none';
        document.getElementById('gold2').style.display = 'inline-block';
    }

    function shop_filter(){
        var shop_array = [];
        var item_info = [];
        var tag_info = [];
        var shop_array_filtered = [];
        var checked_boxes = [];
        
        for(var key in item_json.data){
            if(item_json.data.hasOwnProperty(key)){	
                shop_array.push(key);
                item_info.push(item_json.data[key]);
                tag_info.push(item_json.data[key].tags);
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
        
        if(check_health == true){
            checked_boxes.push('Health');
        }
        if(check_MR == true){
            checked_boxes.push('SpellBlock');
        }
        if(check_armor == true){
            checked_boxes.push('Armor');
        }
        if(check_AD == true){
            checked_boxes.push('Damage');
        }
        if(check_AS == true){
            checked_boxes.push('AttackSpeed');
        }
        if(check_crit == true){
            checked_boxes.push('CriticalStrike');
        }
        if(check_lifesteal == true){
            checked_boxes.push('LifeSteal');
        }
        if(check_AP == true){
            checked_boxes.push('SpellDamage');
        }
        if(check_CDR == true){
            checked_boxes.push('CooldownReduction');
        }
        if(check_mana == true){
            checked_boxes.push('Mana');
        }
        if(check_mana_regen == true){
            checked_boxes.push('ManaRegen');
        }
        if(check_MS == true){
            checked_boxes.push('MoveSpeed')
        }

        for(k=0; k < shop_array.length; k++){
            var track = 0;
            for(j=0; j < checked_boxes.length; j++){
                for(var prop in tag_info[k]){
                    if(checked_boxes[j] !== 'MoveSpeed'){
                        if(checked_boxes[j] === tag_info[k][prop]){
                            track = track + 1;
                        }
                    } else {
                        if(tag_info[k][prop] === 'NonbootsMovement' || tag_info[k][prop] == 'Boots'){
                            track = track + 1;  
                        }
                    }
                }
            }
            if(track === checked_boxes.length){
                shop_array_filtered.push(shop_array[k]);
            }
        }

        j=0;
        for(i=0; i<56; i++){
            if(shop_array_filtered[j] != undefined){
                console.log(shop_array_filtered[j])
                var num = i.toString();
                var shop_icon_string = "shop_icon"
                var shop_id = shop_icon_string.concat(num);
                var item_url = "https://ddragon.leagueoflegends.com/cdn/6.10.1/img/item/";
                var temp = shop_array_filtered[j];
                var mid_shop_array = temp.concat(".png");
                
                var shop_source = document.getElementById(shop_id);
                shop_source.src = item_url.concat(mid_shop_array);
                j++;
            }else{
                var num = i.toString();
                var shop_icon_string = "shop_icon"
                var shop_id = shop_icon_string.concat(num);
                
                var shop_source = document.getElementById(shop_id);
                shop_source.src = "Pictures/emptyitemicon.png";
                j++;
            }

        }
    }

    //Adds and item to the inventory and subtracts the gold from the gold total
    // -- updated to not need an api call
    function add_inventory(){ 
        var item_bought = false;
        var shop_image = document.getElementById(this.id);
        var clicked_image = shop_image.src;
        
        var item_id = clicked_image;
        item_id = item_id.substr(item_id.length - 8);
        item_id = item_id.slice(0,4);
        
        
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + item_id + "?itemData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a";
        
        var item_cost;
        item_cost = item_json.data[item_id].gold.total;
        var iven_zero = document.getElementById('inventory_item0');
        var iven_one = document.getElementById('inventory_item1');
        var iven_two = document.getElementById('inventory_item2');
        var iven_three = document.getElementById('inventory_item3');
        var iven_four = document.getElementById('inventory_item4');
        var iven_five = document.getElementById('inventory_item5');
        
        var gold_temp = [];
        var gold_totals = document.getElementsByClassName('goldamt');
        for(var i = 0; i < gold_totals.length; i++){
            gold_temp[i] = gold_totals[i].innerHTML;
            gold_temp[i] = parseInt(gold_temp[i], 10);
        }
        
        var zero_src = iven_zero.src;
        var one_src = iven_one.src;
        var two_src = iven_two.src;
        var three_src = iven_three.src;
        var four_src = iven_four.src;
        var five_src = iven_five.src;

        var src_temp_zero = zero_src.substr(zero_src.length - 26, zero_src.length);
        var src_temp_one = one_src.substr(one_src.length - 26, one_src.length);
        var src_temp_two = two_src.substr(two_src.length - 26, two_src.length);
        var src_temp_three = three_src.substr(three_src.length - 26, three_src.length);
        var src_temp_four = four_src.substr(four_src.length - 26, four_src.length);
        var src_temp_five = five_src.substr(five_src.length - 26, five_src.length);
        
        var empty_item = "Pictures/emptyitemicon.png";
        if((gold_temp[0] - item_cost) >= 0){
            if(src_temp_zero == empty_item){
                iven_zero.src = clicked_image;
                item_bought = true;
            }else{
                if(src_temp_one == empty_item){
                    iven_one.src = clicked_image;
                    item_bought = true;
                }else{
                    if(src_temp_two == empty_item){
                        iven_two.src = clicked_image;
                        item_bought = true;
                    }else{
                        if(src_temp_three == empty_item){
                            iven_three.src = clicked_image;
                            item_bought = true;
                        }else{
                            if(src_temp_four == empty_item){
                                iven_four.src = clicked_image;
                                item_bought = true;
                            }else{
                                if(src_temp_five == empty_item){
                                    iven_five.src = clicked_image;
                                    item_bought = true;
                                }
                            }
                        }
                    }
                }	
            }
        }

        if(item_bought === true){
            for(var i = 0; i < gold_totals.length; i++){
                gold_totals[i].innerHTML = gold_temp[i] - item_cost;
            }

            if(item_json.data[item_id].stats.hasOwnProperty('FlatArmorMod')){
                console.log(item_json.data[item_id].stats.FlatArmorMod);
                document.getElementById('armor').innerHTML = Number(document.getElementById('armor').innerHTML) + item_json.data[item_id].stats.FlatArmorMod;
            }
            if(item_json.data[item_id].stats.hasOwnProperty('FlatHPPoolMod')){
                document.getElementById('health').innerHTML = Number(document.getElementById('health').innerHTML) + item_json.data[item_id].stats.FlatHPPoolMod;
            }
            if(item_json.data[item_id].stats.hasOwnProperty('FlatMPPoolMod')){
                document.getElementById('mana').innerHTML = Number(document.getElementById('mana').innerHTML) + item_json.data[item_id].stats.FlatMPPoolMod;
            }

            //base percent modifications
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatHPRegenMod')){
                document.getElementById('healthregen').innerHTML = Number(document.getElementById('healthregen').innerHTML) + item_json.data[item_id].stats.FlatHPRegenMod;
            }
            if(item_json.data[item_id].stats.hasOwnProperty('FlatMPRegenMod')){
                document.getElementById('manaregen').innerHTML = Number(document.getElementById('manaregen').innerHTML) + item_json.data[item_id].stats.FlatMPRegenMod;
            }*/

            if(item_json.data[item_id].stats.hasOwnProperty('FlatPhysicalDamageMod')){
                document.getElementById('attackdamage').innerHTML = Number(document.getElementById('attackdamage').innerHTML) + item_json.data[item_id].stats.FlatPhysicalDamageMod;
            }

            //attack speed
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatMPPoolMod')){
                document.getElementById('mana').innerHTML = Number(document.getElementById('mana').innerHTML) + item_json.data[item_id].stats.FlatMPPoolMod;
            }*/

            if(item_json.data[item_id].stats.hasOwnProperty('FlatCritChanceMod')){
                document.getElementById('criticalchance').innerHTML = Number(document.getElementById('criticalchance').innerHTML) + item_json.data[item_id].stats.FlatCritChanceMod;
            }
            if(item_json.data[item_id].stats.hasOwnProperty('FlatMagicDamageMod')){
                document.getElementById('abilitypower').innerHTML = Number(document.getElementById('abilitypower').innerHTML) + item_json.data[item_id].stats.FlatMagicDamageMod;
            }

            //penetration and cooldown reduction values are not given in the stats table, even those that aren't unique passives
            //could just grab the stats from the sanitized description
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatMagicDamageMod')){
                document.getElementById('abilitypower').innerHTML = Number(document.getElementById('abilitypower').innerHTML) + item_json.data[item_id].stats.FlatMagicDamageMod;
            }*/

            if(item_json.data[item_id].stats.hasOwnProperty('FlatMovementSpeedMod')){
                document.getElementById('movespeed').innerHTML = Number(document.getElementById('movespeed').innerHTML) + item_json.data[item_id].stats.FlatMovementSpeedMod;
            }

            //percent movespeed
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatMagicDamageMod')){
                document.getElementById('abilitypower').innerHTML = Number(document.getElementById('abilitypower').innerHTML) + item_json.data[item_id].stats.FlatMagicDamageMod;
            }*/

            if(item_json.data[item_id].stats.hasOwnProperty('FlatSpellBlockMod')){
                document.getElementById('magicresist').innerHTML = Number(document.getElementById('magicresist').innerHTML) + item_json.data[item_id].stats.FlatSpellBlockMod;
            }
        }
        
        
    }
    
    function update_gamedata(dataName){

        /************ handle gold addition here ****************/

        if(blue_buff){
            ap_before_percentage = Number(document.getElementById("abilitypower").innerHTML) - ap_before_percentage * Number(blue_sentinel_ap_percent);
        } else {
            ap_before_percentage = Number(document.getElementById("abilitypower").innerHTML);
        }
        //stat updates
        if(dataName==="blue_sentinel"){
            if(document.getElementById("blue_sentinel").checked){
                blue_buff = true;
                document.getElementById("manaregen").innerHTML = Number((document.getElementById("manaregen").innerHTML)) + Number(blue_sentinel_mana_regen);
                document.getElementById("cooldownreduction").innerHTML = Number((document.getElementById("cooldownreduction").innerHTML)) + Number(blue_sentinel_cdr);
                document.getElementById("abilitypower").innerHTML = ap_before_percentage + ap_before_percentage * Number(blue_sentinel_ap_percent);
            }else{
                blue_buff = false;
                document.getElementById("manaregen").innerHTML = Number((document.getElementById("manaregen").innerHTML)) - Number(blue_sentinel_mana_regen);
                document.getElementById("cooldownreduction").innerHTML = Number((document.getElementById("cooldownreduction").innerHTML)) - Number(blue_sentinel_cdr);
                document.getElementById("abilitypower").innerHTML = Number(document.getElementById("abilitypower").innerHTML) - ap_before_percentage * Number(blue_sentinel_ap_percent);
            }
        }
        if(dataName==="hand_of_baron"){
            if(document.getElementById("hand_of_baron").checked){
                document.getElementById("attackdamage").innerHTML = Number(document.getElementById("attackdamage").innerHTML) + Number(baron_ad_and_ap);
                document.getElementById("abilitypower").innerHTML = Number(document.getElementById("abilitypower").innerHTML) + Number(baron_ad_and_ap);
                if(blue_buff){
                    document.getElementById("abilitypower").innerHTML = ap_before_percentage + ap_before_percentage * Number(blue_sentinel_ap_percent);
                }
            }else{
                document.getElementById("attackdamage").innerHTML = Number(document.getElementById("attackdamage").innerHTML) - Number(baron_ad_and_ap);
                document.getElementById("abilitypower").innerHTML = Number(document.getElementById("abilitypower").innerHTML) - Number(baron_ad_and_ap);
                if(blue_buff&&ap_before_percentage === 40){
                    document.getElementById("abilitypower").innerHTML = 0;
                }
            }
        }
        if(dataName==="elder_dragon"){
            if(document.getElementById("elder_dragon").checked){
                //dunno
            }
        }
        console.log(ap_before_percentage);
    }
    
    //Removes items from the inventory and gives back the gold from the item
    // -- updated to no longer need an api call
    function remove_inventory(){
        var inven_image = document.getElementById(this.id);
        var image_source = inven_image.src;
        inven_image.src = "Pictures/emptyitemicon.png";

        var gold_temp = [];
        var gold_totals = document.getElementsByClassName('goldamt');
        for(var i = 0; i < gold_totals.length; i++){
            gold_temp[i] = gold_totals[i].innerHTML;
            gold_temp[i] = parseInt(gold_temp[i], 10);
        }

        var remove_id = image_source;
        remove_id = remove_id.substr(remove_id.length - 8);
        remove_id = remove_id.slice(0,4);
        
        var src_temp = image_source.substr(image_source.length - 26, image_source.length);
        if(src_temp !== "Pictures/emptyitemicon.png"){
            item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + remove_id + "?itemData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a";
            
            var item_cost;
            item_cost = item_json.data[remove_id].gold.total;
            
            for(var i = 0; i < gold_totals.length; i++){
                gold_totals[i].innerHTML = gold_temp[i] + item_cost;
            }

            if(item_json.data[remove_id].stats.hasOwnProperty('FlatArmorMod')){
                document.getElementById('armor').innerHTML = Number(document.getElementById('armor').innerHTML) - item_json.data[remove_id].stats.FlatArmorMod;
            }
            if(item_json.data[remove_id].stats.hasOwnProperty('FlatHPPoolMod')){
                document.getElementById('health').innerHTML = Number(document.getElementById('health').innerHTML) - item_json.data[remove_id].stats.FlatHPPoolMod;
            }
            if(item_json.data[remove_id].stats.hasOwnProperty('FlatMPPoolMod')){
                document.getElementById('mana').innerHTML = Number(document.getElementById('mana').innerHTML) - item_json.data[remove_id].stats.FlatMPPoolMod;
            }

            //base percent modifications
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatHPRegenMod')){
                document.getElementById('healthregen').innerHTML = Number(document.getElementById('healthregen').innerHTML) + item_json.data[item_id].stats.FlatHPRegenMod;
            }
            if(item_json.data[item_id].stats.hasOwnProperty('FlatMPRegenMod')){
                document.getElementById('manaregen').innerHTML = Number(document.getElementById('manaregen').innerHTML) + item_json.data[item_id].stats.FlatMPRegenMod;
            }*/

            if(item_json.data[remove_id].stats.hasOwnProperty('FlatPhysicalDamageMod')){
                document.getElementById('attackdamage').innerHTML = Number(document.getElementById('attackdamage').innerHTML) - item_json.data[remove_id].stats.FlatPhysicalDamageMod;
            }

            //attack speed
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatMPPoolMod')){
                document.getElementById('mana').innerHTML = Number(document.getElementById('mana').innerHTML) + item_json.data[item_id].stats.FlatMPPoolMod;
            }*/

            if(item_json.data[remove_id].stats.hasOwnProperty('FlatCritChanceMod')){
                document.getElementById('criticalchance').innerHTML = Number(document.getElementById('criticalchance').innerHTML) - item_json.data[remove_id].stats.FlatCritChanceMod;
            }
            if(item_json.data[remove_id].stats.hasOwnProperty('FlatMagicDamageMod')){
                document.getElementById('abilitypower').innerHTML = Number(document.getElementById('abilitypower').innerHTML) - item_json.data[remove_id].stats.FlatMagicDamageMod;
            }

            //penetration and cooldown reduction values are not given in the stats table, even those that aren't unique passives
            //could just grab the stats from the sanitized description
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatMagicDamageMod')){
                document.getElementById('abilitypower').innerHTML = Number(document.getElementById('abilitypower').innerHTML) + item_json.data[item_id].stats.FlatMagicDamageMod;
            }*/

            if(item_json.data[remove_id].stats.hasOwnProperty('FlatMovementSpeedMod')){
                document.getElementById('movespeed').innerHTML = Number(document.getElementById('movespeed').innerHTML) - item_json.data[remove_id].stats.FlatMovementSpeedMod;
            }

            //percent movespeed
            /*if(item_json.data[item_id].stats.hasOwnProperty('FlatMagicDamageMod')){
                document.getElementById('abilitypower').innerHTML = Number(document.getElementById('abilitypower').innerHTML) + item_json.data[item_id].stats.FlatMagicDamageMod;
            }*/

            if(item_json.data[remove_id].stats.hasOwnProperty('FlatSpellBlockMod')){
                document.getElementById('magicresist').innerHTML = Number(document.getElementById('magicresist').innerHTML) - item_json.data[remove_id].stats.FlatSpellBlockMod;
            }
        }
    }

    function item_stats(){
        var inven_image = document.getElementById(this.id);
        var image_source = inven_image.src;
        
        var stats = document.getElementById('hoverinfo');
            
        var item_id = image_source;
        item_id = item_id.substr(item_id.length - 8);
        item_id = item_id.slice(0,4);
        
        var src_temp = image_source.substr(image_source.length - 26, image_source.length);

        if(src_temp !== "Pictures/emptyitemicon.png"){
            item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + item_id + "?itemData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a";
            stats.innerHTML = "Gold: " + item_json.data[item_id].gold.total + '<br>' + item_json.data[item_id].description;
        }else{
            stats.innerHTML = "Empty Item Slot"
        }
    }

    function highlight_level(){
        var selected_level = document.getElementById(this.id);

        if(selected_level.style.border !== '1px solid rgb(242, 242, 242)'){
            selected_level.style.border = '1px solid #f2f2f2';
            parent_ele = selected_level.parentElement
            children_ele = parent_ele.childNodes
            for(var index in children_ele){
                if(children_ele[index] !== this && children_ele[index].nodeName !== '#text' && 
                children_ele[index].nodeName !== undefined){
                    children_ele[index].style.border = '1px solid #666699';
                }
            }     
        }

        var all_levels = document.getElementsByClassName('levelselect');
            for(var i=0; i < all_levels.length; i++){
                if(all_levels[i].style.border === '1px solid rgb(242, 242, 242)'){
                level = Number(all_levels[i].innerHTML);
            }
        }

        update_stats();
    }
    
    function highlight_rune(){
        var selected_rune = document.getElementById(this.id);
        var rune_number = Number(selected_rune.id.replace('runeselect',''));
        var rune_id;
        var remove_rune;

        var health = Number(document.getElementById('health').innerHTML);
        var mana = Number(document.getElementById('mana').innerHTML);
        var healthregen = Number(document.getElementById('healthregen').innerHTML);
        var manaregen = Number(document.getElementById('manaregen').innerHTML);
        var attackdamage = Number(document.getElementById('attackdamage').innerHTML);
        var attackspeed = Number(document.getElementById('attackspeed').innerHTML);
        var criticalchance = Number(document.getElementById('criticalchance').innerHTML);
        var abilitypower = Number(document.getElementById('abilitypower').innerHTML);
        var magicpen = Number(document.getElementById('magicpen').innerHTML);
        var percentmagicpen = Number(document.getElementById('percentmagicpen').innerHTML);
        var armorpen = Number(document.getElementById('armorpen').innerHTML);
        var percentarmorpen = Number(document.getElementById('percentarmorpen').innerHTML);
        var cooldownreduction = Number(document.getElementById('cooldownreduction').innerHTML);
        var movespeed = Number(document.getElementById('movespeed').innerHTML);
        var magicresist = Number(document.getElementById('magicresist').innerHTML);
        var armor = Number(document.getElementById('armor').innerHTML);

        var parent_ele;
        var children_ele;

        if(selected_rune.style.border !== '1px solid rgb(242, 242, 242)'){
            selected_rune.style.border = '1px solid #f2f2f2';
            parent_ele = selected_rune.parentElement
            children_ele = parent_ele.childNodes
            for(var index in children_ele){
                if(children_ele[index] !== this && children_ele[index].nodeName !== '#text' && 
                children_ele[index].nodeName !== undefined){
                    children_ele[index].style.border = '1px solid #666699';
                }
            }     
        }
        
        var mark_armorpen = '5253';
        var mark_ad = '5245';
        var mark_as = '5247';
        var mark_critchance = '5251';
        var mark_critdam = '5249';
        var mark_hypen = '5402';
        var mark_magpen = '5273';
        var seal_armor = '5317';
        var seal_energyregen = '5235';
        var seal_health = '5315';
        var seal_healthregen = '5321';
        var seal_manaregen = '5331';
        var seal_percenthealth = '5415';
        var glyph_ap = '5297';
        var glyph_cdr = '5295';
        var glyph_energy = '5371';
        var glyph_mana = '5299';
        var glyph_mr = '5289';
        var quint_ap = '5357';
        var quint_armor = '5347';
        var quint_cdr = '5355';
        var quint_gold = '5367';
        var quint_health = '5345';
        var quint_healthregen = '5351';
        var quint_mana = '5359';
        var quint_manaregen = '5361';
        var quint_percenthealth = '5406';
        var quint_exp = '5368';
        var quint_lifesteal = '5412';
        var quint_ms = '5365';
        var quint_revival = '5366';
        var quint_spellvamp = '5409';

        $.ajax({
            url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/rune?runeListData=all&api_key=59080bd8-1d31-44be-8a1e-3ecd9a372501',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                var all_runes = document.getElementsByClassName('runeselect')
                for(var i=0; i < all_runes.length; i++){
                    if(all_runes[i].style.border === '1px solid rgb(242, 242, 242)'){
                        var rune_amount = Number(all_runes[i].innerHTML);
                        if(all_runes[i].parentElement.parentElement.id === 'armorPenMarks'){
                            rune_armorpen = rune_amount * json.data[mark_armorpen].stats.rFlatArmorPenetrationMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'attackDamageMarks'){
                            rune_ad = rune_amount * json.data[mark_ad].stats.FlatPhysicalDamageMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'attackSpeedMarks'){
                            rune_as = rune_amount * json.data[mark_as].stats.PercentAttackSpeedMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'critChanceMarks'){
                            rune_crit = rune_amount * json.data[mark_critchance].stats.FlatCritChanceMod * 100;
                        } else if(all_runes[i].parentElement.parentElement.id === 'hybridPenMarks'){
                            rune_magpen = rune_amount * json.data[mark_hypen].stats.rFlatMagicPenetrationMod;
                            rune_armorgpen = rune_amount * json.data[mark_hypen].stats.FlatArmorPenetrationMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'magicPenMarks'){
                            rune_magpen = rune_amount * json.data[mark_magpen].stats.rFlatMagicPenetrationMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'armorSeals'){
                            rune_armor = rune_amount * json.data[seal_armor].stats.FlatArmorMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'energyRegenSeals'){
                            
                        } else if(all_runes[i].parentElement.parentElement.id === 'healthSeals'){
                            rune_health = rune_amount * json.data[seal_health].stats.FlatHPPoolMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'healthRegenSeals'){
                            rune_healthreg = rune_amount * json.data[seal_healthregen].stats.FlatHPRegenMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'manaRegenSeals'){
                            rune_manareg = rune_amount * json.data[seal_manaregen].stats.FlatMPRegenMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'percentHealthSeals'){
                            rune_healthpercent = rune_amount * json.data[seal_percenthealth].stats.PercentHPPoolMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'abilityPowerGlyphs'){
                            rune_ap = rune_amount * json.data[glyph_ap].stats.FlatMagicDamageMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'cooldownReductionGlyphs'){
                            rune_cdr = rune_amount * json.data[glyph_cdr].stats.rPercentCooldownMod * 100;
                        } else if(all_runes[i].parentElement.parentElement.id === 'energyGlyphs'){
                            
                        } else if(all_runes[i].parentElement.parentElement.id === 'manaGlyphs'){
                            rune_mana = rune_amount * json.data[glyph_mana].stats.FlatMPPoolMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'magicResistGlyphs'){
                            rune_mr = rune_amount * json.data[glyph_mr].stats.FlatSpellBlockMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'abilityPowerQuints'){
                            rune_quint_ap = rune_amount * json.data[quint_ap].stats.FlatMagicDamageMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'armorQuints'){
                            rune_quint_armor = rune_amount * json.data[quint_armor].stats.FlatArmorMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'cooldownReductionQuints'){
                            rune_quint_cdr = rune_amount * json.data[quint_cdr].stats.rPercentCooldownMod * 100;
                        } else if(all_runes[i].parentElement.parentElement.id === 'goldQuints'){
                            rune_quint_gold = rune_amount * json.data[quint_gold].stats.rFlatGoldPer10Mod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'healthQuints'){
                            rune_quint_health = rune_amount * json.data[quint_health].stats.FlatHPPoolMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'healthRegenQuints'){
                            rune_quint_healthreg = rune_amount * json.data[quint_healthregen].stats.FlatHPRegenMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'manaQuints'){
                            rune_quint_mana = rune_amount * json.data[quint_mana].stats.FlatMPPoolMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'manaRegenQuints'){
                            rune_quint_manareg = rune_amount * json.data[quint_manaregen].stats.FlatMPRegenMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'percentHealthQuints'){
                            rune_quint_percenthealth = rune_amount * json.data[quint_percenthealth].stats.PercentHPPoolMod;
                        } else if(all_runes[i].parentElement.parentElement.id === 'experienceQuints'){
                            rune_quint_exp = rune_amount * json.data[quint_exp].stats.PercentEXPBonus * 100;
                        } else if(all_runes[i].parentElement.parentElement.id === 'lifestealQuints'){
                            rune_quint_lifesteal = rune_amount * json.data[quint_lifesteal].stats.PercentLifeStealMod * 100;
                        } else if(all_runes[i].parentElement.parentElement.id === 'movespeedQuints'){
                            rune_quint_ms = rune_amount * json.data[quint_ms].stats.PercentMovementSpeedMod * 100;
                        } else if(all_runes[i].parentElement.parentElement.id === 'revivalQuints'){

                        } else if(all_runes[i].parentElement.parentElement.id === 'spellvampQuints'){
                            rune_quint_spellvamp = rune_amount * json.data[quint_spellvamp].stats.PercentSpellVampMod * 100;
                        }
                        
                    }
                }

                update_stats();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
})();
