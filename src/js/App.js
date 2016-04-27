window.addEventListener('load', function(){  App.init(); });	 

function _App(){
	this.api_url 		= 'https://api-ssl.bitly.com/v3';
	this.access_token 	= '7d865fa60d6718999700c90433f7e7a2644af413';
	
	this.init = function(){
		var scope = this;
		
		// Reset forms
		var forms = document.querySelectorAll('form');
		for(var i=0; i<forms.length; i++) this.resetForm(forms[i]);
		
		document.querySelector('.alert .close').onclick = scope.hideError;
		
		//this.autotest();
	};
	
	// TEST Code
	this.autotest = function(){
		document.querySelector('[name="url"]').value = 'http://google.se'; 
		document.querySelector('form').onsubmit();
	};
	
	// Handle form submit
	this.submit = function(form){   
		var scope = this;
		var error = false;
		var button = form.querySelector('button');
		var url = this.trim(form.querySelector('[name="url"]').value);
		
		// Validate URL
		if(!url.match(/(^http:\/\/|^https:\/\/)[a-z0-9_\-]{2,}\.[a-z]{2,}/i)) error = 'Please enter a valid URL';
		
		// Submit to bit.ly if there's no errors
		if(!error){
			this.hideError();
			this.lockForm(form, 'Loading...');
			
			this.bitly(url, function(data){
				scope.unlockForm(form);
				if(data !== false){
					scope.addToHistory(data);
					scope.resetForm(form);
				}else scope.showError("Ups! Something failed creating your new URL. Please try again.");
			});
		}else scope.showError(error);	
	};
	
	this.hideError = function(){
		document.querySelector('.alert').classList.add('hide');
	};
	
	this.showError = function(message){
		var elm = document.querySelector('.alert');
		elm.querySelector('.message').innerHTML = message;
		elm.classList.remove('hide');
	};
	
	this.addToHistory = function(data){
		var scope = this;
		var ul = document.querySelector('#history ul');
		if(!ul){
			document.querySelector('#history').innerHTML = '<ul class="list-group"></ul>';
			ul = document.querySelector('#history ul');
		}
		
		var li = document.createElement('li');
		li.className = "list-group-item";
		li.innerHTML =  '<a href="' + data.url + '" class="list-group-item-heading" target="_blank">' + data.url + '</a><br>';
		li.innerHTML += '<span class="list-group-item-text">' + data.long_url + '</span>';
		ul.insertBefore(li, ul.firstChild);
	};
	
	this.resetForm = function(form){ form.reset(); };
	
	// Unlock form, it's inputs and reset buttons label
	this.unlockForm = function(form){
		var button = form.querySelector('button');
		if(typeof button.original_label != "undefined") button.innerText = button.original_label;
		var elements = form.querySelectorAll('button, input, select');
		for(var i=0; i<elements.length; i++) elements[i].disabled = false;
	};
	
	// Lock form, it's inputs and change buttons label
	this.lockForm = function(form, label){
		var button = form.querySelector('button');
		if(button.original_label == undefined) button.original_label = button.innerText;
		button.innerText = label;
		var elements = form.querySelectorAll('button, input, select');
		for(var i=0; i<elements.length; i++) elements[i].disabled = true;
	};
	
	// Request URL shortening from bit.ly
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
global.App = new _App();




