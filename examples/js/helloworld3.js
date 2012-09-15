window.App = Ember.Application.create({
    version: "0.1"
});

App.user = Ember.Object.create({
    firstName: 'Guybrush',
    lastName: 'Threepwood',
    profession: 'Pirata',
    birthday: new Date("October 17, 1984 11:13:00"),

    fullName: function() {
        return this.get('firstName') +
               ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});


Handlebars.registerHelper('age', function(property, options) {
    var value = Ember.Handlebars.getPath(this, property, options);
    var now = new Date();
    return now.getFullYear() - value.getFullYear();
});
