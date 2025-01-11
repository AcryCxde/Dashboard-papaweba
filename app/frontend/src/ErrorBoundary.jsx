import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Что-то пошло не так. Пожалуйста, попробуйте позже.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
