window.TODO = Ember.Application.create();

TODO.Task = Ember.Object.extend({
    text: null,
    done: false
});

TODO.list = Ember.Object.create({
    tasks: [],

    init: function() {
        this.loadFromServer();
    },

    saveToJSON: function() {
        return JSON.stringify(this.get('tasks'));
    },

    loadFromJSON: function(data) {
        var rawTasks = JSON.parse(data);
        var tasks = rawTasks.map(function(raw) {
            return TODO.Task.create(raw);
        });
        this.set('tasks', tasks);
    },

    loadFromServer: function() {
        var request = $.ajax({
            type: 'GET',
            url: '/tasks'
        });

        $.when(request).done(function(data) {
            this.loadFromJSON(data);
        }.bind(this));
    },

    saveToServer: function() {
        var request = $.ajax({
            type: 'POST',
            url: '/tasks',
            data: this.saveToJSON(),
            contentType: "application/json"
        });
    }.observes('tasks.@each.done'),

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
    page: 0,
    pageSize: 10,
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
    },

    sync: function() {
        this.get('list').loadFromServer();
    },

    visibleTasks: function() {
        var size = this.get('pageSize');
        var page = this.get('page');
        return this.getPath('list.tasks').slice(page*size, page*size + size);
    }.property('list.tasks.@each', 'page'),

    pages: function() {
        var size = this.get('pageSize');
        var pageNumber = this.getPath('list.tasks.length') / size;

        var result = [];
        for (var i=0; i<pageNumber; i++) {
            result.push(TODO.PageView.create({'page': i}));
        }
        if (this.get('page') > result.length) {
            this.set('page', result.length);
        }
        return result;
    }.property('list.tasks.@each', 'page'),

    hasPages: function() {
        return this.getPath('pages.length') > 1;
    }.property('list.tasks.@each', 'page'),

    goNextPage: function() {
        if (this.get('page') < this.getPath('pages.length') - 1) {
            this.incrementProperty('page');
        }
    },

    goPrevPage: function() {
        if (this.get('page') > 0) {
            this.decrementProperty('page');
        }
    }
 });

TODO.TaskView = Ember.View.extend({
    task: null,
    templateName: 'task-view',

    textClass: function() {
        return this.get('task.done') ? 'task-done' : 'task-pending';
    }.property('task.done')
});


TODO.PageView = Ember.View.extend({
    page: null,
    tagName: 'li',
    classNameBindings: ['active'],

    changePage: function() {
        this.setPath('parentView.page', this.get('page'));
    },

    visiblePage: function() {
        return this.get('page') + 1;
    }.property('page'),

    active: function() {
        return (this.getPath('parentView.page') === this.get('page'));
    }.property('page')
});
