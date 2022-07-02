const STORAGE_KEY = 'todos-vuejs-3.0'
const app = Vue.createApp({
	data: function () {
		return {
			todos: this.fetchTodos(),
			newTodo: '',
			editedTodo: null,
			beforeEditCache: ''
		}
	},
	computed: {
		returnActiveTodos() {
			return this.todos.filter((todo) => !todo.completed)
		},
		activeTodoCount() {
			return this.returnActiveTodos.length
		}
	},
	methods: {
		fetchTodos(){
			const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
			todos.forEach((todo, index) =>
				todo.id = index
			)
			this.uid = todos.length
			return todos
		},
		saveTodos(todos){
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
		},
		addTodo() {
			const value = this.newTodo && this.newTodo.trim()
			if (!value) {
				return
			}
			this.todos.push({
				id: this.fetchTodos().uid++,
				title: value,
				completed: false
			})
			this.newTodo = ''
			this.saveTodos(this.todos)
		},
		deleteTodo: function(index) {
			this.todos.splice(index, 1)
			this.saveTodos(this.todos)
		},
		editTodo(todo) {
			this.beforeEditCache = todo.title
			this.editedTodo = todo
			this.saveTodos(this.todos)
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
			this.saveTodos(this.todos)
		},
		cancelEdit(todo) {
			this.editedTodo = null
			todo.title = this.beforeEditCache
		},
		saveCheckbox(todo){
			this.saveTodos(this.todos)
		},
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
