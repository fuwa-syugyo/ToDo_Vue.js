const STORAGE_KEY = 'todos-vuejs-3.0'
const todoStorage = {
	fetch() {
		const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		todos.forEach((todo, index) =>
			todo.id = index
		)
		todoStorage.uid = todos.length
		return todos
	},
	save(todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
	}
}

const filters = {
	all(todos) {
		return todos
	},
	active(todos) {
		return todos.filter((todo) =>
			!todo.completed
		)
	},
	completed(todos) {
		return todos.filter((todo) =>
			todo.completed
		)
	}
}

const app = Vue.createApp({
	data: function () {
		return {
			todos: todoStorage.fetch(),
			newTodo: '',
			editedTodo: null,
			beforeEditCache: ''
	  }
	},
	watch: {
		todos: {
			handler(todos) {
				todoStorage.save(todos)
			},
		deep: true
		}
	},
	computed: {
		remaining() {
			const todos = filters.active(this.todos)
			return todos.length
		}
	},
	methods: {
		addTodo() {
			const value = this.newTodo && this.newTodo.trim()
			if (!value) {
				return
			}
			this.todos.push({
				id: todoStorage.uid++,
				title: value,
				completed: false
			})
			this.newTodo = ''
		},
		deleteTodo: function(index) {
			this.todos.splice(index, 1)
		},
		editTodo(todo) {
			this.beforeEditCache = todo.title
			this.editedTodo = todo
		},
		doneEdit(todo) {
			if (!this.editedTodo) {
				return
			}
			this.editedTodo = null
			const title = todo.title.trim()
			if (title) {
				todo.title = title
			} else {
				this.deleteTodo(todo)
			}
		},
		cancelEdit(todo) {
			this.editedTodo = null
			todo.title = this.beforeEditCache
		}
	},
	directives: {
		'todo-focus' (element, binding) {
			if (binding.value) {
				element.focus()
			}
		}
	}
})

app.mount('#app')
