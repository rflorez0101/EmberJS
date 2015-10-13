App = Ember.Application.create();

App.Router.map(function() {
  this.resource('about');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' })
  });
});

App.Store = DS.Store.extend({
    revision:12,
    adapter: 'DS.FixtureAdapter'
});

App.IndexRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('posts');
  }
});


App.PostsRoute = Ember.Route.extend({
    model: function() {
      return App.Post.find();
    }

});

App.PostsIndexRoute = Ember.Route.extend({
  redirect: function () {
    var posts = this.modelFor('posts');
    var post = posts.get('firstObject');

    if(!post)
    {
        console.log("LOADING bootstrap'ed DATA");
        DS.get('defaultStore').load(App.Post, bootstrap);
        post = App.Post.find(1);
    }

    this.transitionTo('post', post);
  }
});

App.PostController = Ember.ObjectController.extend({
    isEditing: false,
    edit: function()
    {
      this.set('isEditing',true);
    },
    doneEditing: function()
    {
      this.get('store').commit();
      this.set('isEditing',false);
    }

});

moment.lang('es',
{
  relativeTime: {
    past : 'hace %s',
    s : "unos segundos",
    m : "un minuto",
    mm : "%d minutos",
    h : "una hora",
    hh : "%d horas",
    d : "un día",
    dd : "%d días",
    M : "un mes",
    MM : "%d mes",
    y : "un año",
    yy : "%d años"
  }
});

Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});

//creamos objeto converter
//para pasar de markdown a HTML
var showdown = new Showdown.converter();

Ember.Handlebars.registerBoundHelper('markdown', function(input) {
  //devolvemos SafeString para que no escape el contenido HTML
  return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
});

App.Post = DS.Model.extend({
    title: DS.attr('string'),
    author: DS.attr('string'),
    text: DS.attr('string'),
    publishedAt: DS.attr('date')
});

App.Post.FIXTURES = [{
    id:1,
    title: "Mejoras de usabilidad en el ecommerce. Panama Jack",
    author: "elad",
    publishedAt: new Date('4-8-2013'),
    text: "Hace **unos pocos días** publicamos la nueva versión de uno de nuestros grandes clientes [Panama Jack](http://www.panamajack.es/). Entre las nuevas mejoras de esta nueva versión se encuentra un nuevo diseño (realizado internamente por el departamento creativo de Panama Jack) y **mejoras de usabilidad**."
},
{
    id:2,
    title: "Introducción al framework Ember.js",
    author: "danii",
    publishedAt: new Date('3-28-2013'),
    text: "Después de la [demo de Webapp en AngularJS](http://www.lostiemposcambian.com/blog/javascript/angularjs-framework-javascript-para-webapps/) y de la [demo de Backbone](http://www.lostiemposcambian.com/blog/javascript/webapps-javascript-con-backbone/) vamos a hacer una pequeña introducción a un framework JavaScript relativamente nuevo y que tiene **un nivel de hype** altísimo debido a algunas características realmente interesantes y potentes: [Ember.js](http://www.emberjs.com/)"
}];