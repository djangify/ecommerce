// src/utils/toast.js
export class ToastManager {
  constructor() {
    if (typeof window === 'undefined') return;
    this.createToastContainer();
  }

  createToastContainer() {
    if (document.getElementById('toast-container')) return;

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';
    document.body.appendChild(container);
  }

  show(message, type = 'info', duration = 3000) {
    if (typeof window === 'undefined') return;
    this.createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.backgroundColor = this.getBackgroundColor(type);
    toast.style.color = 'white';
    toast.style.padding = '0.75rem 1rem';
    toast.style.borderRadius = '0.375rem';
    toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    toast.style.minWidth = '250px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in-out';

    toast.textContent = message;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  getBackgroundColor(type) {
    switch (type) {
      case 'success': return '#34D399'; // Green
      case 'error': return '#EF4444';   // Red
      case 'warning': return '#F59E0B'; // Amber
      default: return '#3B82F6';        // Blue
    }
  }

  success(message, duration) {
    this.show(message, 'success', duration);
  }

  error(message, duration) {
    this.show(message, 'error', duration);
  }

  warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  info(message, duration) {
    this.show(message, 'info', duration);
  }
}

// Create a singleton instance
export const toast = new ToastManager();