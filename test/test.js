'use strict';

var expect = require('chai').expect;
var addresser = require('../index');

describe('#parseAddress', function() {
    it('should parse a simple address', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main St, Conway, SC");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Conway");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.hasOwnProperty("zipCode")).to.equal(false);
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a street name with two words', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Fat Duck St, Powder Springs, GA");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Fat Duck");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Fat Duck St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Powder Springs");
        expect(result.stateAbbreviation).to.equal("GA");
        expect(result.stateName).to.equal("Georgia");
        expect(result.hasOwnProperty("zipCode")).to.equal(false);
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a street address with double spaces', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, Conway, SC");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Conway");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.hasOwnProperty("zipCode")).to.equal(false);
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a street address with zip code in standard format', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, New Braunfels, TX 78132");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("New Braunfels");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal("78132");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a street address with zip code plus four in standard format', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, Conway, NC 29526-3131");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Conway");
        expect(result.stateAbbreviation).to.equal("NC");
        expect(result.stateName).to.equal("North Carolina");
        expect(result.zipCode).to.equal("29526");
        expect(result.zipCodePlusFour).to.equal("29526-3131");
    });
    it('should parse a street address with a state name', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, Conway, South Carolina 29526-3131");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Conway");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29526");
        expect(result.zipCodePlusFour).to.equal("29526-3131");
    });
    it('should parse a street address with a lowercase state name', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, Conway, south carolina 29526-3131");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Conway");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29526");
        expect(result.zipCodePlusFour).to.equal("29526-3131");
    });
    it('should parse a street address with a lowercase state abbeviation', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, San Antonio, tx 29526-3131");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal("29526");
        expect(result.zipCodePlusFour).to.equal("29526-3131");
    });
    it('should parse a street address with a delimited zip code', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main  St, Canyon Lake, tx, 29526-3131");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Canyon Lake");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal("29526");
        expect(result.zipCodePlusFour).to.equal("29526-3131");
    });
    it('should not parse a street address with missing city and state', function() {
        expect(addresser.parseAddress.bind(addresser.parseAddress, "123 Main  St")).to.throw('Can not parse address.');
    });
    it('should validate input is not undefined', function() {
        expect(addresser.parseAddress.bind(addresser.parseAddress)).to.throw('Argument must be a non-empty string.');
    });
    it('should validate input is a non-empty string', function() {
        expect(addresser.parseAddress.bind(addresser.parseAddress, "")).to.throw('Argument must be a non-empty string.');
    });
    it('should not parse an invalid state abbreviation', function() {
        expect(addresser.parseAddress.bind(addresser.parseAddress, "123 Main St, Canyon Lake, XX, 29526-3131")).to.throw('Can not parse address.');
    });
    it('should parse an address with same street and city name', function() {
        var result = {};
        try{ result=addresser.parseAddress("400 South Orange Ave, South Orange , NJ 07079");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("400");
        expect(result.streetName).to.equal("South Orange");
        expect(result.streetSuffix).to.equal("Ave");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("400 South Orange Ave");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("South Orange");
        expect(result.stateAbbreviation).to.equal("NJ");
        expect(result.stateName).to.equal("New Jersey");
        expect(result.zipCode).to.equal("07079");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with no city delimiter', function() {
        var result = {};
        try{ result=addresser.parseAddress("1301 Columbia College Drive Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Columbia College");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("1301 Columbia College Dr");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with a secondary value on same section with city', function() {
        var result = {};
        try{ result=addresser.parseAddress("1301 Columbia College Drive Unit 101 Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Columbia College");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.addressLine1).to.equal("1301 Columbia College Dr");
        expect(result.addressLine2).to.equal("Unit 101");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with a secondary value on separate line', function() {
        var result = {};
        try{ result=addresser.parseAddress("1301 Columbia College Drive, APT A, Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Columbia College");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("1301 Columbia College Dr");
        expect(result.addressLine2).to.equal("APT A");
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with a glen plus haven suffix', function() {
        var result = {};
        try{ result=addresser.parseAddress("1301 Glen Haven, Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Glen");
        expect(result.streetSuffix).to.equal("Hvn");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("1301 Glen Hvn");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with a direction following the street type', function() {
        var result = {};
        try{ result=addresser.parseAddress("1301 Acme Street E, Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Acme");
        expect(result.streetSuffix).to.equal("St");
        expect(result.streetDirection).to.equal("E");
        expect(result.addressLine1).to.equal("1301 Acme St E");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with a lowercase direction following the street type', function() {
        var result = {};
        try{ result=addresser.parseAddress("1301 Acme Street e, Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Acme");
        expect(result.streetSuffix).to.equal("St");
        expect(result.streetDirection).to.equal("E");
        expect(result.addressLine1).to.equal("1301 Acme St E");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with line 2 incorrectly placed before line 1', function() {
        var result = {};
        try{ result=addresser.parseAddress("UNIT 101, 1301 Acme Street E, Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Acme");
        expect(result.streetSuffix).to.equal("St");
        expect(result.streetDirection).to.equal("E");
        expect(result.addressLine1).to.equal("1301 Acme St E");
        expect(result.addressLine2).to.equal("UNIT 101");
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with secondary address at the beginning of line 1', function() {
        var result = {};
        try{ result=addresser.parseAddress("UNIT 101, 1301 Acme Avenue, Columbia, SC 29203");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1301");
        expect(result.streetName).to.equal("Acme");
        expect(result.streetSuffix).to.equal("Ave");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("1301 Acme Ave");
        expect(result.addressLine2).to.equal("UNIT 101");
        expect(result.city).to.equal("Columbia");
        expect(result.stateAbbreviation).to.equal("SC");
        expect(result.stateName).to.equal("South Carolina");
        expect(result.zipCode).to.equal("29203");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse an address with a trailing directional, all caps, and no delimiters', function() {
        var result = {};
        try{ result=addresser.parseAddress("300 BOYLSTON ST E SEATTLE WA 98102");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("300");
        expect(result.streetName).to.equal("Boylston");
        expect(result.streetSuffix).to.equal("St");
        expect(result.streetDirection).to.equal("E");
        expect(result.addressLine1).to.equal("300 Boylston St E");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Seattle");
        expect(result.stateAbbreviation).to.equal("WA");
        expect(result.stateName).to.equal("Washington");
        expect(result.zipCode).to.equal("98102");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });

    it('should parse an address with a trailing country', function() {
        var result = {};
        try{ result=addresser.parseAddress("300 BOYLSTON AVE, SEATTLE WA 98102, USA");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("300");
        expect(result.streetName).to.equal("Boylston");
        expect(result.streetSuffix).to.equal("Ave");
        expect(result.addressLine1).to.equal("300 Boylston Ave");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Seattle");
        expect(result.stateAbbreviation).to.equal("WA");
        expect(result.stateName).to.equal("Washington");
        expect(result.zipCode).to.equal("98102");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });

    it('should parse a valid address for a small city not in us-cities.json file', function() {
        var result = {};
        try{ result=addresser.parseAddress("5555 Duffek Dr, Kirby, TX 78219");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("5555");
        expect(result.streetName).to.equal("Duffek");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.addressLine1).to.equal("5555 Duffek Dr");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Kirby");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal("78219");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });

    it('should parse an address with a dot after street abbreviation', function() {
        var result = {};
        try{ result=addresser.parseAddress("200 SUMMIT LAKE DR., VALHALLA NY 10595");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("200");
        expect(result.streetName).to.equal("Summit Lake");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.addressLine1).to.equal("200 Summit Lake Dr");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Valhalla");
        expect(result.stateAbbreviation).to.equal("NY");
        expect(result.stateName).to.equal("New York");
        expect(result.zipCode).to.equal("10595");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });

    it('should parse an address with a newline separator', function() {
        var result = {};
        try{ result=addresser.parseAddress("200 SUMMIT LAKE DR.\nVALHALLA NY 10595");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("200");
        expect(result.streetName).to.equal("Summit Lake");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.addressLine1).to.equal("200 Summit Lake Dr");
        expect(result).to.not.have.property('addressLine2');
        expect(result.city).to.equal("Valhalla");
        expect(result.stateAbbreviation).to.equal("NY");
        expect(result.stateName).to.equal("New York");
        expect(result.zipCode).to.equal("10595");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });

    it('should parse an address with a PO BOX', function() {
        var result = {};
        try{ result=addresser.parseAddress("PO BOX 538\nBASILE LA 70515-0538");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("PO BOX 538");
        expect(result).to.not.have.property('addressLine2');
        expect(result).to.not.have.property('streetNumber');
        expect(result).to.not.have.property('streetName');
        expect(result).to.not.have.property('streetSuffix');
        expect(result.city).to.equal("Basile");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("70515");
        expect(result.zipCodePlusFour).to.equal("70515-0538");
    });
    it('should parse an address with a PO BOX, no state', function() {
        var result = {};
        try{ result=addresser.parseAddress("P.O.box # 285, Republic, 99166, US");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("P.O.box # 285");
        expect(result).to.not.have.property('addressLine2');
        expect(result).to.not.have.property('streetNumber');
        expect(result).to.not.have.property('streetName');
        expect(result).to.not.have.property('streetSuffix');
        expect(result.city).to.equal("Republic");
        expect(result.zipCode).to.equal("99166");
    });
    it('should parse an address with a Canadian PO BOX, no province', function() {
        var result = {};
        try{ result=addresser.parseAddress("Box 1233, Jasper, T0E1E0");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("Box 1233");
        expect(result).to.not.have.property('addressLine2');
        expect(result).to.not.have.property('streetNumber');
        expect(result).to.not.have.property('streetName');
        expect(result).to.not.have.property('streetSuffix');
        expect(result.stateAbbreviation).to.equal("AB");
        expect(result.city).to.equal("Jasper");
        expect(result.zipCode).to.equal("T0E 1E0");
    });
    it('should parse an address with a Canadian PO BOX, no province with trailing country name', function() {
        var result = {};
        try{ result=addresser.parseAddress("Box 1233, Jasper, T0E1E0, Canada");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("Box 1233");
        expect(result).to.not.have.property('addressLine2');
        expect(result).to.not.have.property('streetNumber');
        expect(result).to.not.have.property('streetName');
        expect(result).to.not.have.property('streetSuffix');
        expect(result.stateAbbreviation).to.equal("AB");
        expect(result.city).to.equal("Jasper");
        expect(result.zipCode).to.equal("T0E 1E0");
    });
    it('should parse an address with a Canadian PO BOX, shorten avenue and direction', function() {
        var result = {};
        try{ result=addresser.parseAddress("Box 540, 131 Central Ave. SE, Falher, T0H 1M0, Canada");} catch(er){console.error(er);}
        expect(result.poBox).to.equal("Box 540");
        expect(result.stateAbbreviation).to.equal("AB");
        expect(result.streetNumber).to.equal("131");
        expect(result.streetName).to.equal("Central");
        expect(result.streetSuffix).to.equal("Ave");
        expect(result.addressLine1).to.equal("131 Central Ave SE");
        expect(result.streetDirection).to.equal("SE");
        expect(result.city).to.equal("Falher");
        expect(result.zipCode).to.equal("T0H 1M0");
    });
    it('should parse an address with a Canadian PO BOX after street address, shorten drive', function() {
        var result = {};
        try{ result=addresser.parseAddress("39 Keene dr, P.O. Box 291, Keene, K0L 2G0, Canada");} catch(er){console.error(er);}
        expect(result.poBox).to.equal("P.O. Box 291");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.streetNumber).to.equal("39");
        expect(result.streetName).to.equal("Keene");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.addressLine1).to.equal("39 Keene Dr");
        expect(result.city).to.equal("Keene");
        expect(result.zipCode).to.equal("K0L 2G0");
    });

    
    
    

    

    it('should parse an address with a PO BOX written as P.O. DRAWER', function() {
        var result = {};
        try{ result=addresser.parseAddress("P.O. DRAWER 538\nBASILE LA 70515-0538");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("P.O. DRAWER 538");
        expect(result).to.not.have.property('addressLine2');
        expect(result).to.not.have.property('streetNumber');
        expect(result).to.not.have.property('streetName');
        expect(result).to.not.have.property('streetSuffix');
        expect(result.city).to.equal("Basile");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("70515");
        expect(result.zipCodePlusFour).to.equal("70515-0538");
    });

    it('should provide an id for a valid address', function() {
        var result = {};
        try{ result=addresser.parseAddress("PO BOX 538\nBASILE LA 70515-0538");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("PO BOX 538");
        expect(result.id).to.equal('PO-BOX-538-Basile-LA-70515');
    });
    
    it('should provide an id for a valid address with second address line', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main St Unit 101, Conway, SC 29526");} catch(er){console.error(er);}
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.addressLine2).to.equal("Unit 101");
        expect(result.id).to.equal('123-Main-St-Unit-101-Conway-SC-29526');
    });
    
    it('should not provide an id if mandatory components are not present', function() {
        var result = {};
        try{ result=addresser.parseAddress("1010 PINE, 9E-6-01\nST. LOUIS MO");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1010");
        expect(result.streetName).to.equal("Pine");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("1010 Pine");
        expect(result.addressLine2).to.equal("9E-6-01");
        expect(result.city).to.equal("St. Louis");
        expect(result.stateAbbreviation).to.equal("MO");
        expect(result.stateName).to.equal("Missouri");
        expect(result).to.not.have.property("zipCode");
        expect(result).to.not.have.property("zipCodePlusFour");
        expect(result).to.not.have.property("id");
    });

    it('should parse a street address ending in pass', function() {
        var result = {};
        try{ result=addresser.parseAddress("15001 Strathaven Pass, Pflugerville, TX 78660");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("15001");
        expect(result.streetName).to.equal("Strathaven");
        expect(result.streetSuffix).to.equal("Pass");
        expect(result.addressLine1).to.equal("15001 Strathaven Pass");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Pflugerville");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal("78660");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    
    it('should parse a street address with "Ave C" style street name', function() {
        var result = {};
        try{ result=addresser.parseAddress("826 N Ave C, Crowley, LA 70526");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("826");
        expect(result.streetName).to.equal("N Ave C");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("826 N Ave C");
        expect(result).to.not.have.property('addressLine2');;
        expect(result.city).to.equal("Crowley");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("70526");
        expect(result).to.not.have.property("zipCodePlusFour");
    });

    it('should parse a street address with french "Avenue" style street name', function() {
        var result = {};
        try{ result=addresser.parseAddress("405 Avenue Ogilvy, Montreal, QC H3N 1M3, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("405");
        expect(result.streetName).to.equal("Ogilvy");
        expect(result.streetPrefix).to.equal("Avenue");
        //expect(result).to.not.have.property('streetSuffix');
        expect(result.addressLine1).to.equal("405 Avenue Ogilvy");
        //expect(result).to.not.have.property('addressLine2');
        expect(result.city).to.equal("Montreal");
        expect(result.stateAbbreviation).to.equal("QC");
        //expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("H3N 1M3");
        //expect(result).to.not.have.property("zipCodePlusFour");
    });
    it('should parse a street address with french "Av." style street name', function() {
        var result = {};
        try{ result=addresser.parseAddress("405 Av. Ogilvy, Montreal, QC H3N 1M3, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("405");
        expect(result.streetName).to.equal("Ogilvy");
        expect(result.streetPrefix).to.equal("Av.");
        //expect(result).to.not.have.property('streetSuffix');
        expect(result.addressLine1).to.equal("405 Av. Ogilvy");
        //expect(result).to.not.have.property('addressLine2');
        expect(result.city).to.equal("Montreal");
        expect(result.stateAbbreviation).to.equal("QC");
        //expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("H3N 1M3");
        //expect(result).to.not.have.property("zipCodePlusFour");
    });
    it('should parse a street address with "Avenue N" style street name', function() {
        var result = {};
        try{ result=addresser.parseAddress("826 N Avenue N, Crowley, LA 70526");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("826");
        expect(result.streetName).to.equal("N Ave N");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("826 N Ave N");
        expect(result).to.not.have.property('addressLine2');;
        expect(result.city).to.equal("Crowley");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("70526");
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse a street address with "Ave. b" style street name', function() {
        var result = {};
        try{ result=addresser.parseAddress("826 N Ave. b, Crowley, LA 70526");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("826");
        expect(result.streetName).to.equal("N Ave B");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("826 N Ave B");
        expect(result).to.not.have.property('addressLine2');;
        expect(result.city).to.equal("Crowley");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("70526");
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse a street address with "Ave. b" style street name with non delimited second address line', function() {
        var result = {};
        try{ result=addresser.parseAddress("826 N Ave. b Unit 101, Crowley, LA 70526");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("826");
        expect(result.streetName).to.equal("N Ave B");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("826 N Ave B");
        expect(result.addressLine2).to.equal("Unit 101");
        expect(result.city).to.equal("Crowley");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result.zipCode).to.equal("70526");
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse a street address without a normal suffix like 123 Texas Gold', function() {
        var result = {};
        try{ result=addresser.parseAddress("12939 Texas Gold, San Antonio, TX 78253");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("12939");
        expect(result.streetName).to.equal("Texas Gold");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal('12939 Texas Gold');
        expect(result).to.not.have.property('addressLine2');;
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal('78253');
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse a street address without a normal suffix and 2nd address line like 123 Texas Gold Unit 101', function() {
        var result = {};
        try{ result=addresser.parseAddress("12939 Texas Gold Unit 101, San Antonio, TX 78253");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("12939");
        expect(result.streetName).to.equal("Texas Gold");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("12939 Texas Gold");
        expect(result.addressLine2).to.equal("Unit 101");
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal('78253');
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse an Interstate address with a # unit', function() {
        var result = {};
        try{ result=addresser.parseAddress("10701 S Interstate 35 # 36, Austin, TX");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("10701");
        expect(result.streetName).to.equal("S Interstate 35");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("10701 S Interstate 35");
        expect(result.addressLine2).to.equal("# 36");
        expect(result.city).to.equal("Austin");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse FM number style road names', function() {
        var result = {};
        try{ result=addresser.parseAddress("11434 W FM 471, San Antonio, TX");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("11434");
        expect(result.streetName).to.equal("W FM 471");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("11434 W FM 471");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse street name ending in Oak', function() {
        var result = {};
        try{ result=addresser.parseAddress("24330 Invitation Oak, San Antonio, TX");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("24330");
        expect(result.streetName).to.equal("Invitation Oak");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("24330 Invitation Oak");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse street name thats just a number', function() {
        var result = {};
        try{ result=addresser.parseAddress("506 W 1100, Chesterton, IN");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("506");
        expect(result.streetName).to.equal("W 1100");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("506 W 1100");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("Chesterton");
        expect(result.stateAbbreviation).to.equal("IN");
        expect(result.stateName).to.equal("Indiana");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });

    it('should parse street name that ends in Run', function() {
        var result = {};
        try{ result=addresser.parseAddress("25403 Longbranch Run, San Antonio, TX");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("25403");
        expect(result.streetName).to.equal("Longbranch Run");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("25403 Longbranch Run");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse street name that ends in Chase', function() {
        var result = {};
        try{ result=addresser.parseAddress("22923 Cardigan Chase, San Antonio, TX");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("22923");
        expect(result.streetName).to.equal("Cardigan Chase");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("22923 Cardigan Chase");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse street name that ends in Day', function() {
        var result = {};
        try{ result=addresser.parseAddress("7114 Sunny Day, San Antonio, TX");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("7114");
        expect(result.streetName).to.equal("Sunny Day");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("7114 Sunny Day");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse street name that has a leading directional and is just a number', function() {
        var result = {};
        try{ result=addresser.parseAddress("110 N 2500, Vernal, UT");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("110");
        expect(result.streetName).to.equal("N 2500");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("110 N 2500");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("Vernal");
        expect(result.stateAbbreviation).to.equal("UT");
        expect(result.stateName).to.equal("Utah");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse "123 Rue Dauphine style address', function() {
        var result = {};
        try{ result=addresser.parseAddress("625 Rue Dauphine, Eunice, LA");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("625");
        expect(result.streetName).to.equal("Rue Dauphine");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("625 Rue Dauphine");
        expect(result).to.not.have.property("addressLine2");        
        expect(result.city).to.equal("Eunice");
        expect(result.stateAbbreviation).to.equal("LA");
        expect(result.stateName).to.equal("Louisiana");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse street name of N Portola with unit name', function() {
        var result = {};
        try{ result=addresser.parseAddress("47 N Portola, # 35, Laguna Beach, CA");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("47");
        expect(result.streetName).to.equal("N Portola");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("47 N Portola");
        expect(result.addressLine2).to.equal("# 35");
        expect(result.city).to.equal("Laguna Beach");
        expect(result.stateAbbreviation).to.equal("CA");
        expect(result.stateName).to.equal("California");
        expect(result).to.not.have.property("zipCode");        
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse a street name with no suffix but the street name itself matches a suffix', function() {
        var result = {};
        try{ result=addresser.parseAddress("1010 PINE, 9E-6-01\nST. LOUIS MO 63101");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1010");
        expect(result.streetName).to.equal("Pine");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("1010 Pine");
        expect(result.addressLine2).to.equal("9E-6-01");
        expect(result.city).to.equal("St. Louis");
        expect(result.stateAbbreviation).to.equal("MO");
        expect(result.stateName).to.equal("Missouri");
        expect(result.zipCode).to.equal("63101");
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should return a formattedAddress field', function() {
        var result = {};
        try{ result=addresser.parseAddress("12939 Texas Gold, San Antonio, TX 78253");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("12939");
        expect(result.streetName).to.equal("Texas Gold");
        expect(result).to.not.have.property('streetSuffix')
        expect(result.addressLine1).to.equal("12939 Texas Gold");
        expect(result).to.not.have.property('addressLine2')
        expect(result.formattedAddress).to.equal("12939 Texas Gold, San Antonio, TX 78253");
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal('78253');
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should return a formattedAddress field when a second address line is provided', function() {
        var result = {};
        try{ result=addresser.parseAddress("12939 Live Oak Street Unit 101, San Antonio, TX 78253");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("12939");
        expect(result.streetName).to.equal("Live Oak");
        expect(result.streetSuffix).to.equal("St");
        expect(result.addressLine1).to.equal("12939 Live Oak St");
        expect(result.addressLine2).to.equal("Unit 101");
        expect(result.formattedAddress).to.equal("12939 Live Oak St, Unit 101, San Antonio, TX 78253");
        expect(result.city).to.equal("San Antonio");
        expect(result.stateAbbreviation).to.equal("TX");
        expect(result.stateName).to.equal("Texas");
        expect(result.zipCode).to.equal('78253');
        expect(result).to.not.have.property("zipCodePlusFour");
    });
    
    it('should parse a simple Canadian Address without zip Code', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main St, Toronto, ON");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Toronto");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.stateName).to.equal("Ontario");
        expect(result.hasOwnProperty("zipCode")).to.equal(false);
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    
    it('should parse a simple Canadian Address with zip Code', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main St, Toronto, ON M3K5K9");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Toronto");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.stateName).to.equal("Ontario");
        expect(result.zipCode).to.equal("M3K 5K9");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a simple Canadian Address with Trailing Country', function() {
        var result = {};
        try{ result=addresser.parseAddress("123 Main St, Toronto, ON M3K5K9, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("123");
        expect(result.streetName).to.equal("Main");
        expect(result.streetSuffix).to.equal("St");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("123 Main St");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Toronto");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.stateName).to.equal("Ontario");
        expect(result.zipCode).to.equal("M3K 5K9");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a Canadian Address, saint name street', function() {
        var result = {};
        try{ result=addresser.parseAddress("1519 Ste-Marie, Embrun, Ontario K0A 1W0, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("1519");
        expect(result.streetName).to.equal("Ste-Marie");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("1519 Ste-Marie");
        expect(result.hasOwnProperty("addressLine2")).to.equal(false);
        expect(result.city).to.equal("Embrun");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.stateName).to.equal("Ontario");
        expect(result.zipCode).to.equal("K0A 1W0");
        expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
    });
    it('should parse a Canadian Address, coma separated streetNumber', function() {
        var result = {};
        try{ result=addresser.parseAddress("60, rue Cartier # 614, St Lambert, Quebec J4R0A5, Canada");} catch(er){console.error(er);}
        expect(result.subPremise).to.equal("614");
        expect(result.streetNumber).to.equal("60");
        expect(result.streetName).to.equal("rue Cartier");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.addressLine1).to.equal("60 rue Cartier");
        expect(result.city).to.equal("St Lambert");
        expect(result.stateAbbreviation).to.equal("QC");
        expect(result.zipCode).to.equal("J4R 0A5");
    });
    it('should parse a Canadian Address Numbered avenue, unit number, po box', function() {
        var result = {};
        try{ result=addresser.parseAddress("4501 50e avenue 2nd floor, P.O. Box 1320, Yellowknife, Northwest Territories X1A2L9, Canada");} catch(er){console.error(er);}
        expect(result.subPremise).to.equal("2nd floor");
        expect(result.poBox).to.equal("P.O. Box 1320");
        expect(result.streetNumber).to.equal("4501");
        expect(result.streetName).to.equal("50e");
        expect(result.hasOwnProperty("streetDirection")).to.equal(false);
        expect(result.streetSuffix).to.equal("Ave");
        expect(result.addressLine1).to.equal("4501 50e Ave");
        expect(result.city).to.equal("Yellowknife");
        expect(result.stateAbbreviation).to.equal("NT");
        expect(result.zipCode).to.equal("X1A 2L9");
    });
    it('should parse a Canadian Address with place/business name, Road direction long name', function() {
        var result = {};
        try{ result=addresser.parseAddress("Community Living Association, 178 Townline Rd East #17-A, Carleton Place, Ontario K7C 2C2, Canada");} catch(er){console.error(er);}
        expect(result.placeName).to.equal('Community Living Association');
        expect(result.subPremise).to.equal("17-A");
        expect(result.streetNumber).to.equal("178");
        expect(result.streetName).to.equal("Townline");
        expect(result.streetDirection).to.equal('East');
        expect(result.streetSuffix).to.equal("Rd");
        expect(result.addressLine1).to.equal("178 Townline Rd East");
        expect(result.city).to.equal("Carleton Place");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.zipCode).to.equal("K7C 2C2");
    });
    it('should parse a numbered direction street', function() {
        var result = {};
        try{ result=addresser.parseAddress("APT 34B 9 W 31ST ST, NEW YORK, New York 10001-4552, US");} catch(er){console.error(er);}
        expect(result.subPremise).to.equal("APT 34B");
        expect(result.streetNumber).to.equal("9");
        expect(result.streetName).to.equal("31st");
        expect(result.streetDirection).to.equal('W');
        expect(result.streetSuffix).to.equal("St");
        expect(result.addressLine1).to.equal("9 31st St W");
        expect(result.city).to.equal("New York");
        expect(result.stateAbbreviation).to.equal("NY");
        expect(result.zipCode).to.equal("10001");
    });
    it('should parse place name, walmart store name', function() {
        var result = {};
        try{ result=addresser.parseAddress("120 Columbus Drive, Conception Square, Walmart Carbonear Store 3015, Carbonear, Newfoundland A1Y 1B3, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("120");
        expect(result.streetName).to.equal("Columbus");
        expect(result.streetSuffix).to.equal("Dr");
        expect(result.placeName).to.equal("Walmart Carbonear Store 3015");
        expect(result.addressLine2).to.equal("Conception Square");
        expect(result.addressLine1).to.equal("120 Columbus Dr");
        expect(result.city).to.equal("Carbonear");
        expect(result.stateAbbreviation).to.equal("NL");
        expect(result.zipCode).to.equal("A1Y 1B3");
    });
    it('should parse place name with numbers', function() {
        var result = {};
        try{ result=addresser.parseAddress("COMMUNITY OUTREACH ACADEMY SITE 126, 5640 DUDLEY BLVD, MCCLELLAN, California 95652-1034, US");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("5640");
        expect(result.streetName).to.equal("Dudley");
        expect(result.streetSuffix).to.equal("Blvd");
        expect(result.placeName).to.equal("Community Outreach Academy Site 126");
        expect(result.addressLine1).to.equal("5640 Dudley Blvd");
        expect(result.city).to.equal("Mcclellan");
        expect(result.stateAbbreviation).to.equal("CA");
        expect(result.zipCode).to.equal("95652");
    });
    it('Front street should not be parsed as subPremise', function() {
        var result = {};
        try{ result=addresser.parseAddress("76 Front St, Emo, Ontario P0W1E0, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("76");
        expect(result.streetName).to.equal("Front");
        expect(result.addressLine1).to.equal("76 Front St");
        expect(result.city).to.equal("Emo");
        expect(result.stateAbbreviation).to.equal("ON");
        expect(result.zipCode).to.equal("P0W 1E0");
    });
    it('Should parse address contain apostrophe \'', function() {
        var result = {};
        try{ result=addresser.parseAddress("249,Montee de l'Eglise, St-Colomban, Quebec J5K 2H8, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("249");
        expect(result.streetName).to.equal("Montee de l'Eglise");
        expect(result.addressLine1).to.equal("249 Montee de l'Eglise");
        expect(result.city).to.equal("St-Colomban");
        expect(result.stateAbbreviation).to.equal("QC");
        expect(result.zipCode).to.equal("J5K 2H8");
    });
    
    it('Extra: Apt 320-9820 boul Gouin O, PIERREFONDS, Quebec H8Y 3G7, Canada', function() {
        var result = {};
        try{ result=addresser.parseAddress("Apt 320-9820 boul Gouin O, PIERREFONDS, Quebec H8Y 3G7, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("9820");
        expect(result.streetName).to.equal("Gouin");
        expect(result.addressLine1).to.equal("9820 Boul Gouin O");
        expect(result.city).to.equal("Pierrefonds");
        expect(result.stateAbbreviation).to.equal("QC");
        expect(result.zipCode).to.equal("H8Y 3G7");
        expect(result.streetDirection).to.equal('O');
    });
    it('Extra: 3260 rue du Chanoine Chamberland, Trois-Rivieres, Quebec G8Z 2T2, Canada', function() {
        var result = {};
        try{ result=addresser.parseAddress("3260 rue du Chanoine Chamberland, Trois-Rivieres, Quebec G8Z 2T2, Canada");} catch(er){console.error(er);}
        expect(result.streetNumber).to.equal("3260");
        expect(result.streetName).to.equal("rue du Chanoine Chamberland");
        expect(result.addressLine1).to.equal("3260 rue du Chanoine Chamberland");
        expect(result.city).to.equal("Trois-Rivieres");
        expect(result.stateAbbreviation).to.equal("QC");
        expect(result.zipCode).to.equal("G8Z 2T2");
    });
    
    
    
    
});

describe('#randomCity', function() {
    it('should provide a random city', function() {
        for (var i = 0; i < 20; i++) { 
            var result=addresser.randomCity();
            expect(result.hasOwnProperty("city")).to.equal(true);
            expect(result['city'].length).to.be.above(1);
            expect(result.hasOwnProperty("state")).to.equal(true);
            expect(result['state'].length).to.equal(2);
        }
    });
});

describe('##cities', function() {
    it('should provide a full list of cities', function() {
        var result=addresser.cities();
        expect(result['WV'].includes('War')).to.be.true;
        expect(result['ND'].includes('Center')).to.be.true;
        expect(result['LA'].includes('Bentley')).to.be.true;
        expect(result['NY'].includes('Cleveland')).to.be.true;
        expect(result['SC'].includes('Marion')).to.be.true;
        expect(result['TX'].length).to.be.greaterThan(300);
        expect(result['TX'].includes('ThisCityCannot143234234234234PossiblyExist')).to.be.false;
    });
});
