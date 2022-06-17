const STORAGE_KEY = 'todos-vuejs-3.0';
const todoStorage = {
	fetch() {
		const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		todos.forEach((todo, index) =>
			todo.id = index
		);
		todoStorage.uid = todos.length;
		return todos;
	},
	save(todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
}

const app = Vue.createApp({
  data:() => ({
    newTodo: '',
    todos: todoStorage.fetch()
  }),
  watch: {
    todos: {
      handler(todos) {
        todoStorage.save(todos)
      },
	  deep: true
    }
  },
  computed: {
	  filteredTodos() {
		  return this.todos
	  },
	  remaining() {
		  const todos = this.getActive(this.todos)
		  return todos.length
	  }
  },
  filters: {
	  pluralize(n) {
		  return n === 1 ? 'item' : 'items'
	  }
  },
  methods: {
    addTodo: function(event) {
      const value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			this.todos.push({
				id: todoStorage.uid++,
				title: value,
				completed: false
			});
			this.newTodo = '';
		},
    deleteTodo: function(index) {
      this.todos.splice(index, 1)
    },
	getActive(todos) {
		return todos.filter((todo) =>
			!todo.completed
		)
	}
  }
})
app.mount('#app')
