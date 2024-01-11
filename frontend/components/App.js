import React from 'react';
import axios from 'axios';

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
        <div id="todos">
          <h2>Todos:</h2>
          {/* dynamically add or hide the todos into the JSX. Initially done with map when we were only adding to the list, but then changed to reduce to accomplish the hiding functionality to hide completed tasks */}
          {
            this.state.todos.reduce((acc, td) => {
              if (this.state.displayCompleted || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' ✔️' : ''}</div>
              );
              return acc;
            }, [])
            // initialized to an empty array at first, and if the todo is completed, it will be concatenated into the array
          }
        </div>
        <form action="" id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange} type="text" placeholder='Type todo'></input>
          <input type="submit"></input>
        </form>
        <button onClick={this.toggleDisplayCompleted}>{this.state.displayCompleted ? 'Hide' : 'Show'} Completed</button>
      </div>
    )
  }
}
