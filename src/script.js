window.onload = function(){  App.init(); };	

var App = new _App();
function _App(){
	this.api_url 		= 'https://api-ssl.bitly.com/v3';
	this.access_token 	= '7d865fa60d6718999700c90433f7e7a2644af413';
	
	this.init = function(){
		// Reset forms
		var forms = document.querySelectorAll('form');
		for(var i=0; i<forms.length; i++) forms[i].reset();
		
		//document.querySelector('form').onsubmit();
	};
	
	this.submit = function(form){
		var scope = this;
		var error = false;
		var button = form.querySelector('button');
		var url = this.trim(form.querySelector('[name="url"]').value);
		if(!url.match(/(^http:\/\/|^https:\/\/)[a-z0-9_\-]{2,}\.[a-z]{2,}/i)) error = 'Please enter a valid URL';
		
		if(!error){
			this.lockButton(button, 'Loading...');
			this.bitly(url, function(data){
				scope.unlockButton(button);
				if(data !== false){
					alert(data.url);
				}else{
					alert("error");
				}	
			});
		}else{
			alert(error);	
		}
	};
	
	this.unlockButton = function(button){
		if(typeof button.original_label != "undefined") button.innerText = button.original_label;
		button.disabled = false;
	};
	
	this.lockButton = function(button, label){
		if(button.original_label == undefined) button.original_label = button.innerText;
		button.innerText = label;
		button.disabled = true;
	};
	
	this.bitly = function(url, callback){
		var data = { 
			format			: "json",
			access_token	: this.access_token,
			longUrl			: url
		};
		
		this.ajax(this.api_url + "/shorten", data,
			function(response){
				console.log(response);
				if(typeof response != 'object') callback(false);
				else 							callback(response.data);
			}
		);
	};
	
	this.ajax = function(url, data, callback, method){
		if(method == undefined) method = 'POST';
		
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open(method, url);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				if(xmlhttp.status == 200) 	callback(JSON.parse(xmlhttp.responseText));
				else 						callback(xmlhttp.statusText);
			}
		};
		var query = '';
		if(typeof data == 'object') for(var name in data) query += name + '=' + data[name] + '&';
		xmlhttp.send(query);	
	};
	
	this.trim = function(str){ return str.replace(/^\s+|\s+$/ig, ''); };
}


