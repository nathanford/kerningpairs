/*

KerningPairs.js by Nathan Ford 

This script uses stylfill.js (https://github.com/nathanford/stylefill/) to allow properties to be written in the CSS.

To use the kerning-pairs propery, just write it in your CSS like any other property.

The syntax is: [first character][second character] distance;

You can add as many pairs as you like. Separate each pair value with a comma, for example:

h1 {
	kerning-pairs: tu 0.01em,
								 az -0.01em,
								 – 	-0.05em;
} 

Note in the last pair value that special characters and spaces are also read in the character pair.

*/

var stylefill = {

	objSize : function(obj) {
	
	    var size = 0, key;
	    
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    
	    return size;
	    
	},
	
	arraySliceShim : function () { // fixes Array.prototype.slice support for IE lt 9
	
		'use strict';
    var _slice = Array.prototype.slice;

    try {
        _slice.call(document.documentElement); 
    }
    catch (e) { // Fails in IE < 9
    
        Array.prototype.slice = function (begin, end) {
        
            var i, arrl = this.length, a = [];
            
            if (this.charAt) { 
            
                for (i = 0; i < arrl; i++) {
                    a.push(this.charAt(i));
                }
                
            }
            else { 
            
                for (i = 0; i < this.length; i++) { 
                    a.push(this[i]);
                }
                
            }
            
            return _slice.call(a, begin, end || a.length);
            
        };
        
    }
	
	},

	init : function (params) {
		
		this.arraySliceShim();
		
		for (property in params) {
			
			var func = params[property];	
					
			this.getStyleSheet(property, func);
		
		}
	
	},
	
	loadFile : function(url, property, func) {
	
	    var req;
	
	    if (window.XMLHttpRequest) req = new XMLHttpRequest();
	    else req = new ActiveXObject("Microsoft.XMLHTTP");
	    
	    req.open("GET", url, true);
	
	    req.onreadystatechange = function() {
	    	
	      if (this.readyState == 4 && this.status == 200) stylefill.findRules(property, this.responseText, func);
	      
	    };
	    
	    req.send(null);	
	
	},
	
	getStyleSheet : function (property, func) {
	
		var sheetstext = new Array(),
				sheets = Array.prototype.slice.call(document.getElementsByTagName('link')); // grab stylesheet links - not used yet
				
				sheets.push(Array.prototype.slice.call(document.getElementsByTagName('style'))[0]); // add on page CSS
				
		var scount = this.objSize(sheets);
		
		while (scount-- > 0) {
			
			var sheet = sheets[scount];
			
			if (sheet.innerHTML) this.findRules(property, sheet.innerHTML, func);
			else this.loadFile(sheet.href, property, func);
					
		}
	
	},
	
	checkRule : function (property) {
		
		var propertyCamel = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) { return m3.toUpperCase(); });
		
		if (('Webkit' + propertyCamel) in document.body.style 
		 || ('Moz' + propertyCamel) in document.body.style 
		 || ('O' + propertyCamel) in document.body.style 
		 || property in document.body.style) return true;
	
	},
	
	findRules : function (property, sheettext, func) {
		
		var rules = { support: false };
			
		if (sheettext) {
			
			if (!this.checkRule(property)) { // check if rule is valid now
			
				var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'), 
						selmatch, i = 0;
				
				while (selmatch = selreg.exec(sheettext)) {
		   		
					rules['rule' + i] = {
						
						selector: selmatch[1].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
						property: property,
						value: selmatch[3]
						
					};
					
					i++;
				
				}
			    
			}
			else rules.support = true;
			
			func(rules);
		
		}
		
	}

};

kerningPairs = function (rules) {
		
	var traverseNodes = function (node, pairs) {
	 
	    var next;
	 
	    if (node.nodeType === 1) {
	    
        if (node = node.firstChild) {
        
            do {
            
              next = node.nextSibling;
              traverseNodes(node, pairs);
              
            } while(node = next);
            
        }
	 
	    } else if (node.nodeType === 3) kernText(node, pairs);
	 
	},
	
	kernText = function (node, pairs) {
		
		var nodetext = node.textContent,
				nodechars = nodetext.split(''),
				
				parent = node.parentNode,
				
				pcount = pairs.length;
		
		while (pcount-- > 0) {
			
			var pair = pairs[pcount].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
					chars = pair.match(/^(.)(.)\s/i),
					amount = pair.match(/\s(\-*[0-9.]+[a-z]+)$/i)[1],
					
					ccount = nodechars.length;
					
					while (ccount-- > 0) {
					
						var char = nodechars[ccount],
								nextchar = nodechars[ccount + 1],
								charpair = char + nextchar,
								
								nextcharreg = new RegExp('^(<span[^>]+>)*' + chars[2] + '(<\/\s*span\s*>)*$', 'i');
								
								//console.log((char == chars[1] && nextchar.match(nextcharreg)));
								
								if (char == chars[1] && nextchar && nextchar.match(nextcharreg)) 
									nodechars[ccount] = '<span style="letter-spacing:' + amount + '">' + char + '</span>';
						
					}					
				
		}	
		
		var temp = document.createElement('div');
		
		temp.innerHTML = nodechars.join('');
		
		while (temp.firstChild) parent.insertBefore(temp.firstChild, node);
		
		parent.removeChild(node);
	
	};
	
	for (i in rules) {
		
		if (rules[i] && rules[i] != 'none') {
		
			var rule = rules[i],
					eles = document.querySelectorAll(rule.selector),
					elescount = eles.length,
					
					val = rule.value,
					pairs = val.split(',');
				
			while (elescount-- > 0) {
				
				var ele = eles[elescount];
				
				traverseNodes(ele, pairs);
				
			}
		
		}
	
	}		
	
}

// assign the CSS property to the function
stylefill.init({

	'kerning-pairs' : kerningPairs

});