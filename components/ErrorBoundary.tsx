'use client';

import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cloud px-4">
          <p className="text-red-600 font-bold mb-2">Došlo je do greške</p>
          <pre className="text-sm text-steel max-w-md text-center">{this.state.error.message}</pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            className="mt-4 px-4 py-2 bg-brand-orange text-white rounded-lg"
          >
            Pokušaj ponovo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
