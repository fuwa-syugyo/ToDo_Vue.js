const STORAGE_KEY = 'todos-vuejs-3.0'
const app = Vue.createApp({
  data() {
    return {
      todos: this.fetchTodos(),
      newTodo: '',
      editedTodo: null,
      beforeEditCache: ''
    }
  },
  computed: {
    activeTodos() {
      return this.todos.filter((todo) => !todo.completed)
    },
    activeTodoCount() {
      return this.activeTodos.length
    }
  },
  methods: {
    fetchTodos(){
      const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
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
        id: uuidv4(),
        title: value,
        completed: false
      })
      this.newTodo = ''
      this.saveTodos(this.todos)
    },
    deleteTodo(index) {
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
