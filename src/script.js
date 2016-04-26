window.onload = function(){  App.init(); };	

var App = new _App();
function _App(){
	this.api_url 		= 'https://api-ssl.bitly.com/v3';
	this.access_token 	= '7d865fa60d6718999700c90433f7e7a2644af413';
	
	this.init = function(){
		// Reset forms
		var forms = document.querySelectorAll('form');
		for(var i=0; i<forms.length; i++) this.resetForm(forms[i]);
		
		
		document.querySelector('[name="url"]').value = 'http://google.se';
		document.querySelector('form').onsubmit();
	};
	
	this.submit = function(form){
		var scope = this;
		var error = false;
		var button = form.querySelector('button');
		var url = this.trim(form.querySelector('[name="url"]').value);
		if(!url.match(/(^http:\/\/|^https:\/\/)[a-z0-9_\-]{2,}\.[a-z]{2,}/i)) error = 'Please enter a valid URL';
		
		if(!error){
			this.lockForm(form, 'Loading...');
			this.bitly(url, function(data){
				scope.unlockForm(form);
				if(data !== false){
					scope.addToHistory(data);
					scope.resetForm(form);
				}else{
					alert("error");
				}	
			});
		}else{
			alert(error);	
		}
	};
	
	this.addToHistory = function(data){
		var scope = this;
		var ul = document.querySelector('#history ul');
		if(!ul){
			document.querySelector('#history').innerHTML = '<ul></ul>';
			ul = document.querySelector('#history ul');
		}
		var li = document.createElement('li');
		li.innerHTML =  '<a href="' + data.url + '" class="short_url">' + data.url + '</a><br>';
		li.innerHTML += '<span class="long_url">' + data.long_url + '</span>';
		ul.insertBefore(li, ul.firstChild);
		ul.classList.remove('hide');
	};
	
	this.resetForm = function(form){
		form.reset();
	};
	
	this.unlockForm = function(form){
		var button = form.querySelector('button');
		if(typeof button.original_label != "undefined") button.innerText = button.original_label;
		var elements = form.querySelectorAll('button, input, select');
		for(var i=0; i<elements.length; i++) elements[i].disabled = false;
	};
	
	this.lockForm = function(form, label){
		var button = form.querySelector('button');
		if(button.original_label == undefined) button.original_label = button.innerText;
		button.innerText = label;
		var elements = form.querySelectorAll('button, input, select');
		for(var i=0; i<elements.length; i++) elements[i].disabled = true;
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


