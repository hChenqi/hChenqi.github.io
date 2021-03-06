var obj_article_list = document.getElementById('article-list');
var obj_article = document.getElementById('article');
var request = new XMLHttpRequest();
var article_dir_map = new Map();


function load_file(file_path, on_success){
	request.onreadystatechange = function () {
		if (request.readyState == 4 && (request.status == 0 || request.status == 200)) { 
			on_success(request.responseText); 
		}
	};
	request.open('GET', file_path, false);
	request.send();
}

function load_article_list(){
	load_file('article_list.txt', function(response){
		const article_list = response.split(/\r?\n/);
		let current_dir = '';
		for(const article_title of article_list){
			if(article_title == '') { 
				obj_article_list.appendChild(document.createElement('br'));
			} else if(article_title[0] == '#'){
				const article_group = article_title.split(' ');
				let obj_article_title = document.createElement('div');
				obj_article_title.className = 'article-group';
				obj_article_title.innerText = article_group[1];
				obj_article_list.appendChild(obj_article_title);
				current_dir = article_group[2];
			} else {
				let obj_article_title = document.createElement('a');
				obj_article_title.className = 'article-title';
				obj_article_title.href = '#'+ article_title;
				obj_article_title.innerText = article_title;
				obj_article_list.appendChild(obj_article_title);
				article_dir_map[article_title] = current_dir;
			}
		}
	});
}

function load_article(article_title) {
	if(article_title == ''){
		obj_article_list.style.display = 'block';
		obj_article.style.display = 'none';
		document.title = 'Chenqi\'s Blog';
	}else{
		obj_article_list.style.display = 'none';
		obj_article.style.display = 'block'; obj_article.scrollIntoView();
		document.title = article_title + ' - Chenqi\'s Blog';
		if(obj_article.dataset.title != article_title){
			obj_article.dataset.title = article_title;
			obj_article.innerHTML = '';
			load_file(article_dir_map[article_title] + '/' + article_title + '.md', function(response){
				obj_article.innerHTML = marked(response);
			});
		}
	}
}

function on_hash_change(){
	load_article(location.hash.substring(1));
}

function on_load(){
	on_hash_change();
}


load_article_list();
obj_article.dataset.title = '';

window.onhashchange = on_hash_change;
window.onload = on_load;