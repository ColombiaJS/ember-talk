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
