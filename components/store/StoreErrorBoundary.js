'use client'

import { Component } from 'react'

export default class StoreErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[StoreErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">😕</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Halaman tidak dapat dimuat</h1>
            <p className="text-sm text-gray-500 mb-6">
              Terjadi kesalahan saat memuat halaman ini. Coba muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
