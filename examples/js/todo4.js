window.TODO = Ember.Application.create();

TODO.Task = Ember.Object.extend({
	text: null,
	done: false
});

TODO.list = Ember.Object.create({
	tasks: [],

	addTask: function(text) {
		var task = TODO.Task.create({text: text});
		this.get('tasks').pushObject(task);
	}
});


TODO.ListView = Ember.View.extend({
	newText: null,
	list: null,
	templateName: 'list-view',

	add: function() {
		var text = this.get('newText');
		this.get('list').addTask(text);
		this.set('newText', null);
	}
});
