import React, {Component, ErrorInfo} from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      showError: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, 'CATCH');
    this.setState({
      error,
      errorInfo,
      showError: true,
    });
  }

  handleDismiss = () => {
    this.setState({
      error: null,
      errorInfo: null,
      showError: false,
    });
  };

  render() {
    if (this.state.showError && this.state.error && this.state.errorInfo) {
      return (
        <div>
          <h2>Произошла ошибка</h2>
          <details style={{whiteSpace: 'pre-wrap'}}>
            {this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <button onClick={this.handleDismiss}>Закрыть</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export {ErrorBoundary};
