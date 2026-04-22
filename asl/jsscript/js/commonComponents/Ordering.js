import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class ReorderableListClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ["Apple", "Banana", "Cherry", "Date"],
      draggedIndex: null,
      hoveredIndex: null
    };
  }

  handleDragStart = (index) => {
    this.setState({ draggedIndex: index });
  };

  handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== this.state.hoveredIndex) {
      this.setState({ hoveredIndex: index });
    }
  };

  handleDrop = (index) => {
    const { items, draggedIndex } = this.state;
    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, draggedItem);
    this.setState({
      items: updatedItems,
      draggedIndex: null,
      hoveredIndex: null
    });
  };

  getItemClass = (index) => {
    const { draggedIndex } = this.state;
    let base = "list-group-item transition-all";
    if (index === draggedIndex) return `${base} bg-warning text-white`;
    return base;
  };

  render() {
    const { items, draggedIndex, hoveredIndex } = this.state;

    return (
      <div className="container mt-4">
        <h4>Reorderable List (Class Component)</h4>
        <ul className="list-group">
          {items.map((item, index) => (
            <React.Fragment key={item}>
              {hoveredIndex === index && draggedIndex !== null && (
                <li
                  className="list-group-item bg-light border border-primary mb-2"
                  style={{
                    height: "40px",
                    transition: "height 0.3s ease",
                    opacity: 0.6
                  }}
                >
                  {/* Spacer for animation */}
                </li>
              )}
              <li
                className={this.getItemClass(index)}
                draggable
                onDragStart={() => this.handleDragStart(index)}
                onDragOver={(e) => this.handleDragOver(e, index)}
                onDrop={() => this.handleDrop(index)}
                style={{
                  cursor: "grab",
                  transition: "transform 0.2s ease"
                }}
              >
                {item}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
}

export default ReorderableListClass;
