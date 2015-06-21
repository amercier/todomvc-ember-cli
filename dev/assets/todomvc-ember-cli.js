/* jshint ignore:start */

/* jshint ignore:end */

define('todomvc-ember-cli/adapters/application', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

  'use strict';

  var adapter = Ember['default'].testing ? DS['default'].FixtureAdapter : DS['default'].LSAdapter.extend({
    namespace: 'todos-ember-es6'
  });

  exports['default'] = adapter;

});
define('todomvc-ember-cli/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'todomvc-ember-cli/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('todomvc-ember-cli/controllers/todo', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actions: {
      editTodo: function() {
        this.set('isEditing', true);
      },
      acceptChanges: function() {
        this.set('isEditing', false);

        if (Ember['default'].isEmpty(this.get('model.title'))) {
          this.send('removeTodo');
        } else {
          this.get('model').save();
        }
      },
      removeTodo: function() {
        var todo = this.get('model');
        todo.deleteRecord();
        todo.save();
      }
    },

    isEditing: false,

    isCompleted: Ember['default'].computed('model.isCompleted', {
      get: function() {
        return this.get('model').get('isCompleted');
      },
      set: function(key, value) {
        var model = this.get('model');
        model.set('isCompleted', value);
        model.save();
        return value;
      }
    })
  });

});
define('todomvc-ember-cli/controllers/todos', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    actions: {
      createTodo: function() {
        // Get the todo title set by the "New Todo" text field
        var title = this.get('newTitle');
        if (!title.trim()) { return; }

        // Create the new Todo Model
        var todo = this.store.createRecord('todo', {
          title: title,
          isCompleted: false
        });

        // Clear the "New Todo" text field
        this.set('newTitle', '');

        // Save the new model
        todo.save();
      },

      clearCompleted: function() {
        var completed = this.filterBy('isCompleted', true);
        completed.invoke('deleteRecord');
        completed.invoke('save');
      }
    },

    remaining: function() {
      return this.filterBy('isCompleted', false).get('length');
    }.property('@each.isCompleted'),

    inflection: function() {
      var remaining = this.get('remaining');
      return remaining === 1 ? 'todo' : 'todos';
    }.property('remaining'),

    hasCompleted: function() {
      return this.get('completed') > 0;
    }.property('completed'),

    completed: function() {
      return this.filterBy('isCompleted', true).get('length');
    }.property('@each.isCompleted'),

    allAreDone: Ember['default'].computed('@each.isCompleted', {
      get: function() {
        return !!this.get('length') && this.everyProperty('isCompleted', true);
      },
      set: function(key, value) {
        this.setEach('isCompleted', value);
        this.invoke('save');
        return value;
      }
    })

  });

});
define('todomvc-ember-cli/initializers/app-version', ['exports', 'todomvc-ember-cli/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  }

});
define('todomvc-ember-cli/initializers/export-application-global', ['exports', 'ember', 'todomvc-ember-cli/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('todomvc-ember-cli/models/todo', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var Todo = DS['default'].Model.extend({
    title: DS['default'].attr('string'),
    isCompleted: DS['default'].attr('boolean')
  });

  exports['default'] = Todo;

});
define('todomvc-ember-cli/router', ['exports', 'ember', 'todomvc-ember-cli/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function() {
    this.resource('todos', { path: '/' }, function() {
      this.route('active');
      this.route('completed');
    });
  });

  exports['default'] = Router;

});
define('todomvc-ember-cli/routes/todos', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function() {
      return this.store.find('todo');
    }
  });

});
define('todomvc-ember-cli/routes/todos/active', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function() {
      return this.store.filter('todo', function(todo) {
        return !todo.get('isCompleted');
      });
    },
    renderTemplate: function(controller) {
      this.render('todos/index', { controller: controller } );
    }
  });

});
define('todomvc-ember-cli/routes/todos/completed', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function() {
      return this.store.filter('todo', function(todo) {
        return todo.get('isCompleted');
      });
    },
    renderTemplate: function(controller) {
      this.render('todos/index', { controller: controller } );
    }
  });

});
define('todomvc-ember-cli/routes/todos/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function() {
      return this.modelFor('todos');
    }
  });

});
define('todomvc-ember-cli/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("footer");
        dom.setAttribute(el1,"id","info");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Double-click to edit a todo");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('todomvc-ember-cli/templates/todos', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("All");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Active");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Completed");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"id","clear-completed");
          var el2 = dom.createTextNode("\n        Clear completed (");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(")\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,1,1);
          element(env, element0, context, "action", ["clearCompleted"], {});
          content(env, morph0, context, "completed");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"id","todoapp");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("header");
        dom.setAttribute(el2,"id","header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("todos");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","main");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("footer");
        dom.setAttribute(el2,"id","footer");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"id","todo-count");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("strong");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" left\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"id","filters");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element1, [5]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),3,3);
        var morph1 = dom.createMorphAt(element2,1,1);
        var morph2 = dom.createMorphAt(element2,3,3);
        var morph3 = dom.createMorphAt(dom.childAt(element4, [1]),0,0);
        var morph4 = dom.createMorphAt(element4,3,3);
        var morph5 = dom.createMorphAt(dom.childAt(element5, [1]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element5, [5]),1,1);
        var morph8 = dom.createMorphAt(element3,5,5);
        inline(env, morph0, context, "input", [], {"type": "text", "id": "new-todo", "placeholder": "What needs to be done?", "value": get(env, context, "newTitle"), "action": "createTodo"});
        content(env, morph1, context, "outlet");
        inline(env, morph2, context, "input", [], {"type": "checkbox", "id": "toggle-all", "checked": get(env, context, "allAreDone")});
        content(env, morph3, context, "remaining");
        content(env, morph4, context, "inflection");
        block(env, morph5, context, "link-to", ["todos.index"], {"activeClass": "selected"}, child0, null);
        block(env, morph6, context, "link-to", ["todos.active"], {"activeClass": "selected"}, child1, null);
        block(env, morph7, context, "link-to", ["todos.completed"], {"activeClass": "selected"}, child2, null);
        block(env, morph8, context, "if", [get(env, context, "hasCompleted")], {}, child3, null);
        return fragment;
      }
    };
  }()));

});
define('todomvc-ember-cli/templates/todos/active', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('todomvc-ember-cli/templates/todos/completed', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('todomvc-ember-cli/templates/todos/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "input", [], {"class": "edit", "value": get(env, context, "todo.model.title"), "focus-out": "acceptChanges", "insert-newline": "acceptChanges", "autofocus": "autofocus"});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("label");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"class","destroy");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [3]);
            var element1 = dom.childAt(fragment, [5]);
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            var morph1 = dom.createMorphAt(element0,0,0);
            inline(env, morph0, context, "input", [], {"type": "checkbox", "checked": get(env, context, "todo.isCompleted"), "class": "toggle"});
            element(env, element0, context, "action", ["editTodo"], {"on": "doubleClick"});
            content(env, morph1, context, "todo.model.title");
            element(env, element1, context, "action", ["removeTodo"], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element2,1,1);
          var attrMorph0 = dom.createAttrMorph(element2, 'class');
          attribute(env, attrMorph0, element2, "class", concat(env, [subexpr(env, context, "if", [get(env, context, "todo.isCompleted"), "completed"], {}), " ", subexpr(env, context, "if", [get(env, context, "todo.isEditing"), "editing"], {})]));
          block(env, morph0, context, "if", [get(env, context, "todo.isEditing")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"id","todo-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "each", [get(env, context, "this")], {"itemController": "todo", "keyword": "todo"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('todomvc-ember-cli/tests/1-unit/controllers/todo-test', ['ember', 'ember-qunit', 'todomvc-ember-cli/tests/fixtures/todo', 'todomvc-ember-cli/tests/helpers/mock-model'], function (Ember, ember_qunit, FIXTURES, mockModel) {

  'use strict';

  ember_qunit.moduleFor('controller:todo', 'TodoController', {
    // Specify the other units that are required for this test.
    needs: ['model:todo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function() {
    var controller = this.subject();
    ok(controller);
  });

  ember_qunit.test('editTodo', function() {
    var controller = this.subject();
    Ember['default'].run(function() {
      controller.send('editTodo');
      equal(controller.get('isEditing'), true);
    });
  });

  ember_qunit.test('acceptChanges with a title', function() {
    expect(4);
    var controller = this.subject();
    Ember['default'].run(function() {
      var model = mockModel['default'](FIXTURES['default'][0]);
      controller.set('model', model);

      controller.send('editTodo');
      equal(controller.get('isEditing'), true);
      model.set('title', FIXTURES['default'][1].title);
      controller.send('acceptChanges');
      equal(controller.get('isEditing'), false);

      equal(model.get('deleted'), false);
      equal(model.get('saved'), true);
    });
  });

  ember_qunit.test('acceptChanges with an empty title', function() {
    expect(4);
    var controller = this.subject();
    Ember['default'].run(function() {
      var model = mockModel['default'](FIXTURES['default'][0]);
      controller.set('model', model);

      controller.send('editTodo');
      equal(controller.get('isEditing'), true);
      model.set('title', '');
      controller.send('acceptChanges');
      equal(controller.get('isEditing'), false);

      equal(model.get('deleted'), true);
      equal(model.get('saved'), true);
    });
  });


  ember_qunit.test('removeTodo', function() {
    expect(2);
    var controller = this.subject();
    Ember['default'].run(function() {
      var model = mockModel['default'](FIXTURES['default'][0]);
      controller.set('model', model);

      controller.send('removeTodo');

      equal(model.get('deleted'), true);
      equal(model.get('saved'), true);
    });
  });

});
define('todomvc-ember-cli/tests/1-unit/controllers/todo-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/controllers');
  test('1-unit/controllers/todo-test.js should pass jshint', function() { 
    ok(true, '1-unit/controllers/todo-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/1-unit/controllers/todos-test', ['ember', 'ember-qunit', 'todomvc-ember-cli/tests/fixtures/todo', 'todomvc-ember-cli/tests/helpers/mock-models'], function (Ember, ember_qunit, FIXTURES, mockModels) {

  'use strict';

  ember_qunit.moduleFor('controller:todos', 'TodosController', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function() {
    var controller = this.subject();
    ok(controller);
  });


  ember_qunit.test('remaining', function () {
    expect(2);
    var controller = this.subject();
    var models = mockModels['default'](FIXTURES['default']);
    controller.addObjects(models);
    equal(controller.get('remaining'), 1);
    controller.findBy('id', '3').set('isCompleted', true);
    equal(controller.get('remaining'), 0);
  });


  ember_qunit.test('completed', function () {
    expect(2);
    var controller = this.subject();
    var models = mockModels['default'](FIXTURES['default']);
    controller.addObjects(models);
    equal(controller.get('completed'), 2);
    controller.findBy('id', '3').set('isCompleted', true);
    equal(controller.get('completed'), 3);
  });

  ember_qunit.test('allAreDone', function() {
    expect(2);
    var controller = this.subject();
    var models = mockModels['default'](FIXTURES['default']);
    controller.addObjects(models);
    equal(controller.get('allAreDone'), false);
    controller.findBy('id', '3').set('isCompleted', true);
    equal(controller.get('allAreDone'), true);
  });

});
define('todomvc-ember-cli/tests/1-unit/controllers/todos-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/controllers');
  test('1-unit/controllers/todos-test.js should pass jshint', function() { 
    ok(true, '1-unit/controllers/todos-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/1-unit/models/todo-test', ['ember', 'ember-qunit', 'todomvc-ember-cli/tests/fixtures/todo'], function (Ember, ember_qunit, FIXTURES) {

  'use strict';

  ember_qunit.moduleForModel('todo', 'Todo', {
    // Specify the other units that are required for this test.
    needs: [],
    tearDown: function() {
      this.store.unloadAll();
    }
  });

  ember_qunit.test('it exists', function() {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

  ember_qunit.test('it has a title property', function() {
    var model = this.subject(FIXTURES['default'][0]);
    equal(typeof model.get('title'), 'string');
    Ember['default'].run(function() {
      model.set('title', 'new title');
      equal(model.get('title'), 'new title');
    });
  });

  ember_qunit.test('it has a isCompleted property', function() {
    var model = this.subject(FIXTURES['default'][1]);
    Ember['default'].run(function() {
      equal(typeof model.get('isCompleted'), 'boolean');
      model.set('isCompleted', true);
      equal(model.get('isCompleted'), true);
      model.set('isCompleted', false);
      equal(model.get('isCompleted'), false);
    });
  });

});
define('todomvc-ember-cli/tests/1-unit/models/todo-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/models');
  test('1-unit/models/todo-test.js should pass jshint', function() { 
    ok(true, '1-unit/models/todo-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:todos', 'TodosRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function() {
    var route = this.subject();
    ok(route);
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/routes');
  test('1-unit/routes/todos-test.js should pass jshint', function() { 
    ok(true, '1-unit/routes/todos-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos/active-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:todos/active', 'TodosActiveRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function() {
    var route = this.subject();
    ok(route);
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos/active-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/routes/todos');
  test('1-unit/routes/todos/active-test.js should pass jshint', function() { 
    ok(true, '1-unit/routes/todos/active-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos/completed-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:todos/completed', 'TodosCompletedRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function() {
    var route = this.subject();
    ok(route);
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos/completed-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/routes/todos');
  test('1-unit/routes/todos/completed-test.js should pass jshint', function() { 
    ok(true, '1-unit/routes/todos/completed-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:todos/index', 'TodosIndexRoute', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function() {
    var route = this.subject();
    ok(route);
  });

});
define('todomvc-ember-cli/tests/1-unit/routes/todos/index-test.jshint', function () {

  'use strict';

  module('JSHint - 1-unit/routes/todos');
  test('1-unit/routes/todos/index-test.js should pass jshint', function() { 
    ok(true, '1-unit/routes/todos/index-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/2-integration/add-new-todo-test', ['ember', 'todomvc-ember-cli/tests/helpers/module-for-integration', 'todomvc-ember-cli/tests/helpers/delay', 'todomvc-ember-cli/tests/fixtures/todo'], function (Ember, moduleForIntegration, delay, Fixtures) {

  'use strict';

  var ms = 0;

  moduleForIntegration['default']('Integration - Add a new todo');


  asyncTest('Application fixtures are initialized', function() {
    expect(4);
    visit('/')
      .then(delay['default'](ms))
      .then(function(msg) {
        equal(find('#main > ul > li').size(), Fixtures['default'].length);
        equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures['default'][0].title);
        equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures['default'][1].title);
        equal(find('#main > ul > li:nth-of-type(3) label').text(), Fixtures['default'][2].title);
        start(); // see http://api.qunitjs.com/QUnit.asyncTest/
      });
  });


  asyncTest('Typing a todo name and pressing ENTER adds a new todo', function() {
    expect(2);

    var text = 'My new awesome todo';

    visit('/')
      .then(delay['default'](ms))
      .then(function () {
        return fillIn('#new-todo', text);
      })
      .then(delay['default'](ms))
      .then(function () {
        return keyEvent('#new-todo', 'keyup', 13);
      })
      .then(delay['default'](ms))
      .then(function(msg) {
        equal(find('#main > ul > li').size(), 4);
        equal(find('#main > ul > li:nth-of-type(4) label').text(), text);
        start(); // see http://api.qunitjs.com/QUnit.asyncTest/
      });
  });

});
define('todomvc-ember-cli/tests/2-integration/add-new-todo-test.jshint', function () {

  'use strict';

  module('JSHint - 2-integration');
  test('2-integration/add-new-todo-test.js should pass jshint', function() { 
    ok(true, '2-integration/add-new-todo-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/2-integration/remove-todo-test', ['ember', 'todomvc-ember-cli/tests/helpers/module-for-integration', 'todomvc-ember-cli/tests/helpers/delay', 'todomvc-ember-cli/tests/fixtures/todo'], function (Ember, moduleForIntegration, delay, Fixtures) {

  'use strict';

  var ms = 0, App;

  moduleForIntegration['default']('Integration - Remove a todo');


  asyncTest('Application fixtures are initialized', function() {
    expect(4);
    visit('/')
      .then(delay['default'](ms))
      .then(function(msg) {
        equal(find('#main > ul > li').size(), Fixtures['default'].length);
        equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures['default'][0].title);
        equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures['default'][1].title);
        equal(find('#main > ul > li:nth-of-type(3) label').text(), Fixtures['default'][2].title);
        start(); // see http://api.qunitjs.com/QUnit.asyncTest/
      });
  });


  asyncTest('Typing a todo name and pressing ENTER adds a new todo', function() {
    expect(3);

    var text = 'My new awesome todo';

    visit('/')
      .then(delay['default'](ms))
      .then(function () {
        return click('#main > ul > li:nth-of-type(2) button.destroy');
      })
      .then(delay['default'](ms))
      .then(function(msg) {
        equal(find('#main > ul > li').size(), Fixtures['default'].length - 1);
        equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures['default'][0].title);
        equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures['default'][2].title);
        start(); // see http://api.qunitjs.com/QUnit.asyncTest/
      });
  });

});
define('todomvc-ember-cli/tests/2-integration/remove-todo-test.jshint', function () {

  'use strict';

  module('JSHint - 2-integration');
  test('2-integration/remove-todo-test.js should pass jshint', function() { 
    ok(true, '2-integration/remove-todo-test.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/controllers/todo.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/todo.js should pass jshint', function() { 
    ok(true, 'controllers/todo.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/controllers/todos.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/todos.js should pass jshint', function() { 
    ok(true, 'controllers/todos.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/fixtures/todo', ['exports'], function (exports) {

  'use strict';

  exports['default'] = [
    { id: "1", title: 'install ember-cli', isCompleted: true },
    { id: "2", title: 'install additional dependencies', isCompleted: true },
    { id: "3", title: 'develop amazing things', isCompleted: false }
  ];

});
define('todomvc-ember-cli/tests/fixtures/todo.jshint', function () {

  'use strict';

  module('JSHint - fixtures');
  test('fixtures/todo.js should pass jshint', function() { 
    ok(true, 'fixtures/todo.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/helpers/delay', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function delay(ms) {
    return function () {
      return new Ember['default'].RSVP.Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve();
        }, ms);
      });
    };
  }
  exports['default'] = delay;

});
define('todomvc-ember-cli/tests/helpers/delay.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/delay.js should pass jshint', function() { 
    ok(true, 'helpers/delay.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/helpers/mock-model', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function mockModel(item) {
    return Ember['default'].ObjectProxy.create(Ember['default'].merge(item, {
      saved: false,
      save: function() {
        this.set('saved', true);
      },
      deleted: false,
      deleteRecord: function() {
        this.set('deleted', true);
      }
    }));
  }
  exports['default'] = mockModel;

});
define('todomvc-ember-cli/tests/helpers/mock-model.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/mock-model.js should pass jshint', function() { 
    ok(true, 'helpers/mock-model.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/helpers/mock-models', ['exports', 'todomvc-ember-cli/tests/helpers/mock-model'], function (exports, mockModel) {

  'use strict';

  function mockModels(data) {
    return data.map(mockModel['default']);
  }
  exports['default'] = mockModels;

});
define('todomvc-ember-cli/tests/helpers/mock-models.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/mock-models.js should pass jshint', function() { 
    ok(true, 'helpers/mock-models.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/helpers/module-for-integration', ['exports', 'ember', 'todomvc-ember-cli/tests/helpers/start-app'], function (exports, Ember, startApp) {

  'use strict';

  function moduleForIntegration (name) {
    var container = {};

    module(name, {
      setup: function setup() {
        container.App = startApp['default']();
      },
      teardown: function teardown() {
        Ember['default'].run(function() {
          container.App.destroy();
        });
      }
    });

    return container;
  }
  exports['default'] = moduleForIntegration;

});
define('todomvc-ember-cli/tests/helpers/module-for-integration.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/module-for-integration.js should pass jshint', function() { 
    ok(true, 'helpers/module-for-integration.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/helpers/resolver', ['exports', 'ember/resolver', 'todomvc-ember-cli/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('todomvc-ember-cli/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/helpers/start-app', ['exports', 'ember', 'todomvc-ember-cli/app', 'todomvc-ember-cli/router', 'todomvc-ember-cli/config/environment', 'todomvc-ember-cli/tests/fixtures/todo', 'todomvc-ember-cli/models/todo'], function (exports, Ember, Application, Router, config, TodoFixtures, Todo) {

  'use strict';

  function startApp(attrs) {
    var App;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Router['default'].reopen({
      location: 'none'
    });

    Ember['default'].run(function() {
      App = Application['default'].create(attributes);
      App.setupForTesting();
      App.injectTestHelpers();

      Todo['default'].reopenClass({
        FIXTURES: $.extend(true, [], TodoFixtures['default']) // extend, otherwise the TodoFixtures gets mutated
      });
    });

    // Disabled due to https://github.com/emberjs/ember.js/issues/10310
    // App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

    return App;
  }
  exports['default'] = startApp;

});
define('todomvc-ember-cli/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/models/todo.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/todo.js should pass jshint', function() { 
    ok(true, 'models/todo.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/routes/todos.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/todos.js should pass jshint', function() { 
    ok(true, 'routes/todos.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/routes/todos/active.jshint', function () {

  'use strict';

  module('JSHint - routes/todos');
  test('routes/todos/active.js should pass jshint', function() { 
    ok(true, 'routes/todos/active.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/routes/todos/completed.jshint', function () {

  'use strict';

  module('JSHint - routes/todos');
  test('routes/todos/completed.js should pass jshint', function() { 
    ok(true, 'routes/todos/completed.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/routes/todos/index.jshint', function () {

  'use strict';

  module('JSHint - routes/todos');
  test('routes/todos/index.js should pass jshint', function() { 
    ok(true, 'routes/todos/index.js should pass jshint.'); 
  });

});
define('todomvc-ember-cli/tests/test-helper', ['todomvc-ember-cli/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

  'use strict';

  ember_qunit.setResolver(resolver['default']);

  document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

  QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});

  var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
  document.getElementById('ember-testing-container').style.visibility = containerVisibility;

});
define('todomvc-ember-cli/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('todomvc-ember-cli/config/environment', ['ember'], function(Ember) {
  var prefix = 'todomvc-ember-cli';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("todomvc-ember-cli/tests/test-helper");
} else {
  require("todomvc-ember-cli/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true,"name":"todomvc-ember-cli","version":"DETACHED_HEAD.c0119e4a"});
}

/* jshint ignore:end */
//# sourceMappingURL=todomvc-ember-cli.map