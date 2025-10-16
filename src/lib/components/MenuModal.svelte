<script>
  let dialog = $state();

  export function open() {
    dialog?.showModal();
  }

  export function close() {
    dialog?.close();
  }
</script>

<dialog
  bind:this={dialog}
  class="menu-modal"
  onclick={(e) => e.target === dialog && close()}
>
  <div class="modal-content">
    <button class="close-button" onclick={close}>✕</button>
  </div>
</dialog>

<style>
  .menu-modal {
    border: none;
    padding: 0;
    background: transparent;
    max-width: none;
    max-height: none;
    width: 100vw;
    height: 100vh;
    margin: 0;
    inset: 0;
  }

  .menu-modal::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }

  .menu-modal[open] {
    display: flex;
    align-items: stretch;
  }

  .modal-content {
    background: #000;
    border-right: 1px solid white;
    width: 400px;
    max-width: 90vw;
    padding: 3rem 2rem;
    position: relative;
    overflow-y: auto;
    margin-right: auto;
    animation: slideInLeft 0.3s ease-out;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    transition: transform 0.2s;
  }

  .close-button:hover {
    transform: scale(1.1);
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    .modal-content {
      width: 100%;
      max-width: 100%;
    }
  }
</style>
