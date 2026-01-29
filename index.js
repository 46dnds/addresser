//cli args
var args={};

if(process.argv && process.argv[1].indexOf('index.js')!=-1){
	if(process.argv.length>2){
		for(var i=2;i<process.argv.length;i++){
			if(process.argv[i].indexOf('=')!=-1){
				var s=process.argv[i].split('=');
				args[s[0]]=s[1];
			}
			else
				args[process.argv[i]]=true;
		}
	}
}
var allStates = require('./data/states.json');
var usStreetTypes = require('./data/us-street-types.json');
var allCities = require('./data/cities.json');
var caStates = require('./data/ca-states.json');
var usStates = require('./data/us-states.json');
var usCities = require('./data/us-cities.json');
var XRegExp = require('xregexp');
try{
	if(XRegExp.XRegExp && typeof XRegExp.XRegExp=='function') XRegExp=XRegExp.XRegExp; //preserve compatibility
} catch(e){console.warn(e.message)};
const ENTITTIES = require('html-entities');
const diacritics = require('./data/diacritics.js');

'use strict';

/**
 * Parses a street address
 * @param {string} address
 * @return {string}
 **/

//TODO move this to utils file
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

function toTitleCase(str) {
  if(!str) return str;
	return str.replace(/([^\W_]+[^\s-]*)*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

//returns a random property of a given object
function randomProperty(obj) {
	var keys = Object.keys(obj)
	return keys[keys.length * Math.random() << 0];
};

var usStreetDirectional = {
	east		: "E",
	est			: "E",
	nord		: "N",
	nordest		: "NE",
	nordouest	: "NO",
	north		: "N",
	northeast	: "NE",
	northwest	: "NW",
	ouest		: "O",
	southeast	: "SE",
	south		: "S",
	southwest	: "SW",
	sud			: "S",
	sudest		: "SE",
	sudouest	: "SO",
	west		: "W",
},
canPostalCodeFirst = {
	A	: 'NL', //	Newfoundland and Labrador
	B	: 'NS', //	Nova Scotia	
	C	: 'PE', //	Prince Edward Island	
	E	: 'NB', //	New Brunswick	
	G	: 'QC', //	Eastern Québec
	H	: 'QC', //	Metropolitan Montréal	
	J	: 'QC', //	Western Québec	
	K	: 'ON', //	Eastern Ontario	
	L	: 'ON', //	Central Ontario	
	M	: 'ON', //	Metropolitan Toronto
	N	: 'ON', //	Southwestern Ontario
	P	: 'ON', //	Northern Ontario
	R	: 'MN', //	Manitoba
	S	: 'SK', //	Saskatchewan
	T	: 'AB', //	Alberta
	V	: 'BC', //	British Columbia
	X	: 'NT', //	Northwest Territories (NT) and Nunavut (NU)
	Y	: 'YT', //	Yukon Territory
},
usZipCodesByState = require('./data/us-zipcodes-by-state.json'),
usLine2Prefixes = {
	'APARTMENT'    		: 'APT',
	'APPARTEMENT'		: 'APT', // french for apt
  	'APP'          		: 'APT', // french for apt
	'APT'          		: 'APT',
	'BASEMENT'     		: 'BSMT',
	'BAY'		   		: 'BAY',
	'BSMT'         		: 'BSMT',
	'BLDG'         		: 'BLDG',
	'BUILDING'     		: 'BLDG',
	'BUREAU'       		: 'BUR', //french for office
	'BUR'       		: 'BUR', //french for office
	'DEPARTMENT'   		: 'DEPT',
	'DEPT'         		: 'DEPT',
	'ETAGE'		    	: 'FL', //french for Floor
	'ÉTAGE'		    	: 'FL',
	'FL'           		: 'FL',
	'FLOOR'        		: 'FL',
	'FRNT'         		: 'FRNT',
	'FRONT'        		: 'FRNT',
	'HANGAR'       		: 'HNGR',
	'HNGR'         		: 'HNGR',
	'LBBY'         		: 'LBBY',
	'LOBBY'        		: 'LBBY',
	'LOCAL'        		: 'RM', // french for room
	'LOT'          		: 'LOT',
	'LOWER'        		: 'LOWR',
	'LOWR'         		: 'LOWER',
	'NUMERO'       		: 'NO',
	'NO'           		: 'NO',
	'OFC'          		: 'OFC',
	'OFFICE'       		: 'OFC',
	'PENTHOUSE'    		: 'PH',
	'PH'           		: 'PH',
	'PIER'         		: 'PIER',
	'REAR'         		: 'REAR',
	'RM'           		: 'RM',
	'ROOM'         		: 'RM',
	'SIDE'         		: 'SIDE',
	'SLIP'         		: 'SLIP',
	'SPACE'        		: 'SPC',
	'SPC'          		: 'SPC',
	'STE'          		: 'STE',
	'STOP'         		: 'STOP',
	'SUITE'        		: 'STE',
	'TRAILER'      		: 'TRLR',
	'TRLR'         		: 'TRLR',
	'UNIT(e|é|ée|ee|)'  : 'UNIT', //unit, unite (french)
	'UPPER'        		: 'UPPR',
	'UPPR'         		: 'UPPR',
	'#'			       	: '#',
},

entities={
	decode:function(dat){ //entities.decode
		if(dat=='undefined')
			return '';
		if (!dat)
		  return dat;
		let 
		f	= entities.decode,
		e	= ENTITTIES.decode;
		if(typeof dat==='string'){
			try{
				return e(e(dat));
			}
			catch(er){
				console.error(er);
				return false;
			}
		}
		else if(Array.isArray(dat) || typeof dat==='object' && dat.constructor === Object){
			for(var i in dat){
				if(typeof dat[i]=='undefined')
					continue;
				try{
					dat[i]=f(dat[i]);
				}
				catch(e){
					console.error(e);
					return false;
				}
			}
		}
		return dat;
	},
	removeAccents:function(dat){ // entities.removeAccents()
		if(dat=='undefined')
			return '';
		if(!dat)
			return dat;
		if(typeof dat=='string'){ //remove unicode characters
			var r = /\\u([\d\w]{4})/gi;
			dat = dat.replace(r, function (match, grp) {
				return String.fromCharCode(parseInt(grp, 16)); 
			});
			return diacritics.remove(entities.decode(dat)); //convert html entities to accents, then accents to letters
		}
		else if(Array.isArray(dat) || typeof dat==='object' && dat.constructor === Object){
			for(var i in dat){
				if(typeof dat[i]=='undefined')
					continue;
				try{
					dat[i]=(dat[i] && typeof dat[i]!='boolean')?entities.removeAccents(dat[i]):dat[i];
				}
				catch(e){
					console.error(e);
					return false;
				}
			}
		}
		return dat;
	}
};

var usStreetDirectionalString = Object.keys(usStreetDirectional).map(x => usStreetDirectional[x]).concat(Object.keys(usStreetDirectional)).reduce(function(uq,it){return uq.includes(it)?uq:[...uq,it]},[]).join('|');
var usLine2String = Object.keys(usLine2Prefixes).join('|');
var
addrsr={
  cleanString:function(input){ // a lazy and overkill way to clean a string... because we can't control 100% of the user input.
    if(!input || typeof input=='boolean') return input;
    if(typeof input=='object'){
      for(let x in input){
        if(input[x]) input[x]=addrsr.cleanString(input[x]);
      }
      return input;
    }
    if(typeof input!='string') return input;

    let _doTrim=function(a){ //some lazyness
      a=a.replace(/\s+/g,' ').trim();
      for(let i=0;i<3;i++)
        a=a.replace(/\s+\,/g,',').trim().replace(/\,+/g,',').trim().replace(/\,+$/,'').trim().replace(/^\,+/,'').trim();
      return a.replace(/\s+/g,' ').trim();
    };
    input=_doTrim(entities.removeAccents(input.trim()).replace(/(\\n|\n)/g,', ').replace(/\$/g,''));
    
    let _toReplace=[
		['\n', ', '],
		['\\', '/'],
      	[', ,', ','],
      	['u00f4', 'ô'],
      	['u00e7', 'ç'],
      	['u00e8', 'è'],
      	['u00e9', 'é'],
      	['u00e0','à'],
      	['Ã´','ô'],
      	['Ã©','é'],
      	['ÃƒÂ¨', 'é']
    ];
    for(let i=0;i<_toReplace.length;i++){
      while(input.indexOf(_toReplace[i][0])!=-1) input=input.replace(_toReplace[i][0],_toReplace[i][1]);
    }
    var output = "";
    for (var i=0; i<input.length; i++) {
      if (input.charCodeAt(i) <= 127 || input.charCodeAt(i) >= 160 && input.charCodeAt(i) <= 255) {
        output += input.charAt(i);
      }
    }
    return _doTrim(entities.removeAccents(output).trim());
  },
  getPlaceInfo:function(input){
    //The best example I could get for that function is:
    // "120 Columbus Drive, Conception Square, Walmart Carbonear Store 3015, Carbonear, Newfoundland and Labrador A1Y 1B3, Canada"
    var placeName='';
    //try{ // some cities have "place" in their name
    //  //match "WhateverPlaceName Square or ThatCity convention center"
    //  let _placeOrCenter=input.match(/(^|\,)[^0-9]+ (Square|Plaza|Center)(\s|)(\,|$)/i);
    //  if(_placeOrCenter){
    //    placeName=addrsr.cleanString(_placeOrCenter[0]);
    //    input=addrsr.cleanString(input.replace(placeName,','));
    //  }
    //} catch(er){
    //  console.warn('Error parsing place stuff',er.message,'at line',er.line || er.lineNumber,input)
    //}
    
    try{
      //match "Walmart City Name Supercentre 1234"
      let walmart=input.match(/(^|\,)(\s|)Walmart [^0-9]+ (Supercentre|Store) [\d]+\,/i);
      if(walmart){
        input=addrsr.cleanString(input.replace(addrsr.cleanString(walmart[0]),','));
        placeName=addrsr.cleanString(walmart[0])+(placeName?', '+placeName:'');
      }
    } catch(er){
      console.warn('Error parsing walmart stuff',er.message,'at line',er.line || er.lineNumber,input)
    }
    input=addrsr.cleanString(input);

    try{
      //match any part of address before the 1st number
      // "New York Center for Infants and Toddlers, Inc.,2336 Andrews Ave, 2nd Floor, Bronx, 10468, US"
      // The 2 1st parts are the "place" name, strip it.
      var rsp=input.split(',');
      if(rsp[0] && rsp[0].trim()){
        var rfp=rsp[0].trim(),rpn='';
        if(!rfp.match(/[0-9]/)){
          	console.warn('First part of address has no numbers',rfp)
          	while(rsp && rsp[0] && rsp[0].trim() && !rsp[0].trim().match(/[0-9]/)){
            	rpn+=rsp[0].trim()+' ';
            	rsp.shift();
          	}
			placeName=addrsr.cleanString(rpn)+(placeName?', '+placeName:'');
          	input=addrsr.cleanString(rsp.join(', '));
        }
        else if(rfp.match(/^[a-z\s\-\.]{10,1000}[\s\-]+[a-z0-9\s\-\.]+$/i) && !addrsr.getPOBox(rfp)){
          	console.warn('First part of address ends with number',rfp);
		  	rsp.shift();
			placeName=addrsr.cleanString(rfp)+(placeName?', '+placeName:'');
          	input=addrsr.cleanString(rsp.join(', '));
        }
      }
    }
    catch(er){
      console.warn('input "'+input+'" could not find placeName',er.message,'at line',er.line || er.lineNumber);
    }
    return {
      place     : toTitleCase(placeName),
      stripped  : input
    }
  },
	/**
	 * 
	 * @param {string} a address string
	 * @returns {object} 
	 * 		{string} parsed parsed po box
	 * 		{string} stripped original string, w/o po box
	 */
	getPOBox: function(a) {
		//remove P.O. box from original address
		//return parsed value
		let s=a.match(/(P[\.\s]*O|POST[\s\-]+OFFICE)?([\.\s\:]*)?(BOX|DRAWER)[\s\:\#]*([\s]+|)(\w+)/i);
		if(s){
			return {
				parsed		: s[0],
				value		: s[5],
				stripped	: a.replace(s[0],'').replace(/[\s]+\,/g,',').trim().replace(/[\,]+/g,',').trim().replace(/^\,/g,'').trim()
			}
		}
		return null;
  },
  getStateFromZip:function(zip){
    var zip=parseInt(zip);
    var s=Object.keys(usZipCodesByState);
    for(let i=0;i<s.length;i++){
      let _s=usZipCodesByState[s[i]];
      for(let x=0;x<_s.codes.length;x++){
        if(zip>=_s.codes[x][0] && zip>=_s.codes[x][1]){
          return {
            code  : s[i],
            name  : _s.name
          };
        }
      }
    }
    return null;
  },
	/**
	 * 
	 * @param {string} a address string
	 * @returns {object} 
	 * 		{string} parsed parsed subPremise
	 * 		{string} stripped original string, w/o subPremise
	 */
	getSubPremise: function(address,options) {
		if(!options) options={};
		//remove subPremise from original address
		//return parsed value
		let _bndr = "(\\b|\\,|\\s)", _apt = [];
		//prevent saints names from being parsed as "suite" like "Ste-Marie" which is "Sainte-Marie"
		//really not clever, works for now as a quick fix, will work on that later
		let
		a		= address.replace(/(ste)\-([a-z]{4,100})/i,'$1___SAINTE___$2'),
		_c 		= [
				//I dont know what it means but I had to manage for a customer
				//RR 1 Comp 45 Site 19, 32 Willow Hill Est, Sundre, Alberta T0M 1X0, Canada
			[XRegExp("^RR ([\\d]+) Comp([a-z]+|) ([\\d]+) Site ([\\d]+)" + _bndr, 'i'), ''],

				//house number + apt + street
				//129 B Mitchell Ct, Mitchell, ON N0K 1N0, Canada
				[XRegExp("^(\\d+)\\s[A-DF-MP-RT-VX-Z](\\,|\\s)", 'i'), '$1 '],
			//TODO: 10 1/2 6th ave,
			//2875 boul. Laurier, D-3, Bureau 600, Québec, Quebec G1V 2M2, Canada

				// 2nd floor, 3rd floor, 4e étage, 15 floor, 15th floor, 15 th floor etc
			[XRegExp(_bndr + "([\\d]+)(\s+|)(st|nd|rd|th|e|ieme|er|eme|) (" + Object.keys(usLine2Prefixes).join('|').replace('|#','') + ")" + _bndr, 'i'), ''],
 
				// building A, Suite 1, STE A-1, apt 3A, apt #3 and so on
				// 580 Hespeler Rd building d, Cambridge, ON N1R 6J8, Canada
				// 10120 SW NIMBUS AVE STE C-2, GLB-JOKERJY, PORTLAND, Oregon 97223-4336, US
				// make sure not to match Northwest territories with (?![a-z]+)
			[XRegExp(_bndr + "(" + Object.keys(usLine2Prefixes).join('|').replace('|#','|\\#') + ")(?![a-z]+)([\\,|\\.|\\#|\\:|\\s|\\-]+|)([\\d|\\-|\\p{L}]+)" + _bndr, 'i'), ''],

			 	// 9390 Boulevard des Sciences #3A, Anjou, QC H1J 3C7, Canada
			[XRegExp(" \\#(\s+|)(\\d)+(\-|)([\\p{L}]|)" + _bndr, 'i'), ''],


				//starting with subpremise
				//#105 - 19 Everridge Square SW... also fits with or without spaces
			[XRegExp("^(\\#|)(\\d+)(\\s|)(\\-|\\,|\\/)(\\s|)", 'i'), ''],
		];
		for (let i = 0; i < _c.length; i++) {
			if (_c[i][0].test(a)) {
				if(options.verbose) console.info('subPremise match rule #'+i);
				let _aptM = XRegExp.exec(a,_c[i][0]);
				if(options.verbose) console.log(_aptM)
				_apt.push(_aptM[0].trim());
				a = XRegExp.replace(a,_c[i][0], _c[i][1]).trim();
			}
		}
		_apt.filter(function(a){
			return a?true:false;
		});
		a=a.replace(/(ste)___SAINTE___([a-z]{4,100})/i,'$1-$2'); //restore "saint" name
		//once subPremise has been replaced
		let out=a.replace(/[\s]+\,/g,',').trim().replace(/[\,]+/g,',').trim().replace(/^\,/g,'').trim();
		out = addrsr.cleanString(out).replace(/^(\d+)\, /,'$1 '),
		parsed=_apt.join(', ').replace(/(^[\,]+|[\,]+$)/,''); //replace street number and street name comma "123, street name, city" to "123 street name, city"

		// if leftover has no number, we may have misparsed, fallback
		if(/[0-9]+/.test(out.split(',')[0])==false){
			if(/[\.|\-|\s]([0-9]+)$/.test(parsed)){
				
				let snmb=parsed.match(/(.*)[\.|\-|\s]([0-9]+)$/);
				parsed=snmb[1];
				out=snmb[2]+' '+out;
			}
			else
			{
				if(options.debug || options.verbose) console.warn('subPremise parsed, no number left in address 1st part "'+out.split(',')[0]+'", abort');
				return {
					parsed		: null,
					stripped	: parsed+' '+out
				};
			}
		}

		return {
			parsed		: parsed,
			stripped	: out
		};
	},
	searchState:function(stateString,result){
		if (stateString.length == 2 && getKeyByValue(allStates, stateString.toUpperCase())) {
			result.stateAbbreviation = stateString.toUpperCase();
			result.stateName = toTitleCase(getKeyByValue(allStates, stateString.toUpperCase()));
			stateString = stateString.substring(0, stateString.length - 2);
		} else {
			// Next check if the state string ends in state name or abbeviation
			// (state abbreviation must be preceded by a space to ensure accuracy)
			for (let key in allStates) {
				var re = new RegExp(" " + allStates[key] + "$|" + key.replace(/\-/g,'(\\-|\\s)') + "$", "i");
				if (stateString.match(re)) {
					stateString = stateString.replace(re, "");
					result.stateAbbreviation = allStates[key];
					result.stateName = toTitleCase(key);
					break;
				}
			}
		}
	},
	parseAddress: function(input,options) {
		if(!options) options={};
		// Validate a non-empty string was passed
		if (!input) {
			throw 'Argument must be a non-empty string.';
		}
		if(options.verbose) console.info('INPUT RECEIVED:',input);
		address = addrsr.cleanString(input).replace(/^(\d+)\,(\s|)([a-z0-9\-\.\'\s_]+)(\,|\#)/i,'$1 $3$4'); //replace street number and street name comma "123, street name, city" to "123 street name, city"
    	address=address.replace(/\, Newfoundland ([A-Z]\d[A-Z])/i,', NL $1'); // because partial province name
    	address=address.replace(/\, (Bronx|Manhattan|Queens)(\,|) (\d{5})/i,', New York, NY $3'); // because Bronx is not a state, ny is
		if(options.verbose) console.info('address pre parsed:',address);
		var result = {};
		var PI=addrsr.getPlaceInfo(address,options);
		if(PI.place){
			address=PI.stripped;
			result.placeName=PI.place;
			if(options.verbose) console.info('placeName stripped:','"'+result.placeName+'"',address);
		}
		var poBox=addrsr.getPOBox(address,options); //always parse PO box first because of apt with # (# 999) which could match PO Box # 123
		if(poBox && poBox.parsed){
			result.poBox=poBox.parsed;
			address=poBox.stripped;
			if(options.verbose) console.info('poBox stripped:','"'+result.poBox+'"',address);
		}
		var subP=addrsr.getSubPremise(address,options);
		if(subP && subP.parsed){
			result.subPremise=subP.parsed;
			address=subP.stripped;
			if(options.verbose) console.info('subPremise:',subP,address);
		}
		// Assume comma, newline and tab is an intentional delimiter
		var addressParts = address.split(/,|\t|\n/).map(Function.prototype.call, String.prototype.trim);
		if(options.verbose) console.info('addressParts:',addressParts);

		// Check if the last section contains country reference (Just supports US for now)
		var countrySection = addressParts[addressParts.length - 1].trim();
		result.countryCode = countrySection === 'US' || countrySection === 'USA' || countrySection === 'United States' ? 'US' : '';
		if (!result.countryCode) result.countryCode = countrySection === 'CA' || countrySection === 'CAN' || countrySection === 'Canada' ? 'CA' : '';
		if (result.countryCode) {
			if (result.countryCode == 'CA') result.country = 'Canada';
			if (result.countryCode == 'US') result.country = 'United States';
			addressParts.splice(-1, 1);
		}

		if(options.verbose) console.info('countryCode:',result.countryCode);
		// Assume the last address section contains state, zip or both
		var stateString = addressParts[addressParts.length - 1].trim();
		// Parse and remove zip or zip plus 4 from end of string
		if (stateString.match(/\d{5}$/)) {
			result.zipCode = stateString.match(/\d{5}$/)[0];
			stateString = stateString.substring(0, stateString.length - 5).trim();
			if(options.verbose) console.info('stateString match \\d{5}$:','"'+result.zipCode+'"',stateString);
		} else if (stateString.match(/\d{5}-\d{4}$/)) {
			var zipString = stateString.match(/\d{5}-\d{4}$/)[0];
			result.zipCode = zipString.substring(0, 5);
			result.zipCodePlusFour = zipString;
			stateString = stateString.substring(0, stateString.length - 10).trim();
			if(options.verbose) console.info('stateString match \\d{5}-\\d{4}$:','"'+result.zipCode+'"',stateString);
		} else if (stateString.match(/[A-Z]\d[A-Z](\-|\s+|)\d[A-Z]\d/)) { //matches "A1A 1A1", "A1A-1A1" and "A1A1A1"
			let _z = stateString.match(/([A-Z]\d[A-Z])(\-|\s+|)(\d[A-Z]\d)/);
			result.zipCode=_z[1]+' '+_z[3];
			result.country='Canada';
			result.countryCode='CA';
			stateString = stateString.substring(0, stateString.length - result.zipCode.length).trim();
			if(options.verbose) console.info('stateString match [A-Z]\\d[A-Z](\\-|\\s+|)\\d[A-Z]\\d:','"'+result.zipCode+'"',stateString);
		}
		else if (result.countryCode == 'CA' && stateString.match(/\b[A-Z]\d[A-Z]\b/)) {
			result.zipCode = stateString.match(/\b[A-Z]\d[A-Z]\b/)[0];
			result.zipCodeIsIncomplete = true;
			stateString = stateString.substring(0, stateString.length - result.zipCode.length).trim();
			if(options.verbose) console.info('stateString match \\b[A-Z]\\d[A-Z]\\b:','"'+result.zipCode+'"',stateString);
    	}
    
		// Parse and remove state
		if (stateString.length > 0) { // Check if anything is left of last section
			addressParts[addressParts.length - 1] = stateString.trim();
		} else {
			addressParts.splice(-1, 1);
			stateString = addressParts[addressParts.length - 1]?.trim();
		}
		if(options.verbose) console.info('stateString:',stateString);
		// First check for just an Abbreviation
		addrsr.searchState(stateString,result);
		if(!result.stateAbbreviation || result.stateAbbreviation.length != 2){
			if(result.zipCode){
				if(result.countryCode == 'US'){
					let _s=addrsr.getStateFromZip(result.zipCode);
					if(_s && _s.code){
						addressParts.push(stateString);
						if(options.verbose) console.info('no state found, got from zip:',_s);
						stateString=_s.code;
						addrsr.searchState(stateString,result);
					}
				}
				if (result.countryCode =='CA') {
					stateString = canPostalCodeFirst[result.zipCode.substr(0, 1)];
					addressParts.push(stateString);
					if(options.verbose) console.info('no province found, got from postalCode:',stateString);
					addrsr.searchState(stateString,result);
				}
			}
			if(result.countryCode === 'CA'){
				//CA may be California, not Canada?
				allCities.CA.some(function(element) {
					var re = new RegExp(element + "$", "i");
					if (stateString.match(re)) {
						//let city = stateString.replace(re, ""); // Carve off the place name
						stateString='CA';
						addrsr.searchState(stateString,result);
						stateString=''+element;
						result.countryCode='US';
						result.country='United States';
		
						result.city = element;
						if(options.verbose) console.info('found city and state from "allCities.CA":','"'+element+'"');
						return element; // Found a winner - stop looking for cities
					}
				});
			}
		}

		if (!result.stateAbbreviation || result.stateAbbreviation.length != 2) {
			if(options.debug || options.verbose) console.warn(stateString,result)
			throw 'Can not parse address. State not found.';
		}
		if(options.verbose) console.info('remaining addressParts with stateString:','"'+stateString+'"',addressParts);
		// Parse and remove city/place name
		var cityString = "";
		if (stateString.length > 0) { // Check if anything is left of last section
			addressParts[addressParts.length - 1] = stateString;
			cityString = addressParts[addressParts.length - 1];
		} else {
			addressParts.splice(-1, 1);
			cityString = addressParts[addressParts.length - 1].trim();
		}
		result.city = "";
		if(options.verbose) console.info('cityString:',cityString);
		allCities[result.stateAbbreviation].some(function(element) {
			var re = new RegExp(element + "$", "i");
			if (cityString.match(re)) {
				cityString = cityString.replace(re, ""); // Carve off the place name

				result.city = element;
				if(options.verbose) console.info('found city from "allCities.'+result.stateAbbreviation+'":','"'+element+'"');
				return element; // Found a winner - stop looking for cities
			}
		});
		if (!result.city) {
			result.city = toTitleCase(cityString);
			if(options.verbose) console.info('City from cityString:','"'+result.city+'"');
			cityString = "";
		}

		// Parse the street data
		var streetString = "",_streetDirectionPosition=0;

		if (cityString.length > 0) { // Check if anything is left of last section
			addressParts[addressParts.length - 1] = cityString;
		} else {
			addressParts.splice(-1, 1);
		}

		if (addressParts.length > 2) {
			if(options.debug || options.verbose) console.warn(addressParts,result)
			throw 'Can not parse address. More than two address lines.';
		} else if (addressParts.length === 2) {
			// check if the secondary data is first
			var re = new RegExp('^(' + usLine2String + ')\\b', 'i');
			if (addressParts[0].match(re)) {
				var tmpString = addressParts[1];
				addressParts[1] = addressParts[0];
				addressParts[0] = tmpString;
			}
			//Assume street line is first
			result.addressLine2 = addressParts[1].trim();
			addressParts.splice(-1, 1);
		}
		if (addressParts.length === 1) {
			streetString = addressParts[0].trim();
			// If no address line 2 exists check to see if it is incorrectly placed at the front of line 1
			if (typeof result.addressLine2 === "undefined") {
				var re = new RegExp('^(' + usLine2String + ')\\s\\S+', 'i');
				if (streetString.match(re)) {
					result.addressLine2 = streetString.match(re)[0];
					streetString = streetString.replace(re, "").trim(); // Carve off the line 2 data
				}
			}
			if(options.verbose) console.info('addressParts.length === 1: streetString',streetString)
			//Assume street address comes first and the rest is secondary address
			var 
			reStreet = XRegExp('\.\*\\b(?:' +
				Object.keys(usStreetTypes).join('|') + ')\\b\\.?' +
				'( +(?:' + usStreetDirectionalString + ')\\b)?', 'i'),
			reStreetFR = XRegExp('\.\*\\b(' +
					Object.keys(usStreetTypes).join('|') + ')(\\.|)\\s([\\p{L}|_|\\-|\\\'|\\s]+)(\\s|)' +
					'(' + usStreetDirectionalString + '|)$', 'i'),
			reAveLetter = XRegExp('\.\*\\b(av.?|ave.?|avenue)\.\*\\b\\p{L}\\b', 'i'),
			reNoSuffix = XRegExp('\\b\\d+[a-z]?\\s[\\p{L}0-9_\\-\\.\\s\\\']+\\b', 'i');//,
			//reNoSuffixApt = XRegExp('\\b[\\d]+[a-z|]\\s[\\p{L}0-9_\\-\\.\\s\\\']+\\b', 'i');
			if (reAveLetter.test(streetString)) {
				result.addressLine1 = XRegExp.exec(streetString, reAveLetter)[0];//streetString.match(reAveLetter)[0];
				streetString = streetString.replace(reAveLetter, "").trim(); // Carve off the first address line
				if (streetString && streetString.length > 0) {
					// Check if line2 data was already parsed
					if (result.hasOwnProperty('addressLine2') && result.addressLine2.length > 0) {
						if(options.debug || options.verbose) console.warn(addressParts,result)
						throw 'Can not parse address. Too many address lines. Input string: ' + address;
					} else {
						result.addressLine2 = streetString;
					}
				}

				var streetParts = result.addressLine1.split(' ');
				if(options.verbose) console.info('streetParts',streetParts)

				// Assume type is last and number is first
				let stnb_index=0;
				if(streetParts[0].replace(/[^0-9]/,'') != ""){
					result.streetNumber = streetParts[0]; // Assume number is first element
					stnb_index=1;
				}

				// Normalize to Ave
				streetParts[streetParts.length - 2] = streetParts[streetParts.length - 2].replace(/^(ave.?|avenue)$/i, 'Ave');

				//result.streetSuffix = toTitleCase(usStreetTypes[streetParts[streetParts.length-1].toLowerCase()]);
				result.streetName = streetParts[stnb_index]; // Assume street name is everything in the middle
				for (var i = stnb_index+1; i <= streetParts.length - 1; i++) {
					result.streetName = result.streetName + " " + streetParts[i];
				}
				result.streetName = toTitleCase(result.streetName);
				let snDir=result.streetName.match(new RegExp("^("+usStreetDirectionalString+")\\b",'i'));
				if(snDir){
					result.streetDirection=snDir[0].trim();
				}
				result.addressLine1 = [result.streetNumber, result.streetName].join(" ");
			} else if (reStreet.test(streetString) || reStreetFR.test(streetString)) {
				let addln1;
				if(reStreetFR.test(streetString)){
					addln1=XRegExp.exec(streetString, reStreetFR);
					if(options.verbose) console.info('streetString matches reStreetFR',addln1)
					streetString = streetString.replace(reStreetFR, "").trim(); // Carve off the first address line

					result.streetName = toTitleCase(addln1[3]);
				}
				else{
					addln1=XRegExp.exec(streetString, reStreet);
					if(options.verbose) console.info('streetString matches reStreet',addln1)
					streetString = streetString.replace(reStreet, "").trim(); // Carve off the first address line
				}
				result.addressLine1 = addln1[0];
				if (streetString && streetString.length > 0) {
					// Check if line2 data was already parsed
					if (result.hasOwnProperty('addressLine2') && result.addressLine2.length > 0) {
						if(options.debug || options.verbose) console.warn(addressParts,result)
						throw 'Can not parse address. Too many address lines. Input string: ' + address;
					} else {
						result.addressLine2 = streetString;
					}
				}
				var streetParts = result.addressLine1.split(' ');
				if(options.verbose) console.info('streetParts',streetParts,streetParts[0].replace(/[^0-9]/g,''))

				// Assume type is last and number is first
				let stnb_index=0;
				if(streetParts[0].replace(/[^0-9]/g,'') != ""){
					result.streetNumber = streetParts[0]; // Assume number is first element
					stnb_index=1;
				}

				// if no space in street parts, split them "2021BearhillRd".replace(/^(\d+)([a-z]+)/i,'$1 $2');
				// Assume type is last and number is first   
				if((!result.streetNumber || result.streetNumber.replace(/[^0-9]/g,'') != result.streetNumber) && /[0-9]+(\.|\-|\s)[0-9]+$/.test(result.subPremise)){
					//subPremise has been misparsed
					let snmb=result.subPremise.match(/[\.|\-|\s]([0-9]+)$/);
					streetParts.unshift(snmb[1]);
					result.streetNumber=snmb[1];
					result.subPremise=result.subPremise.replace(snmb[0],'');
				}
				// Check if directional is last element
				var re = new RegExp('\.\*\\b(?:' + usStreetDirectionalString + ')$', 'i');
				if (result.addressLine1.match(re)) {
					try{
						result.streetDirection = streetParts.pop().toUpperCase();
						_streetDirectionPosition=1;
					}
					catch(er){
						console.warn(er.message,streetParts)
					}
				}
				else if(streetParts[stnb_index] && usStreetDirectionalString.split('|').indexOf(streetParts[stnb_index].toUpperCase())!=-1){
					result.streetDirection = streetParts.splice(stnb_index,1)+'';
					result.streetDirection = result.streetDirection.toUpperCase();
					_streetDirectionPosition=0;
				}
				if(options.verbose) console.info('addressLine1',result.addressLine1)

				// If there are only 2 street parts (number and name) then its likely missing a "real" suffix and the street name just happened to match a suffix
				if (streetParts.length > 2) {

					if(options.verbose) console.info('streetParts count >2',streetParts)
					// Remove '.' if it follows streetSuffix
					streetParts[streetParts.length - 1] = streetParts[streetParts.length - 1].replace(/\.$/, '');
					if(usStreetTypes[streetParts[streetParts.length - 1].toLowerCase()])
						result.streetSuffix = toTitleCase(usStreetTypes[streetParts.pop().toLowerCase()]);
					//streetParts.pop();
				}
				//was: "Assume street name is everything in the middle" but when you assume, you make an ass of u and me
				// work fine except for something like: "1234 boul streetName W", that would give "boul"
				let strnameindex=1;
				if(options.verbose) console.info('streetParts against usStreetTypes',streetParts[1])
				if(streetParts[2] && Object.keys(usStreetTypes).indexOf(streetParts[2].toLowerCase().replace(/\.$/, ''))!=-1){
					strnameindex=1;
					if(!result.streetSuffix) result.streetSuffix = toTitleCase(streetParts[2]);
				}
				else if(Object.keys(usStreetTypes).indexOf(streetParts[1].toLowerCase().replace(/\.$/, ''))!=-1){
					strnameindex=2;
					result.streetPrefix = toTitleCase(streetParts[1]);
				}
				result.streetName = streetParts[strnameindex]; // Assume street name is everything in the middle
				for (var i = (strnameindex+1); i <= streetParts.length - 1; i++) {
					if(streetParts[i]==result.streetSuffix) continue;
					result.streetName = result.streetName + " " + streetParts[i];
				}
				if(result.streetPrefix && !result.streetName) {
					result.streetName=''+result.streetPrefix;
					result.streetPrefix='';
				}
				if (result.streetDirection) {
					if(result.streetDirection.length>2) result.streetDirection=toTitleCase(result.streetDirection);
					result.streetName = (_streetDirectionPosition===0?result.streetDirection+' ':'')+result.streetName;// +(_streetDirectionPosition===1?' ' + result.streetDirection:'') ;
				}
				result.streetName = toTitleCase(result.streetName);
				result.addressLine1 = [result.streetNumber,(result.streetPrefix || ''), result.streetName,(result.streetSuffix || ''),(_streetDirectionPosition===1?' ' + result.streetDirection:'')].filter(function(a){return a?true:false;}).join(" ").replace(/\s+/g,' ');

			} else if (result.poBox) {
				result.addressLine1 = ''+result.poBox;
				//streetString = streetString.replace(result.poBox, "").trim(); // Carve off the first address line
			//} else if (streetString.match(reNoSuffix)) {
			} else if (reNoSuffix.test(streetString)) {
					//result.addressLine1 = XRegExp.exec(streetString, reAveLetter)[0];//streetString.match(reAveLetter)[0];
				// Check for a line2 prefix followed by a single word. If found peel that off as addressLine2
				var reLine2 = XRegExp('\\s(' + usLine2String + ')\\.?\\s[\\p{L}0-9_\\-]+$', 'i');
				//if (streetString.match(reLine2)) {
				if (reLine2.test(streetString)) {
					result.addressLine2 = XRegExp.exec(streetString, reLine2)[0].trim();
					streetString = streetString.replace(reLine2, "").trim(); // Carve off the first address line
				}

				result.addressLine1 = XRegExp.exec(streetString, reNoSuffix)[0];
				streetString = streetString.replace(reNoSuffix, "").trim(); // Carve off the first address line
				var streetParts = result.addressLine1.split(' ');
				if(options.verbose) console.info('streetParts',streetParts)

				// Assume type is last and number is first   
				result.streetNumber = streetParts[0]; // Assume number is first element
				streetParts.shift(); // Remove the first element
				result.streetName = streetParts.join(' '); // Assume street name is everything else
			} else {
				if(options.debug || options.verbose) console.warn(addressParts,result)
				throw 'Can not parse address. Invalid street address data. Input string: ' + address;
			}
		} else if(!result.subPremise && !result.poBox) {
			if(options.debug || options.verbose) console.warn(addressParts,result)
			throw 'Can not parse address. Invalid street address data. Input string: ' + address;
		}
		if(result.poBox) result.addressLine2=(result.addressLine2?result.addressLine2+', ':'')+result.poBox;
		if(result.subPremise) {
			if(new RegExp("^"+result.streetNumber,'i').test(result.subPremise)){
				result.subPremise=result.subPremise.replace(new RegExp("^"+result.streetNumber,'i'),'');
				result.addressLine1=result.subPremise+'-'+result.addressLine1;
			}
			else
				result.addressLine2=(result.addressLine2?result.addressLine2+', ':'')+result.subPremise;
			result.subPremise=result.subPremise.replace('#','').trim();
		}
		
		if(!result.addressLine1 && result.addressLine2){
			result.addressLine1=''+result.addressLine2;
			delete result.addressLine2;
		}
		var addressString = result.addressLine1 || '';
		if (result.hasOwnProperty('addressLine2')) {
			addressString += ', ' + result.addressLine2;
		}
		if (addressString && result.hasOwnProperty("city") && result.hasOwnProperty("stateAbbreviation") && result.hasOwnProperty("zipCode")) {
			var idString = (addressString?addressString + ", ":'') + result.city + ", " + result.stateAbbreviation + " " + result.zipCode+(result.country?", "+result.country:'');
			result['formattedAddress'] = idString;
			result['id'] = encodeURI(idString.replace(/ /g, '-').replace(/\#/g, '-').replace(/\//g, '-').replace(/\./g, '-').replace(/\,/g, '').replace(/\-+/g,'-'));
		}
		if(options.verbose) console.info('RESULT FOR "'+address+'":',result)
		return result;
	},

	randomCity: function() {
		var randomState = randomProperty(usCities);
		var randomStateData = usCities[randomState];
		var randomCityElementId = Math.floor(Math.random() * randomStateData.length);
		var randomCity = randomStateData[randomCityElementId];
		return { city: randomCity, state: randomState };
	},

	cities: function() {
		return (usCities);
	}
};


if(args.address) console.log(JSON.stringify(addrsr.parseAddress(args.address,args)));
else
module.exports = addrsr;
