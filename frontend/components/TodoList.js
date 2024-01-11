import React from 'react'
import Todo from './Todo';

export default class TodoList extends React.Component {
  render() {
    return (
      <div id="todos">
        <h2>Todos:</h2>
        {/* dynamically add or hide the todos into the JSX. Initially done with map when we were only adding to the list, but then changed to reduce to accomplish the hiding functionality to hide completed tasks */}
        {
          this.props.todos.reduce((acc, td) => {
            if (this.props.displayCompleted || !td.completed) return acc.concat(
              <Todo 
                toggleCompleted={this.props.toggleCompleted}
                td={td}
                key={td.id}
              />
            );
            return acc;
          }, [])
          // initialized to an empty array at first, and if the todo is completed, it will be concatenated into the array
        }
      </div>
    )
  }
}
