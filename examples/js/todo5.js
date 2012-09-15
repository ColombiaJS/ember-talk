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
    },

    remaining: function() {
        var tasks = this.get('tasks');
        return tasks.filterProperty('done', false);
    }.property('tasks.@each.done'),

    removeDone: function() {
        var tasks = this.get('tasks');
        this.set('tasks', tasks.filterProperty('done', false));
    },

    allDone: function() {
        this.get('tasks').forEach(function(task) {
            task.set('done', true);
        });
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
    },

    clean: function() {
        this.get('list').removeDone();
    },

    markAll: function() {
        this.get('list').allDone();
    }
 });

TODO.TaskView = Ember.View.extend({
    task: null,
    tagName: 'li',
    templateName: 'task-view',

    textClass: function() {
        return this.get('task.done') ? 'task-done' : 'task-pending';
    }.property('task.done')
});
