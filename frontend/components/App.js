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
      .catch(err => {
        // debugger
        this.setState({ ...this.state, error: err.response.data.message})
      })
  }

  componentDidMount() {
    // this is a helper fxn to fetch all todos from server
    this.fetchAllTodos()
    
  }

  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        <div id="todos">
          <h2>Todos:</h2>
          {/* dynamically add the todos into the JSX */}
          {
            this.state.todos.map(todo => {
              return <div key={todo.id}>{todo.name}</div>
            })
          }
        </div>
        <form action="" id="todoForm">
          <input type="text" placeholder='Type todo'></input>
          <input type="submit"></input>
          <button>Clear Completed</button>
        </form>
      </div>
    )
  }
}
