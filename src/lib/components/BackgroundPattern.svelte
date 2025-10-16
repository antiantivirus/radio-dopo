<script>
  import { onMount } from "svelte";
</script>

<img src="/images/pattern.svg" class="background-pattern" alt="" />

<style>
  .background-pattern {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    overflow: hidden;
    object-fit: cover;
  }

  .pattern-svg {
    width: 100%;
    height: 100%;
  }

  @keyframes float {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }
    25% {
      transform: scale(1.05) rotate(0.5deg);
    }
    50% {
      transform: scale(1.02) rotate(-0.5deg);
    }
    75% {
      transform: scale(1.08) rotate(0.3deg);
    }
  }
</style>
