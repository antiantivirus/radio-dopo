<script>
  import { marked } from "marked";

  /**
   * Markdown - Component to render markdown content from Directus
   * Uses the 'marked' library to parse and render markdown
   */

  let { content = "", class: className = "", ...restProps } = $props();

  // Configure marked options for better rendering
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
    headerIds: true,
    mangle: false,
    sanitize: false,
  });

  // Parse the markdown content
  const html = $derived(marked.parse(content || ""));
</script>

<div class={className} {...restProps}>
  {@html html}
</div>
