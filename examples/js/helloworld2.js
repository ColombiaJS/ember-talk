window.App = Ember.Application.create({
    version: "0.1"
});

App.user = Ember.Object.create({
    firstName: 'Guybrush',
    lastName: 'Threepwood',
    profession: 'Pirata',

    fullName: function() {
        return this.get('firstName') +
               ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});
