const STORAGE_KEY = 'todos-vuejs-3.0'
const app = Vue.createApp({
	data: function () {
		return {
			todos: this.todoFetch(),
			newTodo: '',
			editedTodo: null,
			beforeEditCache: ''
		}
	},
	computed: {
		active() {
			return this.todos.filter((todo) => !todo.completed)
		},
		remaining() {
			return this.active.length
		}
	},
	methods: {
		todoFetch(){
			const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
			todos.forEach((todo, index) =>
				todo.id = index
			)
			this.uid = todos.length
			return todos
		},
		todoSave(todos){
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
		},
		addTodo() {
			const value = this.newTodo && this.newTodo.trim()
			if (!value) {
				return
			}
			this.todos.push({
				id: this.todoFetch().uid++,
				title: value,
				completed: false
			})
			this.newTodo = ''
			this.todoSave(this.todos)
		},
		deleteTodo: function(index) {
			this.todos.splice(index, 1)
			this.todoSave(this.todos)
		},
		editTodo(todo) {
			this.beforeEditCache = todo.title
			this.editedTodo = todo
			this.todoSave(this.todos)
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
			this.todoSave(this.todos)
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
