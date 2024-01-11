import React from 'react';
import axios from 'axios';
import Form from './Form';
import TodoList from './TodoList';

const URL = 'http://localhost:9000/api/todos'
/**
 * GET    --> gets the todos from the servoer
 * POST   --> creates a new todo on the server 
 * PATCH  --> updates the todo data that needs updating; only changes that need to be applied are sent
 */

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '', //where the raw material of a newly inputted todo lives
    displayCompleted: true,
  }

  // METHODS
  onTodoNameInputChange = (e) => {
    const { value } = e.target //always do this first!!
    // debugger
    this.setState({ ...this.state, todoNameInput: value })
  }

  resetForm = () => this.setState({ ...this.state, todoNameInput: '' })

  axiosErrMessage = (err) => this.setState({ ...this.state, error: err.response.data.message})

  postNewTodo = () => {
    axios.post(URL, {name: this.state.todoNameInput})
      .then(res => {
        // debugger
        this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
        this.resetForm();
      })
      .catch(this.axiosErrMessage)
  }

  onTodoFormSubmit = (e) => {
    e.preventDefault();
    this.postNewTodo();
  }

  // fetch method
  // no arguments needed
  // use arrow fxn so it will be bound to the component
  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        // dont forget to use debugger to let you see deeper via the browser dev tools what the data structure looks like and what lives on the res object
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(this.axiosErrMessage)
  }

  toggleCompleted = id => () => { //this is called partial application
    // returns a click handler
    axios.patch(`${URL}/${id}`)
      .then(res => {
        // debugger
        this.setState({ 
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id !== id) return td;
            return res.data.data
        })})
      })
      .catch(this.axiosErrMessage)
  }

  toggleDisplayCompleted = () => {
    this.setState({ ...this.state, displayCompleted: !this.state.displayCompleted })
  }

  componentDidMount() {
    // this is a helper fxn to fetch all todos from server
    this.fetchAllTodos()
  }

  render() {
    return (
      <div>
        <div id="error">{this.state.error}</div>
        <TodoList 
          todos={this.state.todos}
          displayCompleted={this.state.displayCompleted}
          toggleCompleted={this.toggleCompleted}
        />
        <Form
          onTodoFormSubmit={this.onTodoFormSubmit}
          onTodoNameInputChange={this.onTodoNameInputChange}
          toggleDisplayCompleted={this.toggleDisplayCompleted}
          todoNameInput={this.state.todoNameInput}
          displayCompleted={this.state.displayCompleted}
        />
      </div>
    )
  }
}
